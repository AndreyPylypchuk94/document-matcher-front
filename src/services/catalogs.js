import API from './API';

export const getWords = () => API.get('catalogs/words');
export const getLabels = () => API.get('catalogs/labels');

export const addWord = (word, regexes, id) =>
  API.post('catalogs/words', { id, word, regexes });
export const addLabel = (label, id, cases) =>
  API.post('catalogs/labels', { label, id, cases });
