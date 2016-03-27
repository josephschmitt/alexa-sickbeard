'use strict';

var handlers = require('./handlers.js');

var alexa = require('alexa-app');
var app = new alexa.app('sickBeard');

app.launch(handlers.handleLaunchIntent);
app.intent('FindShow', handlers.handleFindShowIntent);
app.intent('AddShow', handlers.handleAddShowIntent);
app.intent('AMAZON.YesIntent', handlers.handleYesIntent);
app.intent('AMAZON.NoIntent', handlers.handleNoIntent);
app.intent('AMAZON.CancelIntent', handlers.handleCancelIntent);

module.exports = app;
