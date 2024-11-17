const express = require('express');
const { handleCreatePlaylist } = require('../controllers/playlistController');

const router = express.Router();

router.post('/create', handleCreatePlaylist);

module.exports = router;