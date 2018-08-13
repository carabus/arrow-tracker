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

    case actions.CREATE_ARROW1: {
      console.log(state.sessions);
      console.log(action);
      const newArrow = {
        coordinates: action.point,
        score: action.score,
        isInverted: action.isInverted
      };
      let sessions = state.sessions.map(session => {
        if (session.id !== action.session.id) {
          return session;
        }

        let ends = session.ends.map(end => {
          if (end.id !== action.end.id) {
            return end;
          }
          return Object.assign({}, end, { arrows: [...end.arrows, newArrow] });
        });
        return Object.assign({}, session, {
          ends: [...ends]
        });
      });

      console.log(sessions, state.sessions);
      return Object.assign({}, state, {
        sessions
      });

      break;
    }

    case actions.REMOVE_LAST_ARROW1: {
      let sessions = state.sessions.map(session => {
        if (session.id !== action.session.id) {
          return session;
        }

        let ends = session.ends.map(end => {
          if (end.id !== action.end.id) {
            return end;
          }
          return Object.assign({}, end, {
            arrows: end.arrows.slice(0, end.arrows.length - 1)
          });
        });
        return Object.assign({}, session, {
          ends: [...ends]
        });
      });
      console.log(sessions, state.sessions);
      return Object.assign({}, state, {
        sessions
      });
      break;
    }

    default:
      return { ...state };
  }
};
