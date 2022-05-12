export const searchById = (idsArr, itemsArr) => {
  let result = [];
  if (idsArr === null) return;
  for (const item of itemsArr) {
    if (new Set(idsArr).has(itemsArr.id)) {
      result.push(item.word);
    }
  }
  return result.join(', ');
};
