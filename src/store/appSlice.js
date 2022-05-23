import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addLabel as addLabelAPI,
  addWord as addWordAPI,
  getCategories as getCategoriesAPI,
  getLabels as getLabelsAPI,
  getWords as getWordsAPI,
} from '../services/catalogs';
import { getResults as getResultsAPI } from '../services/results';

const initialState = {
  results: [],
  words: [],
  labels: [],
  categories: [],
  selectedCategory: null,
  selectedTextIds: [],
  selectedLabelsIds: [],
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
  page: null,
  totalElements: null,
};

// Thunks

export const getResults = createAsyncThunk('Get results', async (params) => {
  const {
    processed = false,
    labelIds = [],
    page = 0,
    categoryId,
  } = params || {};
  const response = await getResultsAPI(processed, labelIds, page, categoryId);
  return response.data;
});

export const getWords = createAsyncThunk('Get words', async () => {
  const response = await getWordsAPI();
  return response.data;
});
export const getLabels = createAsyncThunk('Get labels', async (params) => {
  const { categoryId } = params;
  const response = await getLabelsAPI(categoryId);
  return response.data;
});

export const getCategories = createAsyncThunk('Get categories', async () => {
  const response = await getCategoriesAPI();
  return response.data;
});

export const addWord = createAsyncThunk('Add word', async (params) => {
  const { word, regexes, id } = params;

  const response = await addWordAPI(word, regexes, id);
  return response.data;
});

export const addLabel = createAsyncThunk('Add label', async (params) => {
  const { label, id, cases, categoryId } = params;
  const response = await addLabelAPI(label, id, cases, categoryId);

  // const response = await getLabelsAPI();
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
    setLabelsIds: (state, action) => {
      state.selectedLabelsIds = action.payload;
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
    setManagementFormLabel: (state, action) => {
      state.managementForm = action.payload;
    },
    setCategoryId: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getResults.fulfilled, (state, { payload }) => {
      state.selectedTextIds = [];
      state.results = payload.data;
      state.page = payload.page;
      state.totalElements = payload.totalElements;
    });
    builder.addCase(getWords.fulfilled, (state, { payload }) => {
      state.words = payload;
    });
    builder.addCase(getLabels.fulfilled, (state, { payload }) => {
      state.labels = payload;
    });
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      state.categories = payload;
      state.selectedCategory = payload[0].id;
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
  setLabelsIds,
  setCategoryId,
  setManagementFormLabel,
} = appSlice.actions;
export default appSlice.reducer;
