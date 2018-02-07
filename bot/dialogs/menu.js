'use strict';

const builder = require('botbuilder');
const library = new builder.Library('menu');

const menu = [
    'changeTrigger',
    'help'
];

library.dialog('root', [
    (session, args) => {
        const prompt = (args && args.reprompt) ? 'reprompt' : 'initial_prompt',
            items = session.localizer.gettext(session.preferredLocale(), 'menu_items', 'menu');

        builder.Prompts.choice(session, prompt, items,
            { listStyle: builder.ListStyle.button, maxRetries: 1, retryPrompt: 'retry_prompt', });
    },
    (session, results) => {
        if (results.response) {
            const { index } = results.response,
                targetDialog = menu[index];

            session.beginDialog(`${targetDialog}:root`);
        }
        else if (results.resumed === builder.ResumeReason.notCompleted) {
            session.endConversation('incomplete_conversation');
        }
    },
    (session, results) => {
        builder.Prompts.confirm(session, 'repeat_confirm', { maxRetries: 1 });
    },
    (session, results) => {
        if (results.response) {
            session.replaceDialog('menu:root', { reprompt: true });
        }
        else if (results.resumed === builder.ResumeReason.notCompleted) {
            session.endConversation('incomplete_conversation');
        }
        else {
            session.endConversation('complete_conversation');
        }
    }
]).triggerAction({
    matches: /^menu$/i,
    confirmPrompt: 'trigger_confirm'
});;

module.exports = library;