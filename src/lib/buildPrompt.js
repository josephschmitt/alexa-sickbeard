import {
  REPROMPT_END,
  REPROMPT_NO,
  REPROMT_YES
} from './responses.js';

export default function buildPrompt(shows) {
  const promptData = {
    searchResults: shows.slice(0, 5),
    yesAction: 'addShow',
    yesResponse: REPROMT_YES(shows[0].name)
  };

  if (shows.length > 1) {
    promptData.noAction = 'suggestNextShow';
    promptData.noResponse = REPROMPT_NO(shows[1].name);
  }
  else {
    promptData.noAction = 'endSession';
    promptData.noResponse = REPROMPT_END;
  }

  return promptData;
}
