const axios = require('axios');
require('dotenv').config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const refresh_token = process.env.REFRESH_TOKEN;

const getAccessToken = async () => {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token,
                client_id,
                client_secret,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw new Error('Failed to fetch Spotify access token.');
    }
};

const getAllFollowedArtists = async () => {
    const token = await getAccessToken();
    let allArtists = [];
    let nextUrl = 'https://api.spotify.com/v1/me/following?type=artist&limit=50';

    try {
        while (nextUrl) {
            const response = await axios.get(nextUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { artists } = response.data;
            allArtists = allArtists.concat(artists.items);
            nextUrl = artists.next;
        }
        return allArtists;
    } catch (error) {
        console.error('Error fetching followed artists:', error);
        throw new Error('Failed to fetch followed artists.');
    }
};

const getRecommendations = async (seedArtists, seedGenres, numberOfSongs) => {
    const token = await getAccessToken();

    try {
        const response = await axios.get('https://api.spotify.com/v1/recommendations', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                seed_artists: seedArtists,
                seed_genres: seedGenres,
                limit: numberOfSongs,
            },
        });
        return response.data.tracks;
    } catch (error) {
        //console.error('Error fetching recommendations:', error);
        throw new Error('Failed to fetch song recommendations.');
    }
};

module.exports = {
    getAllFollowedArtists,
    getRecommendations,
};
