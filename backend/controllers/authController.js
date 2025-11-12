// controllers/authController.js
// Handle authentication-related routes (signup, login)

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  findByUsername,
  createUser,
} = require("../models/authModel");

// POST /signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "username, email and password are required",
        });
    }
    const existing = await findByUsername(username);
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Username taken" });
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await createUser({ username, email, passwordHash });
    // Issue JWT token for immediate use by frontend (stored in sessionStorage)
    const token = jwt.sign(
      { username, id: created.id },
      process.env.JWT_SECRET || "replace_this_secret",
      { expiresIn: "8h" }
    );
    return res.json({
      success: true,
      token,
      user: { id: created.id, username, email, score: 0 },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "signup error" });
  }
};

// POST /login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "username and password required" });

    const user = await findByUsername(username);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.JWT_SECRET || "replace_this_secret",
      { expiresIn: "8h" }
    );
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        score: user.score,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: "login error" });
  }
};
