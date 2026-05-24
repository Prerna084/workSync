const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const inviteRoutes = require('./src/routes/inviteRoutes');
const setupSwagger = require('./src/config/swagger');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    // Dynamically allow any localhost port or any Render subdomain
    if (origin.startsWith('http://localhost:') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));



app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invites', inviteRoutes);

// Initialize Swagger Documentation
setupSwagger(app);

// General simple route check
app.get('/', (req, res) => {
  res.send('WorkSync API is running');
});

module.exports = app;
