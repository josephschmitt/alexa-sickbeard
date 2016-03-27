function buildPrompt(shows) {
  var promptData = {
      searchResults: shows.slice(0, 5),
      yesAction  : 'addShow',
      yesResponse: ['Added', shows[0].name, 'to your list of shows to download.'].join(' ')
  };

  if (shows.length > 1) {
    promptData.noAction = 'suggestNextShow';
    promptData.noResponse = 'Ok, did you mean ' + shows[1].name + '?';
  }
  else {
    promptData.noAction = 'endSession';
    promptData.noResponse = 'Ok. I\'m out of suggestions. Sorry about that.';
  }

  return promptData;
}

function sendSearchResponse(shows, resp) {
  if(!shows || !shows.length) {
    return resp.say('No show found for ' + showName).send();
  }

  resp
    .say(['Add', shows[0].name, 'to your list?'].join(' '))
    .session('promptData', buildPrompt(shows.slice(0, 5)))
    .shouldEndSession(false)
    .send();
}

module.exports = {
  buildPrompt: buildPrompt,
  sendSearchResponse: sendSearchResponse
};
