import * as actions from "./index";
import { API_BASE_URL } from "../config";

describe("fetchSessionsSuccess", () => {
  it("Should return the action", () => {
    const sessions = [{ id: "1", distance: 20 }];
    const action = actions.fetchSessionsSuccess(sessions);
    expect(action.type).toEqual(actions.FETCH_SESSIONS_SUCCESS);
    expect(action.sessions).toEqual(sessions);
  });
});

describe("fetchSessionsError", () => {
  it("Should return the action", () => {
    const error = "error";
    const action = actions.fetchSessionsError(error);
    expect(action.type).toEqual(actions.FETCH_SESSIONS_ERROR);
    expect(action.error).toEqual(error);
  });
});

describe("isLoading", () => {
  it("Should return the action", () => {
    const action = actions.isLoading();
    expect(action.type).toEqual(actions.IS_LOADING);
  });
});

describe("updateSessionSuccess", () => {
  it("Should return the action", () => {
    const session = { id: "1", distance: 20 };
    const action = actions.updateSessionSuccess(session);
    expect(action.type).toEqual(actions.UPDATE_SESSION_SUCCESS);
    expect(action.session).toEqual(session);
  });
});

describe("deleteSessionSuccess", () => {
  it("Should return the action", () => {
    const session = { id: "1", distance: 20 };
    const action = actions.deleteSessionSuccess(session);
    expect(action.type).toEqual(actions.DELETE_SESSION_SUCCESS);
    expect(action.session).toEqual(session);
  });
});

describe("createSessionSuccess", () => {
  it("Should return the action", () => {
    const session = { id: "1", distance: 20 };
    const action = actions.createSessionSuccess(session);
    expect(action.type).toEqual(actions.CREATE_SESSION_SUCCESS);
    expect(action.session).toEqual(session);
  });
});

describe("createArrow", () => {
  it("Should return the action", () => {
    const session = { id: "1", distance: 20 };
    const end = { _id: 1 };
    const point = { x: 1, y: 1 };
    const score = 10;
    const action = actions.createArrow(session, end, point, score);
    expect(action.type).toEqual(actions.CREATE_ARROW);
    expect(action.session).toEqual(session);
    expect(action.end).toEqual(end);
    expect(action.point).toEqual(point);
    expect(action.score).toEqual(score);
  });
});

describe("removeLastArrow", () => {
  it("Should return the action", () => {
    const session = { id: "1", distance: 20 };
    const end = { _id: 1 };
    const action = actions.removeLastArrow(session, end);
    expect(action.type).toEqual(actions.REMOVE_LAST_ARROW);
    expect(action.session).toEqual(session);
    expect(action.end).toEqual(end);
  });
});

describe("reset", () => {
  it("Should return the action", () => {
    const action = actions.reset();
    expect(action.type).toEqual(actions.RESET);
  });
});

describe("fetchSessions", () => {
  it("Should dispatch fetchSessionsSuccess", () => {
    const sessions = [{ id: "1", distance: 20 }];

    const getState = jest
      .fn()
      .mockImplementation(() => ({ auth: { authToken: "test" } }));

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json() {
          return sessions;
        }
      })
    );

    const dispatch = jest.fn();
    return actions
      .fetchSessions()(dispatch, getState)
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/trainingRecords`, {
          headers: { Authorization: "Bearer test" },
          method: "GET"
        });
        expect(dispatch).toHaveBeenCalledWith(
          actions.fetchSessionsSuccess(sessions)
        );
      });
  });
});

describe("updateSession", () => {
  it("Should dispatch updateSessionsSuccess", () => {
    const session = { id: "1", distance: 20 };

    const getState = jest
      .fn()
      .mockImplementation(() => ({ auth: { authToken: "test" } }));

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json() {
          return session;
        }
      })
    );

    const dispatch = jest.fn();
    return actions
      .updateSession(session)(dispatch, getState)
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(
          `${API_BASE_URL}/trainingRecords/${session.id}`,
          {
            headers: {
              Authorization: "Bearer test",
              "content-type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(session)
          }
        );
        expect(dispatch).toHaveBeenCalledWith(
          actions.updateSessionSuccess(session)
        );
      });
  });
});

describe("deleteSession", () => {
  it("Should dispatch deleteSessionSuccess", () => {
    const session = { id: "1", distance: 20 };

    const getState = jest
      .fn()
      .mockImplementation(() => ({ auth: { authToken: "test" } }));

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json() {
          return session;
        }
      })
    );

    const dispatch = jest.fn();
    return actions
      .deleteSession(session)(dispatch, getState)
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(
          `${API_BASE_URL}/trainingRecords/${session.id}`,
          {
            headers: {
              Authorization: "Bearer test",
              "content-type": "application/json"
            },
            method: "DELETE"
          }
        );
        expect(dispatch).toHaveBeenCalledWith(
          actions.deleteSessionSuccess(session)
        );
      });
  });
});

describe("createSession", () => {
  it("Should dispatch createSessionSuccess", () => {
    const session = { id: "1", distance: 20 };

    const history = {};

    const getState = jest
      .fn()
      .mockImplementation(() => ({ auth: { authToken: "test" } }));

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json() {
          return session;
        }
      })
    );

    const dispatch = jest.fn();
    return actions
      .createSession(session, history)(dispatch, getState)
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/trainingRecords`, {
          headers: {
            Authorization: "Bearer test",
            "content-type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(session)
        });
        expect(dispatch).toHaveBeenCalledWith(
          actions.createSessionSuccess(session)
        );
      });
  });
});
