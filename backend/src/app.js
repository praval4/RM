// src/app.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');

const app = express();

// Make sure CLIENT_URL is EXACT (include https://) in Render env vars
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// whitelist set for clarity
const WHITELIST = new Set([
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]);

// request logger to show incoming Origin (helps debug mismatches)
app.use((req, res, next) => {
  const origin = req.headers.origin || '<no-origin>';
  console.log(`[INCOMING] ${req.method} ${req.originalUrl}  Origin: ${origin}`);
  next();
});

const corsOptions = {
  origin: (origin, cb) => {
    // allow non-browser tools (curl/postman) which send no origin
    if (!origin) {
      console.log('[CORS] no origin (tool/server) -> allow');
      return cb(null, true);
    }

    console.log('[CORS] received origin:', origin);

    if (WHITELIST.has(origin)) {
      console.log('[CORS] origin allowed:', origin);
      return cb(null, true);
    }

    // Do NOT throw an error here. Return false so cors middleware won't set CORS headers.
    console.log('[CORS] origin NOT allowed:', origin);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  optionsSuccessStatus: 204
};

// register CORS BEFORE body parsers so preflight is handled early
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // respond to preflight

// JSON + cookies
app.use(express.json());
app.use(cookieParser());

// basic error handler (keeps stack traces server-side)
app.use((err, req, res, next) => {
  console.error('APP ERROR:', err);
  if (!res.headersSent) {
    res.status(500).json({ message: 'Internal server error' });
  } else {
    next(err);
  }
});

// Health route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;
