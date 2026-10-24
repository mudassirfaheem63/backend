// Sirf local development ke liye. Vercel is file ko use nahi karta (woh api/index.js use karta hai).
require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chal raha hai: http://localhost:${PORT}`));
