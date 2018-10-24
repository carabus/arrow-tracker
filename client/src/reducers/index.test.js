import { archeryTrackerReducer } from "./index";
import * as actions from "../actions/index";

describe("archeryTrackerReducer", () => {
  const dummyState = {
    sessions: [
      { id: "123", distance: 20 },
      {
        id: "124",
        distance: 20,
        ends: [
          { _id: 1, arrows: [] },
          {
            _id: 2,
            arrows: [
              { coordinates: { x: 1, y: 1 }, score: 10, isInverted: false }
            ]
          }
        ]
      }
    ]
  };
  describe("fetchSessionsSuccess", () => {
    it("Should add sessions to state", () => {
      let state = {
        sessions: []
      };

      const sessions = [
        { id: "123", distance: 20 },
        { id: "123", distance: 20 }
      ];

      state = archeryTrackerReducer(
        state,
        actions.fetchSessionsSuccess(sessions)
      );

      expect(state).toEqual({
        sessions: sessions,
        error: null,
        isLoading: false
      });
    });
  });

  describe("fetchSessionsError", () => {
    it("Should add error to state", () => {
      let state = {
        sessions: [],
        error: null
      };

      const error = "error";

      state = archeryTrackerReducer(state, actions.fetchSessionsError(error));

      expect(state).toEqual({
        sessions: [],
        error: error,
        isLoading: false
      });
    });
  });

  describe("updateSessionsSuccess", () => {
    it("Should update sessions in state", () => {
      let state = {
        sessions: [{ id: "123", distance: 20 }, { id: "124", distance: 20 }]
      };

      const session = { id: "123", distance: 40 };

      state = archeryTrackerReducer(
        state,
        actions.updateSessionSuccess(session)
      );

      expect(state).toEqual({
        sessions: [{ id: "123", distance: 40 }, { id: "124", distance: 20 }],
        error: null,
        isLoading: false
      });
    });
  });

  describe("deleteSessionsSuccess", () => {
    it("Should delete session from state", () => {
      let state = {
        sessions: [{ id: "123", distance: 20 }, { id: "124", distance: 20 }]
      };

      const session = { id: "123", distance: 20 };

      state = archeryTrackerReducer(
        state,
        actions.deleteSessionSuccess(session)
      );

      expect(state).toEqual({
        sessions: [{ id: "124", distance: 20 }]
      });
    });
  });

  describe("createSessionsSuccess", () => {
    it("Should add session to state", () => {
      let state = {
        sessions: [{ id: "123", distance: 20 }, { id: "124", distance: 20 }]
      };

      const session = { id: "125", distance: 30 };

      state = archeryTrackerReducer(
        state,
        actions.createSessionSuccess(session)
      );

      expect(state).toEqual({
        sessions: [
          { id: "123", distance: 20 },
          { id: "124", distance: 20 },
          { id: "125", distance: 30 }
        ]
      });
    });
  });

  describe("createArrow", () => {
    it("Should add arrow to session end", () => {
      let state = {
        sessions: [
          { id: "123", distance: 20 },
          {
            id: "124",
            distance: 20,
            ends: [{ _id: 1, arrows: [] }, { _id: 2, arrows: [] }]
          }
        ]
      };

      const session = { id: "124", distance: 20 };
      const end = { _id: 2 };
      const point = { x: 1, y: 1 };
      const score = 5;
      const isInverted = false;

      state = archeryTrackerReducer(
        state,
        actions.createArrow(session, end, point, score, isInverted)
      );

      expect(state).toEqual({
        sessions: [
          { id: "123", distance: 20 },
          {
            id: "124",
            distance: 20,
            ends: [
              { _id: 1, arrows: [] },
              { _id: 2, arrows: [{ coordinates: point, score, isInverted }] }
            ]
          }
        ]
      });
    });
  });

  describe("removeLastArrow", () => {
    it("Should remove last arrow from session end", () => {
      let state = dummyState;

      const session = { id: "124", distance: 20 };
      const end = { _id: 2 };

      state = archeryTrackerReducer(
        state,
        actions.removeLastArrow(session, end)
      );

      expect(state).toEqual({
        sessions: [
          { id: "123", distance: 20 },
          {
            id: "124",
            distance: 20,
            ends: [{ _id: 1, arrows: [] }, { _id: 2, arrows: [] }]
          }
        ]
      });
    });
  });

  describe("isLoading", () => {
    it("Should add loading to state", () => {
      let state = {
        sessions: [],
        error: null
      };

      state = archeryTrackerReducer(state, actions.isLoading());

      expect(state).toEqual({
        sessions: [],
        error: null,
        isLoading: true
      });
    });
  });

  describe("reset", () => {
    it("Should reset to initial state", () => {
      let state = dummyState;

      const initialState = {
        sessions: [],
        error: null,
        isLoading: false
      };

      state = archeryTrackerReducer(state, actions.reset());

      expect(state).toEqual(initialState);
    });
  });

  describe("default", () => {
    it("Should return current state by default", () => {
      let state = dummyState;
      const resState = dummyState;

      state = archeryTrackerReducer(state, { type: "__UNKNOWN" });

      expect(state).toEqual(resState);
    });
  });
});
