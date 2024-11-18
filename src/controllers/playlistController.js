const { createPlaylist } = require('../services/playlistService');

const handleCreatePlaylist = async (req, res) => {
    const { mood, activity, numberOfSongs } = req.body;

    try {
        const playlist = await createPlaylist(mood, activity, numberOfSongs);
        console.log(playlist);

        res.json(playlist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to create playlist.' });
    }
};

module.exports = { handleCreatePlaylist };