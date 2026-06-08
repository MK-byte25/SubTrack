const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const subRoutes = require('./routes/subRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/subscriptions', subRoutes);

// Database Connection & Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => console.log('Server running'));
  })
  .catch((err) => console.log(err));