require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dbConnect = require('./configure/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes')
const notificationsRoute = require('./routes/notificationRoutes');

dbConnect();

const port = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('📡 API server is running...');
});

// Routes
app.use('/api/users', authRoutes);
app.use('/api/postsapi', postRoutes);
app.use('/api/usersprofile', profileRoutes);
app.use('/api', require('./routes/messageroutes'));
app.use('/api', require('./routes/friendRoutes'));
app.use('/api/pop', notificationsRoute)

app.listen(port, () => {
  console.log(`🟢Backend live at http://localhost:${port}`);
});

