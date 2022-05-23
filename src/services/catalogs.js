import API from './API';

export const getWords = () => API.get('catalogs/words');
export const getLabels = (categoryId) =>
  API.get('catalogs/labels', {
    params: { categoryId },
  });
export const getCategories = () => API.get('catalogs/label-categories');

export const addWord = (word, regexes, id) =>
  API.post('catalogs/words', { id, word, regexes });
export const addLabel = (label, id, cases, categoryId) =>
  API.post('catalogs/labels', { label, id, cases, categoryId });
