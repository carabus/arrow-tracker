import * as actions from "../actions";

const initialState = {
  sessions: [],
  error: null,
  isLoading: false
};

export const archeryTrackerReducer = (state = initialState, action) => {
  console.log("PERFORMING ACTION", action);
  switch (action.type) {
    case actions.FETCH_SESSIONS_SUCCESS: {
      return Object.assign({}, state, {
        sessions: action.sessions,
        isLoading: false,
        error: null
      });
    }
    case actions.FETCH_SESSIONS_ERROR: {
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
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
        isLoading: false,
        error: null
      });
    }

    case actions.DELETE_SESSION_SUCCESS: {
      return Object.assign({}, state, {
        sessions: state.sessions.filter(
          session => session.id !== action.session.id
        )
      });
    }

    case actions.CREATE_SESSION_SUCCESS: {
      return Object.assign({}, state, {
        sessions: [...state.sessions, action.session]
      });
    }

    case actions.CREATE_ARROW: {
      const newArrow = {
        coordinates: action.point,
        score: action.score,
      };
      let sessions = state.sessions.map(session => {
        if (session.id !== action.session.id) {
          return session;
        }

        let ends = session.ends.map(end => {
          if (end._id !== action.end._id) {
            return end;
          }
          return Object.assign({}, end, { arrows: [...end.arrows, newArrow] });
        });
        return Object.assign({}, session, {
          ends: [...ends]
        });
      });

      return Object.assign({}, state, {
        sessions
      });
    }

    case actions.REMOVE_LAST_ARROW: {
      let sessions = state.sessions.map(session => {
        if (session.id !== action.session.id) {
          return session;
        }

        let ends = session.ends.map(end => {
          if (end._id !== action.end._id) {
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
    }

    case actions.IS_LOADING: {
      return Object.assign({}, state, { isLoading: true });
    }

    case actions.RESET: {
      return initialState;
    }

    default:
      return { ...state };
  }
};
