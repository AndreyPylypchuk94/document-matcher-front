import API from './API';

export const getWords = (categoryId) =>
    API.get('catalogs/words', {
        params: {categoryId},
    });
export const getLabels = (categoryId) =>
    API.get('catalogs/labels', {
        params: {categoryId},
    });
export const getCategories = () => API.get('catalogs/label-categories');

export const addWord = (word, regexes, id, categoryId) =>
    API.post('catalogs/words', {id, word, regexes, categoryId});
export const addLabel = (label, id, cases, categoryId) =>
    API.post('catalogs/labels', {label, id, cases, categoryId});
