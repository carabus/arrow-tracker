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
      { session: "04-30", score: 400 },
      { session: "05-07", score: 300 },
      { session: "05-14", score: 300 },
      { session: "05-21", score: 278 },
      { session: "05-28", score: 289 },
      { session: "06-04", score: 339 },
      { session: "06-11", score: 349 }
    ],
    compareCharts: {}
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
