import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addLabel as addLabelAPI,
  addWord as addWordAPI,
  getLabels as getLabelsAPI,
  getWords as getWordsAPI,
} from '../services/catalogs';
import { getResults as getResultsAPI } from '../services/results';

const initialState = {
  results: [],
  words: [],
  labels: [],
  selectedTextIds: [],
  managementForm: {
    labelId: null,
    caseId: null,
    wordId: null,
    regexpId: null,
  },
  selectedText: {
    id: null,
    categoryId: null,
    text: '',
    wordsIds: [],
  },
  labelForm: {
    human: [],
    report: [],
    isTrash: false,
  },
  subText: '',
};

// Thunks

export const getResults = createAsyncThunk('Get results', async (params) => {
  const { processed = false, labelIds = [] } = params || {};
  const response = await getResultsAPI(processed, labelIds);
  return response.data;
});

export const getWords = createAsyncThunk('Get words', async () => {
  const response = await getWordsAPI();
  return response.data;
});
export const getLabels = createAsyncThunk('Get labels', async () => {
  const response = await getLabelsAPI();
  return response.data;
});

export const addWord = createAsyncThunk('Add word', async (params) => {
  const { word, regexes, id } = params;
  await addWordAPI(word, regexes, id);

  const response = await getWordsAPI();
  return response.data;
});

export const addLabel = createAsyncThunk('Add label', async (params) => {
  const { label, id, cases } = params;
  await addLabelAPI(label, id, cases);

  const response = await getLabelsAPI();
  return response.data;
});

//

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setText: (state, action) => {
      state.selectedText = action.payload;
    },
    setTextIds: (state, action) => {
      state.selectedTextIds = action.payload;
    },
    setSubText: (state, action) => {
      state.subText = action.payload;
    },
    setHumanLabelForm: (state, action) => {
      const { payload } = action;
      state.labelForm = { ...state.labelForm, human: payload };
    },
    setUserReportForm: (state, action) => {
      const { payload } = action;
      state.labelForm = { ...state.labelForm, report: payload };
    },
    setTrashForm: (state, action) => {
      const { payload } = action;
      state.labelForm = { ...state.labelForm, isTrash: payload };
    },
    resetForm: (state) => {
      state.labelForm = initialState.labelForm;
      state.selectedText = initialState.selectedText;
    },

    //
    setManagementFormLabel: (state, action) => {
      state.managementForm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getResults.fulfilled, (state, { payload }) => {
      state.selectedTextIds = [];
      state.results = payload;
    });
    builder.addCase(getWords.fulfilled, (state, { payload }) => {
      state.words = payload;
    });
    builder.addCase(getLabels.fulfilled, (state, { payload }) => {
      state.labels = payload;
    });
    //
    builder.addCase(addWord.fulfilled, (state, { payload }) => {
      state.words = payload;
    });
    builder.addCase(addLabel.fulfilled, (state, { payload }) => {
      state.labels = payload;
    });
  },
});

export const {
  setText,
  setUserReportForm,
  setTrashForm,
  setHumanLabelForm,
  resetForm,
  setSubText,
  setTextIds,
  setManagementFormLabel,
} = appSlice.actions;
export default appSlice.reducer;
