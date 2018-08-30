import { API_BASE_URL } from "../config";
import { normalizeResponseErrors } from "./utils";

export const FETCH_SESSIONS_SUCCESS = "FETCH_SESSIONS_SUCCESS";
export const fetchSessionsSuccess = sessions => ({
  type: FETCH_SESSIONS_SUCCESS,
  sessions
});

export const FETCH_SESSIONS_ERROR = "FETCH_SESSIONS_ERROR";
export const fetchSessionsError = error => ({
  type: FETCH_SESSIONS_ERROR,
  error
});

export const IS_LOADING = "IS_LOADING";
export const isLoading = () => ({
  type: IS_LOADING
});

export const fetchSessions = () => (dispatch, getState) => {
  dispatch(isLoading());
  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/trainingRecords`, {
    method: "GET",
    headers: {
      // Provide our auth token as credentials
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(data => {
      dispatch(fetchSessionsSuccess(data));
    })
    .catch(err => {
      dispatch(fetchSessionsError(err));
    });
};

export const UPDATE_SESSION_SUCCESS = "UPDATE_SESSION_SUCCESS";
export const updateSessionSuccess = session => ({
  type: UPDATE_SESSION_SUCCESS,
  session
});

export const updateSession = (session, history) => (dispatch, getState) => {
  dispatch(isLoading());
  const authToken = getState().auth.authToken;
  if (!authToken) {
    return;
  }
  return fetch(`${API_BASE_URL}/trainingRecords/${session.id}`, {
    method: "PUT",
    headers: {
      // Provide our auth token as credentials
      Authorization: `Bearer ${authToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(session)
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(session => {
      dispatch(updateSessionSuccess(session));
      if (history) {
        history.push(
          `/session/${session.id}/end/${
            session.ends[session.ends.length - 1]._id
          }`
        );
      }
    })
    .catch(err => {
      dispatch(fetchSessionError(err));
    });
};

export const DELETE_SESSION_SUCCESS = "DELETE_SESSION_SUCCESS";
export const deleteSessionSuccess = session => ({
  type: DELETE_SESSION_SUCCESS,
  session
});

export const deleteSession = (session, history) => (dispatch, getState) => {
  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/trainingRecords/${session.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "content-type": "application/json"
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(data => {
      dispatch(deleteSessionSuccess(session));
      if (history) {
        history.push("/dashboard");
      }
    })
    .catch(err => {
      dispatch(fetchSessionError(err));
    });
};

export const CREATE_SESSION_SUCCESS = "CREATE_SESSION_SUCCESS";
export const createSessionSuccess = session => ({
  type: CREATE_SESSION_SUCCESS,
  session
});

export const createSession = (session, history) => (dispatch, getState) => {
  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/trainingRecords`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(session)
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(session => {
      dispatch(createSessionSuccess(session));
      dispatch(createEnd(session, history));
    })
    .catch(err => {
      dispatch(fetchSessionError(err));
    });
};

export const CREATE_END = "CREATE_END";
export const createEnd = (session, history) => dispatch => {
  session.ends.push({ arrows: [] });
  dispatch(updateSession(session, history));
};

export const DELETE_END = "DELETE_END";
export const deleteEnd = (session, end) => dispatch => {
  session.ends = session.ends.filter(currentEnd => currentEnd._id !== end._id);
  dispatch(updateSession(session));
};

export const CREATE_ARROW = "CREATE_ARROW";
export const createArrow = (session, end, point, score, isInverted) => ({
  type: CREATE_ARROW,
  session,
  end,
  point,
  score,
  isInverted
});

export const REMOVE_LAST_ARROW = "REMOVE_LAST_ARROW";
export const removeLastArrow = (session, end) => ({
  type: REMOVE_LAST_ARROW,
  session,
  end
});

export const RESET = "RESET";
export const reset = () => ({
  type: RESET
});
