import API from './API';

export const getWords = () => API.get('catalogs/words');
export const getLabels = () => API.get('catalogs/labels');

export const addWord = (word) => API.post('catalogs/words', { word });
export const addLabel = (label) => API.post('catalogs/labels', { label });
