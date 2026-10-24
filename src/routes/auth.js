const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email aur password teeno chahiye" });
  if (password.length < 6)
    return res.status(400).json({ message: "Password kam az kam 6 characters ka ho" });

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Is email se account pehle se hai" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "Email aur password chahiye" });

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) return res.status(401).json({ message: "Email ya password galat hai" });

  res.json({ token: signToken(user._id), user: publicUser(user) });
});

// POST /api/auth/logout  (JWT stateless hai, asli logout frontend token delete karke karta hai)
router.post("/logout", (req, res) => res.json({ message: "Logout ho gaya" }));

// GET /api/auth/me  (protected)
router.get("/me", protect, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
