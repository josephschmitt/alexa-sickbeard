import config from 'config';
import SickBeardAPI from 'node-sickbeard';

let provider;

export default function api() {
  if (!provider) {
    provider = new SickBeardAPI(config.get('alexa-sickbeard.server'));
  }

  return provider;
}

export function list() {
  return api().cmd('shows').then((resp) => resp.data);
}

export function search(name) {
  return api().cmd('sb.searchtvdb', {name}).then((resp) => resp.data.results);
}

export function add(tvdbid) {
  return api().cmd('show.addnew', {tvdbid, status: 'wanted'}).then((resp) => resp.message);
}
