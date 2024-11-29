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

const getRecommendations = async (seedArtists, seedGenres, numberOfSongs = 12) => {
    const token = await getAccessToken();
    console.log("numberOfSongs", numberOfSongs);

    let filteredArtists = seedArtists.filter(artist =>
        artist.genres.some(genre => seedGenres.includes(genre))
    );
    console.log("filteredArtists", filteredArtists.length);

    if (filteredArtists.length === 0) {
        throw new Error('No artists found with the specified genres.');
    }
    if (filteredArtists.length >= numberOfSongs * 2) {
        filteredArtists = filteredArtists.slice(0, numberOfSongs * 2).map(artist => artist.id);
        console.log("filteredArtists", filteredArtists.length);
    }
    const songsPerArtist = Math.ceil((2 * numberOfSongs) / filteredArtists.length);
    console.log("filteredArtists", filteredArtists);

    let candidateSongs = [];

    for (const artist of filteredArtists) {
        try {
            const response = await axios.get(
                `https://api.spotify.com/v1/artists/${artist}/top-tracks`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const topTracks = response.data.tracks.slice(0, songsPerArtist);
            candidateSongs = candidateSongs.concat(topTracks);
        } catch (error) {
            console.error(`Error fetching top tracks for artist ${artist.id}:`, error);
            throw new Error('Error fetching top tracks.');
        }
    }

    if (candidateSongs.length < numberOfSongs) {
        throw new Error('Not enough candidate songs to meet the requested number.');
    }

    const shuffledSongs = candidateSongs.sort(() => 0.5 - Math.random());
    const selectedSongs = shuffledSongs.slice(0, numberOfSongs);

    return selectedSongs;
};

module.exports = {
    getAllFollowedArtists,
    getRecommendations,
};
