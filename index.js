const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

// replace the value below with the Telegram token you receive from @BotFather
const token = "6844406615:AAE0v-fOINLnWGa1g6X9hTTZvYD0-pg8JJE";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const webAppUrl = "https://ulbitv-telegram-web-app.netlify.app/";

const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Нажми на кнопку в панели кнопок", {
      reply_markup: {
        keyboard: [
          [{ text: "Заполни форму", web_app: { url: webAppUrl + "form" } }],
        ],
      },
    });

    await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Заполни форму", web_app: { url: webAppUrl + "form" } }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg.web_app_data.data);

      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(
        chatId,
        `
          Ваша страна: ${data?.country}, ваша улица: ${data?.street}
        `,
      );
    } catch (e) {
      console.warn(e);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, product, totalPrice } = req.body;

  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Успешная покупка",
      input_message_content: {
        message_text: `Приобретен товар на сумму  ${totalPrice}`,
      },
    });

    return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Не удалось приобрести товар",
      input_message_content: {
        message_text: "Не удалось приобрести товар",
      },
    });

    return res.status(500).json({});
  }
});

const PORT = 8000;

app.listen(PORT, () => console.log("Server started on port " + PORT));
