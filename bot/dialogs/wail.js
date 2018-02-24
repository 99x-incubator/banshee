'use strict';

const builder = require('botbuilder');
const library = new builder.Library('wail');

library.dialog('wail', (session, args) => {
    session.endConversation("wailing");
})
.triggerAction({
    onFindAction: (context, callback) => {
        const message = context.message.text,
            { userTrigger } = context.userData;

        if (message === userTrigger) {
            // Trigger wail dialog
            callback(null, 1.0);
        }
        else {
            callback(null, 0.0);
        }
    },
    onSelectAction: (session, args, next) => {
        session.beginDialog(args.action, args);
    }
});

module.exports = library;