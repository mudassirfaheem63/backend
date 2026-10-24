const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");

const app = express();

const allowed = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || allowed.includes(origin))
        return cb(null, true);
      cb(new Error("CORS: yeh origin allowed nahi hai"));
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, message: "API chal rahi hai" }));

// Har request se pehle DB connect (cached)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database se connect nahi ho paya. MONGODB_URI check karo." });
  }
});

app.use("/api/auth", authRoutes);

// ---- Apne routes yahan add karo, jaise: ----
// app.use("/api/todos", require("./routes/todos"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

module.exports = app;
