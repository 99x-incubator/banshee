'use strict';

const builder = require('botbuilder');

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector, [
    (session) => {
        session.beginDialog('menu:root');
    },
    (session, results) => {
        session.endConversation();
    }
]);

bot.customAction({
    matches: /!/gi,
    onSelectAction: (session, args, next) => {
        session.send('wailing');
    }
})

bot.set('localizerSettings', {
    botLocalePath: './bot/locale',
    defaultLocale: 'en'
});

bot.library(require('./dialogs/menu'));
bot.library(require('./dialogs/help'));
bot.library(require('./dialogs/changeTrigger'));

module.exports = exports = bot;