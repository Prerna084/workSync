const db = require('../config/db');

const logActivity = async (action, details, userId, tenantId) => {
  try {
    await db.query(
      "INSERT INTO logs (action, user_id, tenant_id) VALUES ($1, $2, $3)",
      [`${action}: ${details}`, userId, tenantId]
    );
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

module.exports = { logActivity };
