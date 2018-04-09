'use strict';

const builder = require('botbuilder');
const library = new builder.Library('menu');

const menu_options = [
    'wail',
    'trigger',
    'help',
    'exit'
];

library.dialog('root', [
    (session, args) => {
        const prompt = (args && args.reprompt) ? 'welcome_reprompt' : 'welcome_prompt',
            options = session.localizer.gettext(session.preferredLocale(), 'menu_options', library.name);

        builder.Prompts.choice(session, prompt, options, {
            listStyle: builder.ListStyle.button,
            maxRetries: 1,
            retryPrompt: 'welcome_retry'
        });
    },
    (session, results) => {
        if (results.resumed === builder.ResumeReason.notCompleted) {
            // Too many retry attempts. Kick the user out
            session.endDialog('incomplete_dialog');
        }
        else {
            const { index } = results.response,
                lastOption = menu_options.length - 1;

            if (index === lastOption) {
                session.endDialog('farewell');
            }
            else if (results.response) {
                const targetDialog = menu_options[index];
                session.beginDialog(`${targetDialog}:root`);
            }
        }
    },
    (session, results) => {
        // Show the menu again
        session.replaceDialog('menu:root', {
            reprompt: true
        });
    }
]).triggerAction({
    matches: /^menu$/i,
    confirmPrompt: 'menu_trigger_confirm'
}).endConversationAction('endConversationAction', 'farewell', {
    matches: /^cancel$|^nevermind$|^goodbye$/i
});

module.exports = exports = library;