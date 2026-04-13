const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { orgName, email, password } = req.body;
  if (!orgName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // 1. Create Organization
    const orgResult = await db.query(
      "INSERT INTO organizations (name) VALUES ($1) RETURNING *",
      [orgName]
    );
    const org = orgResult.rows[0];

    // 2. Create Admin User for the Organization
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const userResult = await db.query(
      "INSERT INTO users (email, password, role, tenant_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, passwordHash, 'ADMIN', org.id]
    );
    const user = userResult.rows[0];

    // 3. Generate Token
    const token = jwt.sign(
      { userId: user.id, tenant_id: user.tenant_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: "Organization and Admin created successfully.",
      user: { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id },
      org: { id: org.id, name: org.name },
      token
    });
  } catch (err) {
    console.error("Register Error:", err);
    if (err.code === '23505') { // Unique violation PG error string code
      return res.status(409).json({ message: "Email already exists." });
    }
    res.status(500).json({ message: "Internal server error." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user.id, tenant_id: user.tenant_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id },
      token
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { register, login };
