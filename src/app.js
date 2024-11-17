const express = require('express');
const playlistRoutes = require('./routes/playlistRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json());
app.use('/api/playlist', playlistRoutes);
app.use(errorMiddleware);

module.exports = app;