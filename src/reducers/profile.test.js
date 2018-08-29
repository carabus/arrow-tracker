import { profileReducer } from "./profile";
import * as actions from "../actions/profile";
import { reset } from "../actions";

describe("fetchTrainingFactorsSuccess", () => {
  it("Should add trainings factors to state", () => {
    let state = {
      trainingFactors: []
    };

    const trainingFactors = [{ id: "barebow", name: "barebow" }];

    state = profileReducer(
      state,
      actions.fetchTrainingFactorsSuccess(trainingFactors)
    );

    expect(state).toEqual({
      trainingFactors: trainingFactors,
      error: null
    });
  });
});

describe("fetchProfileError", () => {
  it("Should add error to the state", () => {
    let state = {
      error: null
    };

    const error = "some error";

    state = profileReducer(state, actions.fetchProfileError(error));

    expect(state).toEqual({
      error: error
    });
  });
});

describe("progressChartSuccess", () => {
  it("Should add progress chart to the state", () => {
    let state = {
      progressChart: []
    };

    const progressChart = [{ session: 1, score: 68 }];

    state = profileReducer(state, actions.progressChartSuccess(progressChart));

    expect(state).toEqual({
      progressChart: progressChart,
      error: null
    });
  });
});

describe("compareChartSuccess", () => {
  it("Should add compare chart for normal training ", () => {
    let state = {
      compareChart: [{ selectedFactors: [], chart: null }]
    };

    const compareChart = [{ session: 1, score: 100 }];
    const additionalFactors = [];
    const optionIndex = 0;
    const compareChartRes = [
      {
        selectedFactors: [],
        chart: { name: "normal training", data: compareChart }
      }
    ];

    state = profileReducer(
      state,
      actions.compareChartSuccess(compareChart, additionalFactors, optionIndex)
    );

    expect(state).toEqual({
      compareChart: compareChartRes,
      error: null
    });
  });

  it("Should add compare chart with aditional factors ", () => {
    let state = {
      compareChart: [
        {
          selectedFactors: [],
          chart: { name: "normal training", data: [{ session: 1, score: 68 }] }
        },
        {
          selectedFactors: [],
          chart: null
        }
      ]
    };

    const compareChart = [{ session: 1, score: 100 }];
    const additionalFactors = ["barebow", "outside"];
    const optionIndex = 1;
    const compareChartRes = [
      {
        selectedFactors: [],
        chart: { name: "normal training", data: [{ session: 1, score: 68 }] }
      },
      {
        selectedFactors: [
          { id: "barebow", name: "barebow" },
          { id: "outside", name: "outside" }
        ],
        chart: { name: "outside & barebow", data: compareChart }
      }
    ];

    state = profileReducer(
      state,
      actions.compareChartSuccess(compareChart, additionalFactors, optionIndex)
    );

    expect(state).toEqual({
      compareChart: compareChartRes,
      error: null
    });
  });
});

describe("addCompareChart", () => {
  it("Should add compare chart stub to the state", () => {
    let state = {
      compareChart: []
    };

    const compareChart = [
      {
        selectedFactors: [],
        chart: null
      }
    ];

    state = profileReducer(state, actions.addCompareChart());

    expect(state).toEqual({
      compareChart: compareChart
    });
  });
});

describe("removeCompareChartOption", () => {
  it("Should remove compare chart option from the state", () => {
    let state = {
      compareChart: [
        {
          selectedFactors: [],
          chart: { name: "normal training", data: [{ session: 1, score: 68 }] }
        },
        {
          selectedFactors: [
            { id: "barebow", name: "barebow" },
            { id: "outside", name: "outside" }
          ],
          chart: {
            name: "outside & barebow",
            data: [{ session: 1, score: 68 }]
          }
        }
      ]
    };

    const optionIndex = 1;
    const expectedResult = [
      {
        selectedFactors: [],
        chart: { name: "normal training", data: [{ session: 1, score: 68 }] }
      }
    ];

    state = profileReducer(
      state,
      actions.removeCompareChartOption(optionIndex)
    );

    expect(state).toEqual({
      compareChart: expectedResult,
      error: null
    });
  });
});

describe("removeCompareChart", () => {
  it("Should remove compare chart from the state", () => {
    let state = {
      compareChart: [
        {
          selectedFactors: [],
          chart: { name: "normal training", data: [{ session: 1, score: 68 }] }
        },
        {
          selectedFactors: [
            { id: "barebow", name: "barebow" },
            { id: "outside", name: "outside" }
          ],
          chart: {
            name: "outside & barebow",
            data: [{ session: 1, score: 68 }]
          }
        }
      ]
    };

    const optionIndex = 1;
    const expectedResult = [
      {
        selectedFactors: [],
        chart: { name: "normal training", data: [{ session: 1, score: 68 }] }
      },
      {
        selectedFactors: [],
        chart: null
      }
    ];

    state = profileReducer(state, actions.removeCompareChart(optionIndex));

    expect(state).toEqual({
      compareChart: expectedResult,
      error: null
    });
  });
});

describe("fetchUserRankSuccess", () => {
  it("Should add user rank to state", () => {
    let state = {
      rank: null
    };

    const rank = 42;

    state = profileReducer(state, actions.fetchUserRankSuccess(rank));

    expect(state).toEqual({
      rank: rank,
      error: null
    });
  });
});

describe("reset", () => {
  it("Should reset to initial state", () => {
    let state = {
      trainingFactors: [{ id: "barebow", name: "barebow" }],
      rank: 42,
      progressChart: [{ session: 1, score: 68 }],
      compareChart: [
        {
          selectedFactors: [],
          chart: {
            name: "normal training",
            data: [{ id: "barebow", name: "barebow" }]
          }
        }
      ],
      error: null
    };

    const initialState = {
      trainingFactors: [],
      rank: 0,
      progressChart: [],
      compareChart: [
        {
          selectedFactors: [],
          chart: { name: "normal training", data: [] }
        }
      ],
      error: null
    };

    state = profileReducer(state, reset());

    expect(state).toEqual(initialState);
  });
});

describe("default", () => {
  it("Should return current state by default", () => {
    let state = {
      trainingFactors: [{ id: "barebow", name: "barebow" }],
      rank: 42,
      progressChart: [{ session: 1, score: 68 }],
      compareChart: [
        {
          selectedFactors: [],
          chart: {
            name: "normal training",
            data: [{ id: "barebow", name: "barebow" }]
          }
        }
      ],
      error: null
    };
    const resState = {
      trainingFactors: [{ id: "barebow", name: "barebow" }],
      rank: 42,
      progressChart: [{ session: 1, score: 68 }],
      compareChart: [
        {
          selectedFactors: [],
          chart: {
            name: "normal training",
            data: [{ id: "barebow", name: "barebow" }]
          }
        }
      ],
      error: null
    };

    state = profileReducer(state, { type: "__UNKNOWN" });

    expect(state).toEqual(resState);
  });
});
