// src/app.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');

const app = express();

// JSON + cookies
app.use(express.json());
app.use(cookieParser());

// CORS: allow exact origin(s) for credentialed requests
// Set CLIENT_URL in Render to your Netlify URL (e.g. https://splendorous-treacle-719f9e.netlify.app)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser tools like curl/postman (no origin)
    if (!origin) return cb(null, true);
    // allow localhost for dev and the configured client URL
    if (origin === CLIENT_URL || origin === 'http://localhost:5173') return cb(null, true);
    // else reject
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Health route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;
