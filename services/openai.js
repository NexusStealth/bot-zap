const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function perguntarIA(pergunta) {
    try {
        const resposta = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: pergunta }],
        });
        return resposta.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Erro ao conversar com a OpenAI:', error.response?.data || error.message);
        return 'Erro ao consultar a IA.';
    }
}

module.exports = { perguntarIA };
