import { createSelector } from '@reduxjs/toolkit';
import { colorText } from '../../utils/colorText';

const selectTexts = (state) => state.app.results;
export const selectWords = (state) => state.app.words;
const selectLabels = (state) => state.app.labels;
const selectTextIds = (state) => state.app.selectedTextIds;
const selectSubText = (state) => state.app.subText;

const colorSubText = (text, labels) => {
  if (!labels) return text;
  return labels.reduce((result, label) => {
    return result.replace(
      label.text,
      `<span class="select-text">${label.text}</span>`
    );
  }, text);
};

export const selectFormattedTexts = createSelector(
  selectTexts,
  selectWords,
  selectLabels,
  (results, words, labels) => {
    return (
      results?.map((record) => {
        const regexs = words
          .filter((i) => record.wordIds?.includes(i.id))
          .reduce((arr, obj) => arr.concat(obj.regexes), []);
        return {
          ...record,
          formattedValue: colorText(record.value, regexs),
          formattedSubValue: colorSubText(record.value, record.selectedLabels),
          words: record.wordIds?.map(
            (id) => (words.find((wordObj) => wordObj.id === id) || {}).word
          ),
          labels: record.selectedLabels
            ? record.selectedLabels?.map(
                (label) =>
                  (labels.find((labelObj) => labelObj.id === label.id) || {})
                    .label
              )
            : record.labelIds?.map(
                (id) =>
                  (labels.find((labelObj) => labelObj.id === id) || {}).label
              ),
          selectedLabelsIds: record.selectedLabels?.map(
            (label) =>
              (labels.find((labelObj) => labelObj.id === label.id) || {}).id
          ),
        };
      }) || []
    );
  }
);

export const selectTextsSelector = createSelector(
  selectTextIds,
  selectFormattedTexts,
  (ids, texts) => {
    return ids.map((id) => texts.find((text) => text.id === id));
  }
);

export const selectSubTextSelector = createSelector(
  selectSubText,
  selectTexts,
  selectTextIds,
  (subText, texts, ids) => {
    return texts
      .filter((result) => ids.includes(result.id))
      .map((result) =>
        result.value.replace(
          subText,
          `<span class="select-text">${subText}</span>`
        )
      );
  }
);
