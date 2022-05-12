import { createSelector } from '@reduxjs/toolkit';
import { colorText } from '../../utils/colorText';

const selectTexts = (state) => state.app.results;
const selectWords = (state) => state.app.words;
const selectLabels = (state) => state.app.labels;
const selectTextIds = (state) => state.app.selectedTextIds;

export const selectFormattedTexts = createSelector(
  selectTexts,
  selectWords,
  selectLabels,
  (results, words, labels) => {
    return results.map((record) => {
      const regexs = words
        .filter((i) => record.wordIds?.includes(i.id))
        .reduce((arr, obj) => arr.concat(obj.regexes), []);

      return {
        ...record,
        formattedValue: colorText(record.value, [
          ...regexs,
          'жур',
          'цилі',
          'ваг',
        ]),
        words: record.wordIds?.map(
          (id) => (words.find((wordObj) => wordObj.id === id) || {}).word
        ),
        labels: record.labelIds?.map(
          (id) => (labels.find((labelObj) => labelObj.id === id) || {}).label
        ),
      };
    });
  }
);

export const selectTextsSelector = createSelector(
  selectTextIds,
  selectFormattedTexts,
  (ids, texts) => {
    return ids.map((id) => texts.find((text) => text.id === id));
  }
);
