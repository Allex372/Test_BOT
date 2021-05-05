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
    {command: '/money', description: 'Курс валют'}
])

const infoObject = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Info', callback_data: '/info'}]
        ]
    })
}

const start = () => {
    try {
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
                request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
                    function (err, res, body) {
                        const data = JSON.parse(body)
                        const messageUSD = `Валюта: ${data[0].ccy},
Купівля:${data[0].buy},
Продаж: ${data[0].sale}`;
                        const messageEUR = `
Валюта: ${data[1].ccy},
Купівля:${data[1].buy},
Продаж: ${data[1].sale}`

                        return bot.sendMessage(chatID, `${messageUSD},
                         ${messageEUR}`)
                    })
            }
            // return bot.sendMessage(chatID, 'Я тебе не розумію бройлєр')
        })
    } catch (e) {
        console.log(e)
    }
}
start();

