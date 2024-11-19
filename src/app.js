const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const app = express();
// Configure Cors
app.use(cors({
    origin: process.env.UI_URL,
}));


app.use(express.json());
app.use('/api/playlist', playlistRoutes);
app.use('/api/auth', authRoutes);
app.use(errorMiddleware);

module.exports = app;

