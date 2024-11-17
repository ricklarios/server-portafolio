const { getAllFollowedArtists, getRecommendations } = require('./spotifyService');
const { getGenresByMoodAndActivity } = require('./openAiService');

const createPlaylist = async (mood, activity, numberOfSongs) => {
    const allArtists = await getAllFollowedArtists();
    const genres = await getGenresByMoodAndActivity(mood, activity);

    const seed_artists = allArtists.slice(0, 5).map(artist => artist.id).filter(id => id);
    const seed_genres = genres.slice(0, 5).filter(genre => genre);

    const seeds = [...seed_artists, ...seed_genres].slice(0, 5);
    const seed_artists_final = seeds.filter(seed => allArtists.some(artist => artist.id === seed)).join(',');
    const seed_genres_final = seeds.filter(seed => genres.includes(seed)).join(',');


    const playlist = await getRecommendations(seed_artists_final, seed_genres_final, numberOfSongs);
    return playlist;
};

module.exports = { createPlaylist };