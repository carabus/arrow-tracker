import * as actions from "../actions";

const initialState = {
  sessions: [
    {
      chart: [{ name: "End 1", score: 18 }, { name: "End 2", score: 24 }],
      id: 1,
      startDate: new Date(),
      distance: "20",
      distanceUnits: "yards",
      score: 200,
      maxScore: 280,
      additionalOptions: [{ id: 1, optionName: "barebow" }],
      ends: [
        {
          id: 1,
          arrows: [
            {
              arrowNumber: 1,
              arrowCoordinates: { x: 100, y: 100 },
              arrowScore: 5,
              isInverted: false
            },
            {
              arrowNumber: 2,
              arrowCoordinates: { x: 120, y: 120 },
              arrowScore: 6,
              isInverted: false
            },
            {
              arrowNumber: 3,
              arrowCoordinates: { x: 125, y: 125 },
              arrowScore: 7,
              isInverted: false
            }
          ]
        },
        {
          id: 2,
          arrows: [
            {
              arrowNumber: 1,
              arrowCoordinates: { x: 70, y: 70 },
              arrowScore: 7,
              isInverted: false
            },
            {
              arrowNumber: 2,
              arrowCoordinates: { x: 80, y: 85 },
              arrowScore: 8,
              isInverted: false
            },
            {
              arrowNumber: 3,
              arrowCoordinates: { x: 90, y: 85 },
              arrowScore: 9,
              isInverted: false
            }
          ]
        }
      ]
    }
  ]
};

export const archeryTrackerReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case actions.DELETE_END: {
      let sessions = state.sessions.map(session => {
        if (session.id !== action.sessionId) {
          return session;
        }
        return Object.assign({}, session, {
          ends: session.ends.filter(end => action.endNumber !== end.id)
        });
      });
      return Object.assign({}, state, {
        sessions
      });
      break;
    }
    case actions.DELETE_SESSION_STORE:
      return Object.assign({}, state, {
        sessions: state.sessions.filter(
          session => session.id !== action.sessionId
        )
      });
      break;
    case actions.CREATE_SESSION_STORE:
      return Object.assign({}, state, {
        sessions: [...state.sessions, action.session]
      });

      break;

    case actions.UPDATE_SESSION: {
      let sessions = state.sessions.map(session => {
        if (session.id !== action.sessionId) {
          return session;
        }

        return Object.assign({}, session, {
          distance: action.payload.distance,
          distanceUnits: action.payload.distanceUnits
        });
      });
      return Object.assign({}, state, {
        sessions
      });

      break;
    }

    case actions.CREATE_END_STORE: {
      let sessions = state.sessions.map(session => {
        if (session.id !== action.sessionId) {
          return session;
        }
        return Object.assign({}, session, {
          ends: [...session.ends, action.end]
        });
      });
      return Object.assign({}, state, {
        sessions
      });

      break;
    }

    case actions.CREATE_ARROW: {
      const newArrow = {
        arrowNumber: action.arrowNumber,
        arrowScore: action.arrowScore,
        arrowCoordinates: action.arrowCoordinates,
        isInverted: action.isInverted
      };
      let sessions = state.sessions.map(session => {
        if (session.id !== action.sessionId) {
          return session;
        }

        let ends = session.ends.map(end => {
          if (end.id !== action.endNumber) {
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

    case actions.REMOVE_LAST_ARROW: {
      let sessions = state.sessions.map(session => {
        if (session.id !== action.sessionId) {
          return session;
        }

        let ends = session.ends.map(end => {
          if (end.id !== action.endId) {
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
      console.log("DEFAULT ACTION HAPPENED");
      return { ...state };
  }
};
