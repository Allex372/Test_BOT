const TelegramAPI = require('node-telegram-bot-api');
const request = require('request')
const APIKey = '702fbfcfbbaa1dca828892641c9c3942'
const token = '1746646117:AAFL3Oy1ikC3DKN3QON_BfUnGvz2IxKYrJA'
const bot = new TelegramAPI(token, {polling: true});
const dotenv = require('dotenv')
    .config();

bot.setMyCommands([
    {command: '/start', description: 'Вітання'},
    {command: '/info', description: 'Інформація'},
    {command: '/weather', description: 'Погода'},
    {command: '/money', description: 'Курс валют'},
    {command: '/game', description: 'Гра'}
]);

const gameObject = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
};

const numb = {};

const againOption = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Ще разульку?)', callback_data: '/again'}]
        ]
    })
}

const startGame = async (chatID) => {
    await bot.sendMessage(chatID, 'Давай зіграємо у гру. Я загадав цифру від 0 до 9, спробуй її відгадати...')
    const number = Math.floor(Math.random() * 10);
    numb[chatID] = number;
    return bot.sendMessage(chatID, 'РАЗ, ДВА, ТРИ ПОЧАЛИ !!!', gameObject)
}


const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatID = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatID, 'https://cdn.tlgrm.ru/stickers/897/665/897665b6-ec1d-44b4-975f-a1ee38428ae8/192/1.webp')
            return bot.sendMessage(chatID, `Welcome to JarviseBOT !)`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatID, `I'm happy to be Your friend ${msg.from.username ? msg.from.username : msg.from.first_name}`)
        }
        if (text === '/weather') {
            try {
                await request('http://api.openweathermap.org/data/2.5/weather?q=Lviv&appid=702fbfcfbbaa1dca828892641c9c3942',
                    async function (error, response, body) {
                        const data = JSON.parse(body)
                        return bot.sendMessage(chatID, `Середня температура протягом дня: ${Math.floor(data.main.temp) - 273},
Відчувається як: ${Math.floor(data.main.feels_like) - 273},`);
                    })
            } catch (e) {
                console.log(e)
            }
        }
        if (text === '/money') {
            request('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
                function (err, res, body) {
                    const data = JSON.parse(body)
                    const messageUSD = `Валюта: ${data[26].txt},
Купівля:${data[26].rate}`;
                    const messageEUR = `
Валюта: ${data[32].txt},
Купівля:${data[32].rate}`
                    return bot.sendMessage(chatID, `${messageUSD},
                         ${messageEUR}`)
                })
        }
        if (text === '/game') {
            await bot.sendMessage(chatID, 'Давай зіграємо у гру. Я загадав цифру від 0 до 9, спробуй її відгадати...')
            const number = Math.floor(Math.random() * 10);
            numb[chatID] = number;
            return bot.sendMessage(chatID, 'РАЗ, ДВА, ТРИ ПОЧАЛИ !!!', gameObject)
        }
        // return bot.sendMessage(chatID, 'Я тебе не розумію бройлєр')
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatID = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatID)
        }
        if (data === numb[chatID]) {
            return bot.sendMessage(chatID, `ТАК! Ти просто божевільний, ВГАДАВ!! ${numb[chatID]}`, againOption)
        } else {
            return bot.sendMessage(chatID, `Нііііііі... мимо, мимо, мимо ${numb[chatID]}`, againOption)
        }
    });
}
start();

