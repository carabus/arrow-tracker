/*import { history } from "react-router";*/

export const DELETE_SESSION = "DELETE_SESSION";
export const deleteSession = sessionId => ({
  type: DELETE_SESSION,
  sessionId
});

export const DELETE_END = "DELETE_END";
export const deleteEnd = (sessionId, endNumber) => ({
  type: DELETE_END,
  sessionId,
  endNumber
});

export const LOAD_DATA = "LOAD_DATA";
export const loadData = () => ({
  type: LOAD_DATA
});

export const LOAD_SINGLE_SESSION = "LOAD_SINGLE_SESSION";
export const getSingleSession = sessionId => ({
  type: LOAD_SINGLE_SESSION,
  sessionId
});

export const CREATE_SESSION = "CREATE_SESSION";
export const createSession = payload => ({
  type: CREATE_SESSION,
  payload
});
/*
export const createSession = (distance, push) => (dispatch, getState) => {
  console.log(this);
  console.log(getState());
  dispatch({ type: "SAVE_SESSION", action: distance });
  const sessionId = "12345";
  push(`/new/${sessionId}`);
};
/*
export const createSession = distance => ({
  type: CREATE_SESSION,
  distance
});*/
