const express = require('express');
const { handleCreatePlaylist } = require('../controllers/playlistController');

console.log("### PLAYLIST ROUTES ###");


const router = express.Router();

router.get('/create', handleCreatePlaylist);

module.exports = router;