'use strict';

const builder = require('botbuilder');
const library = new builder.Library('changeTrigger');

library.dialog('root', [
    (session) => {
        session.endDialog('not_implemented');
    }
]);

module.exports = library;