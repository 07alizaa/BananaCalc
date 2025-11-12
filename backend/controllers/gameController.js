// controllers/gameController.js
// Handle game-related routes (puzzle fetching and answer submission)

const { updateScore } = require("../models/gameModel");
const { fetchPuzzles } = require("../services/bananaService");

// Cache recently served puzzles so answer validation does not rely on re-fetching the Banana API.
const questionCache = new Map();
const QUESTION_TTL_MS = 10 * 60 * 1000; // 10 minutes

function extractCorrectChoiceId(question) {
  if (!question) return null;
  if (Array.isArray(question.choices)) {
    const marked = question.choices.find((choice) => choice && choice.isCorrect);
    if (marked && marked.id !== undefined) return String(marked.id);
    if (question.answer !== undefined && question.answer !== null) {
      const answerString = String(question.answer);
      const matchByValue = question.choices.find((choice) => {
        if (!choice) return false;
        if (choice.id !== undefined && String(choice.id) === answerString) return true;
        if (choice.value !== undefined && String(choice.value) === answerString) return true;
        if (choice.text !== undefined && String(choice.text) === answerString) return true;
        return false;
      });
      if (matchByValue && matchByValue.id !== undefined) return String(matchByValue.id);
    }
  }
  if (question.correct_choice_id !== undefined && question.correct_choice_id !== null) {
    return String(question.correct_choice_id);
  }
  if (question.answer !== undefined && question.answer !== null) {
    return String(question.answer);
  }
  return null;
}

function rememberQuestion(question) {
  if (!question || !question.id) return;
  const correctId = extractCorrectChoiceId(question);
  if (!correctId) return;
  questionCache.set(question.id, {
    correctChoiceId: correctId,
    storedAt: Date.now(),
  });
}

function resolveCachedQuestion(questionId) {
  const entry = questionCache.get(questionId);
  if (!entry) return null;
  if (Date.now() - entry.storedAt > QUESTION_TTL_MS) {
    questionCache.delete(questionId);
    return null;
  }
  return entry;
}

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
    external.forEach(rememberQuestion);
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
    let correctId = null;
    const cached = resolveCachedQuestion(questionId);

    if (cached && cached.correctChoiceId) {
      correctId = cached.correctChoiceId;
    } else {
      // Fallback: attempt to locate the puzzle again from Banana API.
      const difficulties = ["easy", "medium", "hard"];
      for (const d of difficulties) {
        const pool = await fetchPuzzles(d);
        if (!pool || !pool.length) continue;
        const q = pool.find((x) => x.id === questionId);
        if (q) {
          rememberQuestion(q);
          correctId = extractCorrectChoiceId(q);
          if (correctId) break;
        }
      }
      if (!correctId) {
        return res
          .status(404)
          .json({ success: false, message: "Question not found" });
      }
    }

    const correct = String(correctId) === String(selectedChoice);
    if (correct && cached) {
      questionCache.delete(questionId);
    }
    const scoreDelta = correct ? 10 : 0;
    const newScore = await updateScore(username, scoreDelta);
    return res.json({ success: true, correct, scoreDelta, newScore });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "submit error" });
  }
};
