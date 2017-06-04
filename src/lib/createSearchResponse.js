import buildPrompt from './buildPrompt.js';
import {
  ADD_SHOW,
  NO_SHOW_FOUND
} from './responses.js';

export default function createSearchResponse(shows, req, resp) {
  const showName = req.slot('showName');

  if (!shows || !shows.length) {
    return resp.say(NO_SHOW_FOUND(showName)).send();
  }

  return resp
    .say(ADD_SHOW(shows[0].name))
    .session('promptData', buildPrompt(shows.slice(0, 5)))
    .shouldEndSession(false);
}
