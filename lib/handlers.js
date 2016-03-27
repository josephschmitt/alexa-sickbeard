'use strict';

var _ = require('underscore');
var SickBeard = require('node-sickbeard');
var utils = require('./utils.js');

var WELCOME_DESCRIPTION = 'This skill allows you to manage your SickBeard movie list.';
var HELP_RESPONSE = ['You can ask SickBeard about the movies in your queue or add new movies',
    'to it. Try asking "is Silicon Valley on the list?". If it\'s not and you want to add it, try',
    'saying "add Silicon Valley".'].join(' ');

var config = require('dotenv').config();
var sb = new SickBeard({
  url: config.SB_URL,
  apikey: config.SB_API_KEY
});

function handleLaunchIntent(req, resp) {
  resp
    .say(WELCOME_DESCRIPTION)
    .say(HELP_RESPONSE)
    .send();
}

function handleFindShowIntent(req, resp) {
  var showName = req.slot('showName');

  sb.cmd('shows').then(function (searchResp) {
    var shows = searchResp.data;
    var result = shows && Object.keys(shows).length ? _.find(shows, function (show) {
      return show.show_name.toLowerCase().indexOf(showName.toLowerCase()) >= 0;
    }) : null;

    if (!result) {
      resp.say('Couldn\'t find ' + showName + ' queued for download. ');

      sb.cmd('sb.searchtvdb', {name: showName}).then(function (searchResults) {
        utils.sendSearchResponse(searchResults.data.results, resp);
      });
    }
    else {
      resp
        .say(['It looks like', result.show_name, 'is already on your list.'].join(' '))
        .send();
    }
  });

  //Async response
  return false;
}

function handleAddShowIntent(req, resp) {
  var showName = req.slot('showName');

  sb.cmd('sb.searchtvdb', {name: showName}).then(function (searchResults) {
    utils.sendSearchResponse(searchResults.data.results, resp);
  });

  //Async response
  return false;
}

function handleYesIntent(req, resp) {
  var promptData = req.session('promptData');
  var show;

  if (!promptData) {
    console.log('Got a AMAZON.YesIntent but no promptData. Ending session.');
    resp.send();
  }
  else if (promptData.yesAction === 'addShow') {
    show = promptData.searchResults[0];

    sb.cmd('show.addnew', {
      tvdbid: show.tvdbid,
      status: 'wanted'
    }).then(function () {
      resp
        .say(promptData.yesResponse)
        .send();
    });

    //Async response
    return false;
  }
  else {
    console.log("Got an unexpected yesAction. PromptData:");
    console.log(promptData);
    resp.send();
  }
}

function handleNoIntent(req, resp) {
  var promptData = req.session('promptData');

  if (!promptData) {
    console.log('Got a AMAZON.YesIntent but no promptData. Ending session.');
    resp.send();
  }
  else if (promptData.noAction === 'endSession') {
    resp.say(promptData.noResponse).send();
  }
  else if (promptData.noAction === 'suggestNextShow') {
    var shows = promptData.searchResults;
    resp
      .say(promptData.noResponse)
      .session('promptData', utils.buildPrompt(shows.slice(1)))
      .shouldEndSession(false)
      .send();
  }
  else {
    console.log("Got an unexpected noAction. PromptData:");
    console.log(promptData);
    resp.send();
  }
}

function handleCancelIntent(req, resp) {
  resp.shouldEndSession(true).send();
}

function handleCancelIntent(req, resp) {
  resp.say(HELP_RESPONSE).send();
}

module.exports = {
  handleFindShowIntent: handleFindShowIntent,
  handleAddShowIntent: handleAddShowIntent,
  handleYesIntent: handleYesIntent,
  handleNoIntent: handleNoIntent,
  handleCancelIntent: handleCancelIntent
};
