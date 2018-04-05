'use strict';

const builder = require('botbuilder');
const library = new builder.Library('help');

library.dialog('root', [
    (session) => {
        session.send('intro');
        session.send('terminology');
        session.send('contextual_help');
        session.send('cancelling');
        session.endDialog('outro');
    }
]).triggerAction({
    matches: /^help$/i,
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});

module.exports = exports = library;