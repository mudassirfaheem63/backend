const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protected route par lagao: router.get("/x", protect, handler)
module.exports = async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Login zaroori hai" });

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: "User nahi mila" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Token invalid ya expire ho gaya" });
  }
};
