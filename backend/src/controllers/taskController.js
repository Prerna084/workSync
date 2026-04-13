const db = require('../config/db');
const { logActivity } = require('../services/activityService');

const createTask = async (req, res) => {
  const { title } = req.body;
  const tenantId = req.user.tenant_id;
  const userId = req.user.userId;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO tasks (title, tenant_id, assigned_to) VALUES ($1, $2, $3) RETURNING *",
      [title, tenantId, userId]
    );
    const newTask = result.rows[0];

    // Log the action asynchronously
    logActivity("Created Task", `Task '${title}' created.`, userId, tenantId);

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTasks = async (req, res) => {
  const tenantId = req.user.tenant_id;
  // Apply pagination: extract limit and offset from query, parse to int
  const limit = Math.max(1, parseInt(req.query.limit)) || 10;
  const offset = Math.max(0, parseInt(req.query.offset)) || 0;

  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [tenantId, limit, offset]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Bonus: Update a task's status
const updateTaskStatus = async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;
  const tenantId = req.user.tenant_id;
  const userId = req.user.userId;

  try {
    const result = await db.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 AND tenant_id = $3 RETURNING *",
      [status, taskId, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    logActivity("Updated Task", `Task ID ${taskId} updated to ${status}.`, userId, tenantId);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTaskStats = async (req, res) => {
  const tenantId = req.user.tenant_id;

  try {
    const result = await db.query(
      "SELECT status, COUNT(*) FROM tasks WHERE tenant_id = $1 GROUP BY status",
      [tenantId]
    );

    let total = 0;
    let completed = 0;
    let pending = 0;

    result.rows.forEach(row => {
      const count = parseInt(row.count, 10);
      total += count;
      if (row.status === 'completed') completed += count;
      if (row.status === 'pending') pending += count;
    });

    res.json({ total, completed, pending });
  } catch (err) {
    console.error("Get Task Stats Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createTask, getTasks, updateTaskStatus, getTaskStats };
