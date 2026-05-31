require("dotenv").config();
const express = require("express");
const cors = require("cors");
const applicationRoutes = require("./routes/application.routes");
const visaRoutes = require("./routes/visa.routes");
const path = require("path");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const checklistRoutes = require("./routes/checklist.routes");
const universityRoutes = require("./routes/university.routes");

const app = express();

app.use(cors());
app.use(express.json());

// serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/visa", visaRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/universities", universityRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/home.html"));
});

const PORT = 5050;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});