import config from 'config';
import SickBeard from 'node-sickbeard';

import buildPrompt from './buildPrompt.js';
import createSearchResponse from './createSearchResponse.js';

import {
  ALREADY_WANTED,
  HELP_RESPONSE,
  NO_SHOW_QUEUED,
  WELCOME_DESCRIPTION
} from './responses.js';

const sb = new SickBeard(config.get('alexa-sickbeard.server'));

export default function handleLaunchIntent(req, resp) {
  resp
    .say(WELCOME_DESCRIPTION())
    .say(HELP_RESPONSE())
    .send();
}

export function handleFindShowIntent(req, resp) {
  const showName = req.slot('showName');

  return sb.cmd('shows').then((searchResp) => {
    const shows = searchResp.data;
    const result = shows && Object.keys(shows).length ? shows.find((show) => {
      return show.show_name.toLowerCase().indexOf(showName.toLowerCase()) >= 0;
    }) : null;

    if (!result) {
      resp.say(NO_SHOW_QUEUED(showName));

      sb.cmd('sb.searchtvdb', {name: showName}).then((searchResults) => {
        createSearchResponse(searchResults.data.results, req, resp).send();
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

  return sb.cmd('sb.searchtvdb', {name: showName}).then((searchResults) => {
    createSearchResponse(searchResults.data.results, req, resp).send();
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

    return sb.cmd('show.addnew', {
      tvdbid: show.tvdbid,
      status: 'wanted'
    }).then(() => {
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
