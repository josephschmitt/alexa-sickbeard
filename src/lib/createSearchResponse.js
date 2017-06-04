module.exports = function createSearchResponse(shows, resp) {
  if(!shows || !shows.length) {
    return resp.say('No show found for ' + showName).send();
  }

  return resp
    .say(['Add', shows[0].name, 'to your list?'].join(' '))
    .session('promptData', buildPrompt(shows.slice(0, 5)))
    .shouldEndSession(false);
};
