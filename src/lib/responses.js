/** ${0: Show Name} */
export const ADD_SHOW = tmpl`Add ${0} to your list?`;

/** ${0: Show Name} */
export const ALREADY_WANTED = tmpl`It looks like ${0} is already on your list.`;

export const HELP_RESPONSE = tmpl`You can ask SickBeard about the shows in your queue or add new
    shows to it. Try asking "is Silicon Valley on the list?". If it's not and you want to add it,
    try saying "add Silicon Valley".`;

/** ${0: Search query} */
export const NO_SHOW_FOUND = tmpl`No show found for ${0}`;

/** ${0: Show Name} */
export const NO_SHOW_QUEUED = tmpl`Couldn't find ${0} queued for download.`;

export const REPROMPT_END = tmpl`Ok. I'm out of suggestions. Sorry about that.`;

/** ${0: Show Name} */
export const REPROMPT_NO = tmpl`Ok, did you mean ${0}?`;

/** ${0: Show Name} */
export const REPROMPT_YES = tmpl`Added ${0} to your list of shows to download.`;

export const WELCOME_DESCRIPTION = tmpl`This skill allows you to manage your SickBeard show list.`;

/**
 * Template literal tag function. Returns a function that can be called with parameters to build
 * a string response. The tagged template returns a function that you can then call with parameters
 * to build out yours tring.
 *
 * Usage:
 *   respond`This is ${0} reponse ${1} I made.`('an awesome', 'function')
 * Or:
 *   const respFnc = respond`This is ${0} reponse ${1} I made.`;
 *   respFnc('an awesome', 'function');
 *
 * Returns:
 *   'This is an awesome response function I made.'
 *
 * @param {Array} strs Array of strings from the template.
 * @returns {Function}
 */
function tmpl(strs) {
  return (...args) => {
    return strs.map((str, i) => {
      return str + (args[i] || '');
    }).join('');
  };
}
