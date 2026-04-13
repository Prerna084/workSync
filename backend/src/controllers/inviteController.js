const db = require('../config/db');
const { logActivity } = require('../services/activityService');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateInvite = async (req, res) => {
  const tenantId = req.user.tenant_id;
  const userId = req.user.userId;

  // Code generation (could be human-readable or secure random)
  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  // Expires in 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  try {
    const result = await db.query(
      "INSERT INTO invites (code, tenant_id, expires_at) VALUES ($1, $2, $3) RETURNING *",
      [code, tenantId, expiresAt]
    );

    logActivity("Invite Generated", `Invite code ${code} generated.`, userId, tenantId);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Generate Invite Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const joinWithInvite = async (req, res) => {
  const { code, email, password } = req.body;

  try {
    // Check invite code
    const inviteResult = await db.query("SELECT * FROM invites WHERE code = $1", [code]);
    if (inviteResult.rows.length === 0) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    const invite = inviteResult.rows[0];
    if (new Date() > new Date(invite.expires_at)) {
      return res.status(400).json({ message: "Invite code has expired" });
    }

    // Hash password & create user
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const userResult = await db.query(
      "INSERT INTO users (email, password, role, tenant_id) VALUES ($1, $2, 'USER', $3) RETURNING *",
      [email, passwordHash, invite.tenant_id]
    );
    const user = userResult.rows[0];

    // Delete the invite code so it can't be reused, or keep it depending on usage model.
    // For SaaS, usually invite links are either single-use or multi-use. Let's make it single use.
    await db.query("DELETE FROM invites WHERE id = $1", [invite.id]);

    logActivity("User Joined", `User ${email} joined the organization.`, user.id, invite.tenant_id);

    // Provide Token and Login immediately
    const token = jwt.sign(
      { userId: user.id, tenant_id: user.tenant_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: "Joined successfully",
      user: { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id },
      token
    });
  } catch (err) {
    console.error("Join Invite Error:", err);
    if (err.code === '23505') {
      return res.status(409).json({ message: "Email already exists." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { generateInvite, joinWithInvite };
