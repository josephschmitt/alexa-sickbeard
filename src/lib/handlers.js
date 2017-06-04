import * as api from './api.js';
import buildPrompt from './buildPrompt.js';
import createSearchResponse from './createSearchResponse.js';

import {
  ALREADY_WANTED,
  HELP_RESPONSE,
  NO_SHOW_QUEUED,
  WELCOME_DESCRIPTION
} from './responses.js';

export default function handleLaunchIntent(req, resp) {
  resp
    .say(WELCOME_DESCRIPTION())
    .say(HELP_RESPONSE())
    .send();
}

export function handleFindShowIntent(req, resp) {
  const showName = req.slot('showName');

  return api.list().then((shows) => {
    const result = shows && Object.keys(shows).length ? shows.find((show) => {
      return show.show_name.toLowerCase().indexOf(showName.toLowerCase()) >= 0;
    }) : null;

    if (!result) {
      resp.say(NO_SHOW_QUEUED(showName));

      return api.search(showName).then((shows) => {
        createSearchResponse(shows, req, resp).send();
      });
    }
    else {
      resp
        .say(ALREADY_WANTED(result.show_name.replace('\'s', 's')))
        .send();
    }
  });
}

export function handleAddShowIntent(req, resp) {
  const showName = req.slot('showName');

  return api.search(showName).then((shows) => {
    createSearchResponse(shows, req, resp).send();
  });
}

export function handleYesIntent(req, resp) {
  const promptData = req.session('promptData');
  let show;

  if (!promptData) {
    console.log('Got a AMAZON.YesIntent but no promptData. Ending session.');
    resp.shouldEndSession(true).send();
  }
  else if (promptData.yesAction === 'addShow') {
    show = promptData.searchResults[0];

    return api.add(show.tvdbid).then(() => {
      resp
        .say(promptData.yesResponse)
        .send();
    });
  }
  else {
    console.log('Got an unexpected yesAction. PromptData:');
    console.log(promptData);
    resp.send();
  }
}

export function handleNoIntent(req, resp) {
  const promptData = req.session('promptData');

  if (!promptData) {
    console.log('Got a AMAZON.YesIntent but no promptData. Ending session.');
    resp.shouldEndSession(true).send();
  }
  else if (promptData.noAction === 'endSession') {
    resp.say(promptData.noResponse).send();
  }
  else if (promptData.noAction === 'suggestNextShow') {
    const shows = promptData.searchResults;
    resp
      .say(promptData.noResponse)
      .session('promptData', buildPrompt(shows.slice(1)))
      .shouldEndSession(false)
      .send();
  }
  else {
    console.log('Got an unexpected noAction. PromptData:');
    console.log(promptData);
    resp.send();
  }
}

export function handleCancelIntent(req, resp) {
  resp.say(HELP_RESPONSE()).send();
}
