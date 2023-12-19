const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '6844406615:AAE0v-fOINLnWGa1g6X9hTTZvYD0-pg8JJE';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const webAppUrl = 'https://ya.ru'

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Заполни форму', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }
});