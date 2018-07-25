import * as actions from "../actions";

const initialState = {
  sessions: [],
  error: null
};

export const archeryTrackerReducer = (state = initialState, action) => {
  console.log("PERFORMING ACTION", action);
  switch (action.type) {
    case actions.FETCH_SESSIONS_SUCCESS: {
      return Object.assign({}, state, {
        sessions: action.sessions,
        error: null
      });
      break;
    }
    case actions.FETCH_SESSIONS_ERROR: {
      return Object.assign({}, state, {
        error: action.error
      });
      break;
    }

    case actions.UPDATE_SESSION_SUCCESS: {
      let sessions = state.sessions.map(session => {
        if (session.id !== action.session.id) {
          return session;
        }

        return Object.assign({}, session, action.session);
      });
      return Object.assign({}, state, {
        sessions,
        error: null
      });

      break;
    }

    case actions.UPDATE_SESSION_ERROR: {
      return Object.assign({}, state, {
        error: action.error
      });
      break;
    }

    case actions.DELETE_SESSION_SUCCESS: {
      return Object.assign({}, state, {
        sessions: state.sessions.filter(
          session => session.id !== action.session.id
        )
      });
      break;
    }

    case actions.DELETE_SESSION_ERROR: {
      return Object.assign({}, state, {
        error: action.error
      });
      break;
    }

    case actions.CREATE_SESSION_SUCCESS: {
      return Object.assign({}, state, {
        sessions: [...state.sessions, action.session]
      });
      break;
    }

    case actions.CREATE_SESSION_ERROR: {
      return Object.assign({}, state, {
        error: action.error
      });
      break;
    }
    default:
      return { ...state };
  }
};
