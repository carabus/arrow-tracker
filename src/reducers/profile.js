import * as actions from "../actions";

const initialState = {
  profile: {
    additionalOptions: [
      { id: 1, name: "fancy arrows" },
      { id: 2, name: "outdoors" },
      { id: 3, name: "without stabilizer" },
      { id: 4, name: "barebow" }
    ],
    rank: 99,
    progressChart: [
      { session: "1", score: 400 },
      { session: "2", score: 300 },
      { session: "3", score: 300 },
      { session: "4", score: 278 },
      { session: "5", score: 289 },
      { session: "6", score: 339 },
      { session: "7", score: 349 }
    ],
    compareChart: [
      {
        name: "Default",
        data: [
          { session: "1", score: 400 },
          { session: "2", score: 300 },
          { session: "3", score: 300 },
          { session: "4", score: 278 },
          { session: "5", score: 289 },
          { session: "6", score: 339 },
          { session: "7", score: 349 }
        ]
      },
      {
        name: "Barebow",
        data: [
          { session: "1", score: 500 },
          { session: "2", score: 489 },
          { session: "3", score: 503 },
          { session: "4", score: 397 },
          { session: "5", score: 409 }
        ]
      }
    ]
  }
};

export const profileReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    default:
      console.log("DEFAULT ACTION HAPPENED");
      return { ...state };
  }
};
