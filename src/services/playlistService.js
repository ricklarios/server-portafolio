const { getAllFollowedArtists, getRecommendations } = require('./spotifyService');
const { getGenresByMoodAndActivity } = require('./openAiService');

const createPlaylist = async (mood, activity, numberOfSongs) => {
    const allArtists = await getAllFollowedArtists();
    const genres = await getGenresByMoodAndActivity(mood, activity);
    const getRandomElements = (arr, count) => {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const randomArtists = getRandomElements(allArtists, 3);
    const randomGenres = getRandomElements(genres, 2);
    const seed_artists = randomArtists.map(artist => artist.id).filter(id => id);

    const seed_artists_final = seed_artists.join(',');
    const seed_genres_final = randomGenres.join(',');


    const playlist = await getRecommendations(seed_artists_final, seed_genres_final, numberOfSongs);
    return playlist;
};

module.exports = { createPlaylist };