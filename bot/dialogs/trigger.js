'use strict';

const builder = require('botbuilder');
const library = new builder.Library('trigger');

const trigger_options = [
    'update',
    'reset',
    'back'
];

library.dialog('root', [
    (session) => {
        const { userTrigger, defaultTrigger } = session.userData,
            message = session.localizer.gettext(session.preferredLocale(), 'current_trigger', library.name),
            prompt = session.localizer.gettext(session.preferredLocale(), 'change_trigger_prompt', library.name),
            options = session.localizer.gettext(session.preferredLocale(), 'change_trigger_options', library.name);

        session.send(`${message} '${userTrigger || defaultTrigger}'`);

        builder.Prompts.choice(session, 'change_trigger_prompt', options, {
            listStyle: builder.ListStyle.button,
            maxRetries: 1,
            retryPrompt: 'change_trigger_retry'
        });
    },
    (session, results) => {
        const { index } = results.response,
            lastOption = trigger_options.length - 1;

        if (results.resumed === builder.ResumeReason.notCompleted) {
            // Too many retry attempts. Kick the user out
            session.endDialog('incomplete_dialog');
        }
        else if (index === lastOption) {
            session.endDialog();
        }
        else if (results.response) {
            const targetDialog = trigger_options[index];
            session.beginDialog(`trigger:${targetDialog}`);
        }
    },
    (session, results) => {
        const currentTrigger = session.userData.userTrigger,
            newTrigger = results.response;
        let localizationKey;

        if (newTrigger === currentTrigger) {
            localizationKey = 'same_trigger';
        }
        else {
            localizationKey = 'new_trigger';
            session.userData.userTrigger = newTrigger;
        }

        const message = session.localizer.gettext(session.preferredLocale(), localizationKey, library.name);
        session.endDialog(`${message} ${newTrigger}`);
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
            matched = response.match(/^([_|]|[^\w|\s])$/);

        if (matched) {
            // Matches any ASCII printable special character
            session.endDialogWithResult({ response });
        }
        else {
            // Try again
            session.replaceDialog('trigger:update', {
                reprompt: true
            });
        }
    }
]).beginDialogAction('triggerUpdateHelpAction', 'triggerUpdateHelp', {
    matches: /^help$/i
});

library.dialog('reset', [
    (session) => {
        const { defaultTrigger } = session.userData;
        session.endDialogWithResult({ response: defaultTrigger });
    }
]);

// Contextual help for trigger update
library.dialog('triggerUpdateHelp',
    (session, args, next) => {
        session.send('trigger_update_help');
        session.endDialog('trigger_update_further_help');
    }
);

module.exports = exports = library;