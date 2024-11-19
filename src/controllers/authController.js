const axios = require('axios');
require('dotenv').config();

const exchangeAuthorizationCode = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required.' });
    }

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI, // Asegúrate de que coincida con el registrado en Spotify
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
                }
            }
        );
        console.log('##################');

        res.status(200).json(response.data); // Devuelve el access token al cliente
    } catch (error) {
        console.error('Error exchanging authorization code:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to exchange authorization code.' });
    }
};

module.exports = {
    exchangeAuthorizationCode,
};
