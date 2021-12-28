require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const Anime_Images = require('anime-images-api');
const API = new Anime_Images();



const bot = new TelegramBot(process.env.TOKEN, {polling:true});

// Команда Старт
bot.setMyCommands([
    {command: "/start", description: "Начальное приветствие"}
    ])

// Конфиг клавиатуры
const keyboard = [
  [
    {
      text: 'Фото обнимашек', // текст на кнопке
      callback_data: 'hug' // данные для обработчика событий
    }
  ],
  [
    {
      text: 'Фото поцелуя',
      callback_data: 'kiss'
    }
  ],
  [
    {
      text: 'Фото удара',
      callback_data: 'punch' 
    }
  ]
];

bot.on("message", (msg) => {
  const chatId = msg.chat.id, 
  name = msg.chat.first_name, 
  text = msg.text;
  if (text === "/start") {
    bot.sendMessage(
      chatId,
      `Привет, ${name}! Выбери, пожалуйста, на какую тему из предложенных ты бы хотел получить фото`, {
        // прикрутим клаву
        reply_markup: {
          inline_keyboard: keyboard
        }
      }
    );
  } else {
    bot.sendMessage(chatId, 'Я тебя не понимаю. Выбери что-то из клавиатуры', {
      // прикрутим клаву
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  }
});

// Обработчик нажатий на клавиатуру
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'hug') { // если обнимашки
    async function getIMG(){
      let { image } = await API.sfw.hug();
      bot.sendPhoto(chatId, image, {
        // прикрутим клаву
        reply_markup: {
          inline_keyboard: keyboard
        }
      });
    }
    getIMG();
  }

  else if (query.data === 'kiss') { // если поцелуй
    async function getIMG(){
      let { image } = await API.sfw.kiss();
      bot.sendPhoto(chatId, image, {
        // прикрутим клаву
        reply_markup: {
          inline_keyboard: keyboard
        }
      });
    }
    getIMG();
  }

  else if (query.data === 'punch') { // если punch
    async function getIMG(){
      let { image } = await API.sfw.punch();
      bot.sendPhoto(chatId, image, {
        // прикрутим клаву
        reply_markup: {
          inline_keyboard: keyboard
        }
      });
    }
    getIMG();
  }

  else {
    bot.sendMessage(chatId, 'Я тебя не понимаю. Выбери что-то из клавиатуры', {
      // прикрутим клаву
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  }
});