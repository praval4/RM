const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const cors=require('cors');
const foodPartnerRoutes = require('./routes/food-partner.routes');
app.use(cors({
  origin: "*",
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;