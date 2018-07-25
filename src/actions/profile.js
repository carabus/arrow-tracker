import { API_BASE_URL } from "../config";
import { normalizeResponseErrors } from "./utils";

export const FETCH_TRAINING_FACTORS_SUCCESS = "FETCH_TRAINING_FACTORS_SUCCESS";
export const fetchTrainingFactorsSuccess = trainingFactors => ({
  type: FETCH_TRAINING_FACTORS_SUCCESS,
  trainingFactors
});

export const FETCH_TRAINING_FACTORS_ERROR = "FETCH_TRAINING_FACTORS_ERROR";
export const fetchTrainingFactorsError = error => ({
  type: FETCH_TRAINING_FACTORS_ERROR,
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
      dispatch(fetchTrainingFactorsError(err));
    });
};
