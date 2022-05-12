import API from './API';

export const getResults = (processed = false, labelsIds = []) => {
  if (processed) {
    return API.get(`results`, {
      params: {
        processed,
        labelIds: labelsIds.join(',') || undefined,
      },
    });
  }
  return API.get('results');
};

export const sendResult = (labels) => {
  return API.put('results', {
    data: labels,
  });
};
