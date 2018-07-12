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

export const CREATE_SESSION_STORE = "CREATE_SESSION_STORE";
export const createSessionStore = session => ({
  type: CREATE_SESSION_STORE,
  session
});

export const CREATE_SESSION = "CREATE_SESSION";
export const createSession = payload => dispatch => {
  console.log("inside create session", payload);
  const newSession = {
    id: Math.floor(Math.random() * 1000 + 1),
    startDate: payload.startDate.toString(),
    distance: `${payload.distance} ${payload.distanceUnits}`,
    additionalOptions: [],
    ends: []
  };
  dispatch(createSessionStore(newSession));
  dispatch(createEnd(newSession.id, payload.history));
  //payload.history.push(`/session/${newSession.id}/new/end/${1}`);
};

export const CREATE_END = "CREATE_END";
export const createEnd = (sessionId, history) => dispatch => {
  const newEnd = {
    id: Math.floor(Math.random() * 1000 + 1),
    arrows: []
  };
  dispatch(createEndStore(sessionId, newEnd));
  history.push(`/session/${sessionId}/end/${newEnd.id}`);
};

export const CREATE_END_STORE = "CREATE_END_STORE";
export const createEndStore = (sessionId, end) => ({
  type: CREATE_END_STORE,
  sessionId,
  end
});

export const CREATE_ARROW = "CREATE_ARROW";
export const createArrow = (
  sessionId,
  endNumber,
  point,
  score,
  isInverted
) => ({
  type: CREATE_ARROW,
  sessionId,
  endNumber,
  arrowNumber: Math.floor(Math.random() * 1000 + 1),
  arrowCoordinates: point,
  arrowScore: score,
  isInverted
});
