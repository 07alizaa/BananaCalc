// controllers/userController.js
// Handle request/response for user-related routes.
// Currently these are stubs that return simple JSON so the frontend can be integrated.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  findByUsername,
  createUser,
  updateScore,
} = require("../models/userModel");
const { fetchPuzzles } = require("../services/bananaService");

// Use the external Banana API (via services/bananaService) for puzzles.
// We no longer keep an internal question bank here so the external API is authoritative.

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

// GET /api/puzzle?difficulty=...
exports.getPuzzle = async (req, res) => {
  try {
    const difficulty = req.query.difficulty || "easy";
    // Fetch from external Banana API. If empty, return 502 so caller knows external data is unavailable.
    const external = await fetchPuzzles(difficulty);
    if (!external || external.length === 0) {
      return res
        .status(502)
        .json({ success: false, message: "Banana API returned no puzzles" });
    }
    // Strip any server-only fields (do not expose correct answers)
    const questions = external.map((q) => ({
      id: q.id,
      problem: q.problem, // Image URL or text problem
      choices: q.choices,
    }));
    return res.json({ success: true, difficulty, questions });
  } catch (err) {
    console.error("getPuzzle error", err.message);
    return res
      .status(502)
      .json({
        success: false,
        message: "Failed to fetch puzzles from Banana API",
      });
  }
};

// POST /api/submit
exports.submit = async (req, res) => {
  try {
    const {
      questionId,
      selectedChoice,
      username: bodyUsername,
    } = req.body || {};
    // Prefer username from authenticated token (req.user) if available
    const username = (req.user && req.user.username) || bodyUsername;
    if (!username || !questionId || !selectedChoice)
      return res
        .status(400)
        .json({
          success: false,
          message: "questionId, selectedChoice and username required",
        });
    // Try to find the question from the Banana API across difficulties
    const difficulties = ["easy", "medium", "hard"];
    let found = null;
    for (const d of difficulties) {
      const pool = await fetchPuzzles(d);
      if (pool && pool.length) {
        const q = pool.find((x) => x.id === questionId);
        if (q) {
          found = q;
          break;
        }
      }
    }
    if (!found)
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });

    // Determine correct answer server-side. Banana API may provide `answer` or mark choices with `isCorrect`.
    let correctId = null;
    if (found.answer) correctId = found.answer;
    else if (Array.isArray(found.choices)) {
      const marked = found.choices.find((c) => c.isCorrect === true);
      if (marked) correctId = marked.id;
    }
    if (!correctId) {
      // Can't determine correctness from Banana API payload.
      return res
        .status(422)
        .json({
          success: false,
          message: "Cannot verify answer for this question",
        });
    }

    const correct = correctId === selectedChoice;
    const scoreDelta = correct ? 10 : 0;
    const newScore = await updateScore(username, scoreDelta);
    return res.json({ success: true, correct, scoreDelta, newScore });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "submit error" });
  }
};
