const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./src/db/db');
require('dotenv').config();

connectDB();
const app = require('./src/app');

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});