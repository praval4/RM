const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./src/db/db');
require('dotenv').config();

connectDB();
const app = require('./src/app');

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
