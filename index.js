const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch')
const token = '1952902469:AAHu2My8Dx5aAhxthgC2wiJLnZHpPCqyABQ';
const bot = new TelegramBot(token, { polling: true });
const chatIds = [];
var page = 1;
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});
const buttons = {
    "reply_markup": {
        "inline_keyboard": [
            [
                {
                    text: "(10)➡️",
                    callback_data: '1'
                },
            ],
        ],
    },
}
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const txt = msg.text.toLowerCase()
    function send(page = 1) {
        const accessKey = 'wvkoWLVPOx07gcvHvdfL-ZPSylMDpMX2W4FM0WvMMRU';
        const url = 'https://api.unsplash.com/search/photos/?query=' + txt + '&page=' + page + '&client_id=' + accessKey;
        fetch(url)
            .then((data) => {
                return data.json()
            }).then((data) => {
                let count = -1;
                data.results.forEach(photo => {
                    count++
                    if (data.results.length - 1 == count) {
                        bot.sendPhoto(chatId, photo.urls.regular, buttons)
                    } else {
                        bot.sendPhoto(chatId, photo.urls.regular)
                    }
                })
            }).catch((error) => {
                console.log(error);
            })
    }
    if (txt === '/start') {
        bot.sendMessage(chatId, `Assalomualekum ${msg.chat.first_name}, hohlagan narsangizni ingilis tilidagi nomini jo'nating. \nMasalan: 🍏 "olma" ni ingilis tilidagi tarjimasi 🍎  "apple".`);
        if (!chatIds.includes(chatId)) {
            chatIds.push(chatId);
        }
    } else if (txt === '/stop') {
        chatIds.pop(chatId);
    } else {
        send()
    }
    bot.on("callback_query", query => {
        let qry = query.data;
        if (qry == '1') {
            page++;
            send(page);
        }
    });
});
bot.on('polling_error', error => console.log(error))
const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Boshlash' },
        { command: '/stop', description: 'To\'xtatish' }
    ])
}
start()