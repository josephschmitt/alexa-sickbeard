import Alexa from 'alexa-app';

import handleLaunchIntent, {
  handleFindShowIntent,
  handleAddShowIntent,
  handleYesIntent,
  handleNoIntent,
  handleCancelIntent
} from './lib/handlers.js';

const app = new Alexa.app('sickBeard');

app.launch(handleLaunchIntent);
app.intent('FindShow', handleFindShowIntent);
app.intent('AddShow', handleAddShowIntent);
app.intent('AMAZON.YesIntent', handleYesIntent);
app.intent('AMAZON.NoIntent', handleNoIntent);
app.intent('AMAZON.CancelIntent', handleCancelIntent);

app.post = function (request, response, type, exception) {
  if (exception) {
    // Always turn an exception into a successful response
    response.clear().say('An error occured: ' + exception).send();
  }
};

export default app.lambda();
