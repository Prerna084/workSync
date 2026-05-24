const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const inviteRoutes = require("./src/routes/inviteRoutes");
const setupSwagger = require("./src/config/swagger");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://worksync-frontend-7uj1.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/invites", inviteRoutes);

// Initialize Swagger Documentation
setupSwagger(app);

app.get("/", (req, res) => {
  res.send("Backend running");
});

module.exports = app;
