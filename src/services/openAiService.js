const { OpenAI } = require('openai');
require('dotenv').config();

const openAiClient = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY,
    }
);

const getGenresByMoodAndActivity = async (mood, activity) => {
    try {
        const openAiResponse = await openAiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                {
                    role: 'user', content: `Sugiere géneros o estilos musicales que combinen con el estado de ánimo '${mood}' y la actividad '${activity}'.Devuelve la respuesta en un array de strings sin explicaciones adicionales y en inglés.
            Ejemplo: ["rock", "jazz", "lo-fi"]` }
            ],
            max_tokens: 20,
        });
        console.log(openAiResponse.choices[0].message.content);


        return JSON.parse(openAiResponse.choices[0].message.content);
    } catch (error) {
        console.error('Error fetching genres from OpenAI:', error);
        throw new Error('Failed to fetch genres.');
    }
};

module.exports = { getGenresByMoodAndActivity };
