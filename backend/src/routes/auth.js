const express = require("express");

const router = express.Router();

const users = [{ username: "admin", password: "admin123", fullName: "Admin User" }];

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === String(username || "").trim() && u.password === String(password || "").trim()
  );

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: { username: user.username, fullName: user.fullName }
  });
});

module.exports = router;
