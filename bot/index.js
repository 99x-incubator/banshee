'use strict';

const builder = require('botbuilder');

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const inMemoryStorage = new builder.MemoryBotStorage();

const bot = new builder.UniversalBot(connector, [
    (session) => {
        // Set initial data
        session.userData.userTrigger = '!';
        session.userData.defaultTrigger = '!';

        session.beginDialog('menu:root');
    },
    (session, results) => {
        session.endConversation();
    }
]);

bot.set('storage', inMemoryStorage);

bot.set('localizerSettings', {
    botLocalePath: './bot/locale',
    defaultLocale: 'en'
});

bot.library(require('./dialogs/help'));
bot.library(require('./dialogs/menu'));
bot.library(require('./dialogs/trigger'));
bot.library(require('./dialogs/wail'));

module.exports = exports = bot;