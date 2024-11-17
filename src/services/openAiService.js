const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const openAiClient = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    })
);

const getGenresByMoodAndActivity = async (mood, activity) => {
    try {
        const response = await openAiClient.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                {
                    role: 'user',
                    content: `Suggest music genres or styles that match the mood '${mood}' and the activity '${activity}'. Return the response as an array of strings without explanations, in English.`,
                },
            ],
            max_tokens: 20,
        });

        return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error fetching genres from OpenAI:', error);
        throw new Error('Failed to fetch genres.');
    }
};

module.exports = { getGenresByMoodAndActivity };
