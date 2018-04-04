'use strict';

const builder = require('botbuilder');
const library = new builder.Library('help');

library.dialog('root', [
    (session) => {
        session.send('intro');
        session.send('terminology');
        session.send('contextual_help');
        session.endDialog('outro');
    }
]);

module.exports = exports = library;