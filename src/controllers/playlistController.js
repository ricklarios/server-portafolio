const { createPlaylist } = require('../services/playlistService');
const axios = require('axios');

const handleCreatePlaylist = async (req, res) => {
    const { mood, activity, numberOfSongs } = req.body;

    try {
        const playlist = await createPlaylist(mood, activity, numberOfSongs);
        res.json(playlist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to create playlist.' });
    }
};

/**
 * Genera un enlace de Spotify con las URIs de las canciones proporcionadas.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
const generateLink = async (req, res) => {
    const { trackUris, userAccessToken, playlistName } = req.body;
    /* console.log("trackUris", trackUris);
    console.log("userAccessToken", userAccessToken); */
    console.log("playlistName", playlistName);

    if (!trackUris || trackUris.length === 0) {
        return res.status(400).json({ error: 'No tracks provided.' });
    }

    if (!userAccessToken) {
        return res.status(401).json({ error: 'User is not authenticated with Spotify.' });
    }

    try {
        // Crear una playlist vacía
        const createPlaylistResponse = await axios.post(
            'https://api.spotify.com/v1/me/playlists',
            {
                name: playlistName,
                description: 'Generated with your favorite artists and mood!',
                public: false,
            },
            {
                headers: { Authorization: `Bearer ${userAccessToken}` },
            }
        );

        const playlistId = createPlaylistResponse.data.id;

        // Añadir las canciones a la playlist
        await axios.post(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                uris: trackUris,
            },
            {
                headers: { Authorization: `Bearer ${userAccessToken}` },
            }
        );

        // Devolver el enlace a la playlist
        const playlistUrl = `https://open.spotify.com/playlist/${playlistId}`;
        res.status(200).json({ url: playlistUrl });
    } catch (error) {
        console.error('Error creating playlist:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create playlist.' });
    }
};

module.exports = { handleCreatePlaylist, generateLink };