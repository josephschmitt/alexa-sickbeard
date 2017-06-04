var handlers = require('./lib/handlers.js');

var alexa = require('alexa-app');
var app = new alexa.app('sickBeard');

app.launch(handlers.handleLaunchIntent);
app.intent('FindShow', handlers.handleFindShowIntent);
app.intent('AddShow', handlers.handleAddShowIntent);
app.intent('AMAZON.YesIntent', handlers.handleYesIntent);
app.intent('AMAZON.NoIntent', handlers.handleNoIntent);
app.intent('AMAZON.CancelIntent', handlers.handleCancelIntent);

app.post = function(request, response, type, exception) {
  if (exception) {
    // Always turn an exception into a successful response
    response.clear().say('An error occured: ' + exception).send();
  }
};

module.exports = app.lambda();
