const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');

const app = express();

// IMPORTANT: replace this with the exact origin of your frontend
const FRONTEND_ORIGIN = 'https://splendorous-treacle-719f9e.netlify.app';

app.use(cors({
  origin: FRONTEND_ORIGIN,   // must be exact origin when credentials: true
  credentials: true,         // sets Access-Control-Allow-Credentials: true
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'] // include any custom headers you use
}));

// Ensure OPTIONS preflight responses are handled
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;
