const { getAllFollowedArtists, getRecommendations } = require('./spotifyService');
const { getGenresByMoodAndActivity } = require('./openAiService');

const createPlaylist = async (mood, activity, numberOfSongs) => {
    const allArtists = await getAllFollowedArtists();
    const genres = await getGenresByMoodAndActivity(mood, activity);

    const playlist = await getRecommendations(allArtists, genres, numberOfSongs);
    return playlist;
};

module.exports = { createPlaylist };