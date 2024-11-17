const { getAllFollowedArtists, getRecommendations } = require('./spotifyService');
const { getGenresByMoodAndActivity } = require('./openAiService');

const createPlaylist = async (mood, activity, numberOfSongs) => {
    const artists = await getAllFollowedArtists();
    const genres = await getGenresByMoodAndActivity(mood, activity);

    const seedArtists = artists.slice(0, 5).map(artist => artist.id).join(',');
    const seedGenres = genres.slice(0, 5).join(',');

    const playlist = await getRecommendations(seedArtists, seedGenres, numberOfSongs);
    return playlist;
};

module.exports = { createPlaylist };