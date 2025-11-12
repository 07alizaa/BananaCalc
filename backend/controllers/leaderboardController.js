// controllers/leaderboardController.js
// Handle leaderboard-related routes

const { getTopUsers } = require("../models/leaderboardModel");

// GET /api/leaderboard?limit=10
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit } = req.query || {};
    const topUsers = await getTopUsers(limit);
    const leaderboard = topUsers.map((row, index) => ({
      rank: index + 1,
      username: row.username,
      score: Number(row.score) || 0,
    }));
    return res.json({ success: true, leaderboard });
  } catch (err) {
    console.error("getLeaderboard error:", err);
    return res
      .status(500)
      .json({ success: false, message: "leaderboard error" });
  }
};
