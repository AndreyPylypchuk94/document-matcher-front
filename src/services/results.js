import API from './API';

export const getResults = (
  processed = false,
  labelsIds = [],
  page,
  categoryId = 1
) => {
  if (processed) {
    return API.get(`results`, {
      params: {
        processed,
        page,
        size: 10,
        categoryId,
        labelIds: labelsIds.join(',') || undefined,
      },
    });
  }
  return API.get('results', {
    params: {
      categoryId,
    },
  });
};

export const sendResult = (labels) => {
  return API.put('results', {
    data: labels,
  });
};

export const activateKnime = (categoryId) =>
  API.get('knime/start', {
    params: {
      categoryId,
    },
  });

export const getKnimeStatus = async (categoryId) => {
  const response = await API.get('knime/status', {
    params: {
      categoryId,
    },
  });
  return response.data.isRunning;
};
