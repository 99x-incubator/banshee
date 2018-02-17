'use strict';

const builder = require('botbuilder');
const library = new builder.Library('trigger');

library.dialog('root', [
    (session) => {
        const { trigger } = session.userData,
            message = session.localizer.gettext(session.preferredLocale(), 'current_trigger', library.name);

        session.send(`${message} '${trigger}'`);
        builder.Prompts.confirm(session, 'change_trigger_prompt', {
            maxRetries: 1
        });
    },
    (session, results) => {
        if (results.resumed === builder.ResumeReason.notCompleted) {
            // Too many retry attempts. Kick the user out
            session.endDialog('incomplete_dialog');
        }
        else if (results.response) {
            // User answered in the affirmative
            session.beginDialog('trigger:update');
        }
        else {
            // User answered in the negative
            session.endDialog();
        }
    },
    (session, results) => {
        const trigger = results.response,
            message = session.localizer.gettext(session.preferredLocale(), 'new_trigger', library.name);

        session.userData.trigger = trigger;
        session.endDialog(`${message} ${trigger}`);
    }
]);

library.dialog('update', [
    (session, args) => {
        if (args && args.reprompt) {
            builder.Prompts.text(session, 'enter_trigger_reprompt');
        }
        else {
            builder.Prompts.text(session, 'enter_trigger_prompt');
        }
    },
    (session, results) => {
        const { response } = results,
            matched = response.match(/[\w]/);

        if (matched) {
            session.endDialogWithResult({ response });
        }
        else {
            // Try again
            session.replaceDialog('trigger:update', {
                reprompt: true
            });
        }
    }
]);

module.exports = library;