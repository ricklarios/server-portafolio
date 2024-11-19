const express = require('express');
const { handleCreatePlaylist, generateLink } = require('../controllers/playlistController');

console.log("### PLAYLIST ROUTES ###");


const router = express.Router();

router.get('/create', handleCreatePlaylist);
router.post('/generate-link', generateLink);

module.exports = router;