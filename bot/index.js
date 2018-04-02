'use strict';

const dotenv = require('dotenv-safe');
const builder = require('botbuilder');
const { MongoDbBotStorage, MongoDBStorageClient } = require("mongo-bot-storage");

// Load environment variables from .env file
dotenv.config();

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector, [
    (session) => {
        // Set initial data
        session.userData.defaultTrigger = process.env.DEFAULT_TRIGGER;

        session.beginDialog('menu:root');
    },
    (session, results) => {
        session.endConversation();
    }
]);

bot.set('storage', new MongoDbBotStorage(new MongoDBStorageClient({
    url: process.env.DATABASE_URL,
    mongoOptions: {}
})));

bot.set('localizerSettings', {
    botLocalePath: './bot/locale',
    defaultLocale: 'en'
});

bot.library(require('./dialogs/help'));
bot.library(require('./dialogs/menu'));
bot.library(require('./dialogs/trigger'));
bot.library(require('./dialogs/wail'));

module.exports = exports = bot;