const TelegramApi = require("node-telegram-bot-api");
const {againOptions, gameOptions}= require('./options')
const token = "7134138988:AAFKPmG5JT7ebPf4uh-fOxegLRbW5SX9RAs";

const bot = new TelegramApi(token, { polling: true });

const chats = {};



const startGame = async(chatId)=>{
    await bot.sendMessage(
        chatId,
        `Я загадаю цифру від 0 до 9, а ти маєш її відгадати`
    );
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Відгадуй", gameOptions);
}

const start = () => {
	bot.setMyCommands([
		{ command: "/start", description: "Привітання" },
		{ command: "/info", description: "Інформація про бота" },
		// { command: "/help", description: "Помощь" },
		// { command: "/weather", description: "Погода" },
		{ command: "/game", description: "Гра відгадай число" },
	]);

	bot.on("message", async (msg) => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === "/start") {
			return bot.sendMessage(
				chatId,
				`Приємно познайомитись, ${msg.from.first_name} ${msg.from.last_name}`
			);
		}
		if (text === "/info") {
			await bot.sendSticker(
				chatId,
				`https://tlgrm.eu/_/stickers/463/343/46334338-7539-4dae-bfb6-29e0bb04dc2d/192/21.webp`
			);
			return bot.sendMessage(
				chatId,
				` Ласкаво просимо в телеграм бот by Taras Veremchuk`
			);
		}
		if (text === "/game") {
		    return	startGame(chatId)
		}
		return bot.sendMessage(chatId, `Я тебе не розумію, спробуй ще раз`);
	});
};

bot.on("callback_query", async msg => {
	const data = msg.data;
	const chatId = msg.message.chat.id;
    if (data === '/again') {
		    return	startGame(chatId)
    }
    if (Number(data) === chats[chatId]) {
        return  bot.sendMessage(chatId, `Вітаю ти відгадав цифру ${chats[chatId]}`, againOptions)
    }
    else{
        return  bot.sendMessage(chatId, `Нажаль ти не відгадав, бот загадав цифру ${chats[chatId]}`, againOptions)
    }
});

start();
