import * as actions from "../actions";

const initialState = {
  profile: {
    additionalOptions: [
      { id: 1, name: "fancy arrows" },
      { id: 2, name: "outdoors" },
      { id: 3, name: "without stabilizer" },
      { id: 4, name: "barebow" }
    ]
  },
  sessions: [
    {
      chart: [{ name: "End 1", score: 18 }, { name: "End 2", score: 24 }],
      id: 1,
      startDate: "03-07-2018 12:01",
      distance: "20 yards",
      score: 200,
      maxScore: 280,
      additionalOptions: [{ optionName: "barebow" }],
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
    case actions.DELETE_SESSION:
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

  /*
  if (action.type === actions.LOAD_DATA) {
    return { ...state };
  } else if (action.type === actions.LOAD_SINGLE_SESSION) {
    console.log("LOAD_SINGLE_SESSION", action);
    const obj = {
      ...state,
      session: state.sessions.find(session => session.id === action.sessionId),
      ends: state.sessions.find(session => session.id === action.sessionId).ends
    };
    console.log(obj);
    return obj;
  } else if (action.type === actions.DELETE_END) {
    console.log("DELETE_END", action);

    let sessions = state.sessions.map(session => {
      if (session.id !== action.sessionId) {
        console.log("we should not get here");
        return session;
      }
      return Object.assign({}, session, {
        ends: session.ends.filter(end => {
          console.log(action.endNumber);
          console.log(end.id);
          return action.endNumber !== end.id;
        })
      });
    });

    console.log(sessions, state.sessions);

    return Object.assign({}, state, {
      sessions
    });
  } else if (action.type === actions.DELETE_SESSION) {
    console.log("DELETE_SESSION", action);
    return Object.assign({}, state, {
      session: null,
      ends: null
    });
  } else if (action.type === actions.CREATE_SESSION) {
    console.log("CREATE_SESSION", action);
  } else if (action.type === "SAVE_SESSION") {
    console.log(action);
  }
  /*if (action.type === actions.DELETE_END) {
    let newSessions = { ...state.sessions };
    const sessions = Object.values(newSessions).map(session => {
      if (session.id === action.sessionId) {
        session.ends = session.ends.filter(end => end.id !== action.endNumber);
      }
      return session;
    });

    let sessionObject = sessions.reduce(function(map, obj) {
      map[obj.id] = obj;
      return map;
    }, {});

    return Object.assign({}, state, {
      sessions: sessionObject
    });
  } else if (action.type === actions.DELETE_SESSION) {
    console.log("here");
    let newSessions = { ...state.sessions };
    delete newSessions[action.sessionId];
    console.log(newSessions);
    return Object.assign({}, state, {
      ...newSessions
    });
  }*/
};
