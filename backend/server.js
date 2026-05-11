require("dotenv").config();
const express = require("express");
const cors = require("cors");
const applicationRoutes = require("./routes/application.routes");
const visaRoutes = require("./routes/visa.routes");


const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/visa", visaRoutes);

app.get("/", (req, res) => {
  res.send("AIP Backend Running");
});

const PORT = 5050;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});