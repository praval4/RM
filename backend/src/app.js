// src/app.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');

const app = express();

// ====== ENV ======
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
console.log("APP START - CLIENT_URL =", CLIENT_URL);

// ====== WHITELIST ======
const WHITELIST = new Set([
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]);

// ====== DEBUG LOGGER ======
app.use((req, res, next) => {
  const origin = req.headers.origin || '<no-origin>';
  console.log(`[INCOMING] ${req.method} ${req.originalUrl}  Origin: ${origin}`);
  next();
});

// ====== CORS OPTIONS ======
const corsOptions = {
  origin: (origin, cb) => {
    // Allow non-browser tools (curl, Postman)
    if (!origin) {
      console.log("[CORS] No origin -> allow");
      return cb(null, true);
    }

    console.log("[CORS] Received origin:", origin);

    if (WHITELIST.has(origin)) {
      console.log("[CORS] Allowed:", origin);
      return cb(null, true);
    }

    console.log("[CORS] BLOCKED:", origin);
    // IMPORTANT: do NOT throw error. Just reject by returning false.
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  optionsSuccessStatus: 204
};

// ====== REGISTER CORS BEFORE PARSERS ======
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // explicit preflight handler

// ====== PARSERS ======
app.use(express.json());
app.use(cookieParser());

// ====== HEALTH ROUTE ======
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ====== API ROUTES ======
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

// ====== ERROR HANDLER (CATCH ALL) ======
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  if (!res.headersSent) {
    return res.status(500).json({ message: 'Internal server error' });
  }
  next(err);
});

module.exports = app;
