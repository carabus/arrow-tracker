import { API_BASE_URL } from "../config";
import { normalizeResponseErrors } from "./utils";

export const FETCH_TRAINING_FACTORS_SUCCESS = "FETCH_TRAINING_FACTORS_SUCCESS";
export const fetchTrainingFactorsSuccess = trainingFactors => ({
  type: FETCH_TRAINING_FACTORS_SUCCESS,
  trainingFactors
});

export const FETCH_PROFILE_ERROR = "FETCH_PROFILE_ERROR";
export const fetchProfileError = error => ({
  type: FETCH_PROFILE_ERROR,
  error
});

export const fetchTrainingFactors = () => (dispatch, getState) => {
  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/trainingFactors`, {
    method: "GET",
    headers: {
      // Provide our auth token as credentials
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(data => {
      dispatch(fetchTrainingFactorsSuccess(data));
    })
    .catch(err => {
      dispatch(fetchProfileError(err));
    });
};

export const PROGRESS_CHART_REQUEST = "PROGRESS_CHART_REQUEST";
export const progressChartRequest = () => ({
  type: PROGRESS_CHART_REQUEST
});

export const PROGRESS_CHART_SUCCESS = "PROGRESS_CHART_SUCCESS";
export const progressChartSuccess = progressChart => ({
  type: PROGRESS_CHART_SUCCESS,
  progressChart
});

export const fetchProgressChart = () => (dispatch, getState) => {
  dispatch(progressChartRequest());
  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/charts/progress`, {
    method: "GET",
    headers: {
      // Provide our auth token as credentials
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(data => {
      dispatch(progressChartSuccess(data));
    })
    .catch(err => {
      dispatch(fetchProfileError(err));
    });
};

export const ADD_COMPARE_CHART = "ADD_COMPARE_CHART";
export const addCompareChart = () => ({
  type: ADD_COMPARE_CHART
});

export const REMOVE_COMPARE_CHART = "REMOVE_COMPARE_CHART";
export const removeCompareChart = optionIndex => ({
  type: REMOVE_COMPARE_CHART,
  optionIndex
});

export const REMOVE_COMPARE_CHART_OPTION = "REMOVE_COMPARE_CHART_OPTION";
export const removeCompareChartOption = optionIndex => ({
  type: REMOVE_COMPARE_CHART_OPTION,
  optionIndex
});

export const COMPARE_CHART_REQUEST = "COMPARE_CHART_REQUEST";
export const compareChartRequest = () => ({
  type: COMPARE_CHART_REQUEST
});

export const COMPARE_CHART_SUCCESS = "COMPARE_CHART_SUCCESS";
export const compareChartSuccess = (
  compareChart,
  selectedFactors,
  optionIndex
) => ({
  type: COMPARE_CHART_SUCCESS,
  compareChart,
  selectedFactors,
  optionIndex
});

export const fetchCompareChart = (optionIndex, selectedFactors) => (
  dispatch,
  getState
) => {
  dispatch(compareChartRequest());

  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/charts/compare`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify({ selectedFactors })
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(data => {
      dispatch(compareChartSuccess(data, selectedFactors, optionIndex));
    })
    .catch(err => {
      dispatch(fetchProfileError(err));
    });
};

export const computeUserRank = () => (dispatch, getState) => {
  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/ranks/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(data => {
      console.log("User rank was updated");
    })
    .catch(err => {
      console.log("Error updating user rank");
    });
};

export const FETCH_USER_RANK_REQUEST = "FETCH_USER_RANK_REQUEST";
export const fetchUserRankRequest = () => ({
  type: FETCH_USER_RANK_REQUEST
});

export const FETCH_USER_RANK_SUCCESS = "FETCH_USER_RANK_SUCCESS";
export const fetchUserRankSuccess = rank => ({
  type: FETCH_USER_RANK_SUCCESS,
  rank
});

export const fetchUserRank = () => (dispatch, getState) => {
  dispatch(fetchUserRankRequest());
  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/ranks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(data => {
      dispatch(fetchUserRankSuccess(data));
    })
    .catch(err => {
      dispatch(fetchProfileError(err));
    });
};
