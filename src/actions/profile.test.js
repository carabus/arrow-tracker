import * as actions from "./profile";
import { fetchTrainingFactors, fetchTrainingFactorsSuccess } from "./profile";
import { API_BASE_URL } from "../config";

describe("fetchTrainingFactorsSuccess", () => {
  it("Should return the action", () => {
    const trainingFactors = [{ id: "barebow", name: "barebow" }];
    const action = actions.fetchTrainingFactorsSuccess(trainingFactors);
    expect(action.type).toEqual(actions.FETCH_TRAINING_FACTORS_SUCCESS);
    expect(action.trainingFactors).toEqual(trainingFactors);
  });
});

describe("fetchProfileError", () => {
  it("Should return the action", () => {
    const error = "error";
    const action = actions.fetchProfileError(error);
    expect(action.type).toEqual(actions.FETCH_PROFILE_ERROR);
    expect(action.error).toEqual(error);
  });
});

describe("progressChartRequest", () => {
  it("Should return the action", () => {
    const action = actions.progressChartRequest();
    expect(action.type).toEqual(actions.PROGRESS_CHART_REQUEST);
  });
});

describe("progressChartSuccess", () => {
  it("Should return the action", () => {
    const progressChart = [{ session: 1, score: 78 }];
    const action = actions.progressChartSuccess(progressChart);
    expect(action.type).toEqual(actions.PROGRESS_CHART_SUCCESS);
    expect(action.progressChart).toEqual(progressChart);
  });
});

describe("addCompareChart", () => {
  it("Should return the action", () => {
    const action = actions.addCompareChart();
    expect(action.type).toEqual(actions.ADD_COMPARE_CHART);
  });
});

describe("removeCompareChart", () => {
  it("Should return the action", () => {
    const optionIndex = 1;
    const action = actions.removeCompareChart(optionIndex);
    expect(action.type).toEqual(actions.REMOVE_COMPARE_CHART);
    expect(action.optionIndex).toEqual(optionIndex);
  });
});

describe("removeCompareChartOption", () => {
  it("Should return the action", () => {
    const optionIndex = 1;
    const action = actions.removeCompareChartOption(optionIndex);
    expect(action.type).toEqual(actions.REMOVE_COMPARE_CHART_OPTION);
    expect(action.optionIndex).toEqual(optionIndex);
  });
});

describe("compareChartRequest", () => {
  it("Should return the action", () => {
    const action = actions.compareChartRequest();
    expect(action.type).toEqual(actions.COMPARE_CHART_REQUEST);
  });
});

describe("fetchUserRankRequest", () => {
  it("Should return the action", () => {
    const action = actions.fetchUserRankRequest();
    expect(action.type).toEqual(actions.FETCH_USER_RANK_REQUEST);
  });
});

describe("fetchUserRankSuccess", () => {
  it("Should return the action", () => {
    const rank = 90;
    const action = actions.fetchUserRankSuccess(rank);
    expect(action.type).toEqual(actions.FETCH_USER_RANK_SUCCESS);
    expect(action.rank).toEqual(rank);
  });
});

describe("compareChartSuccess", () => {
  it("Should return the action", () => {
    const compareChart = [{ session: 1, score: 45 }, { session: 2, score: 80 }];
    const selectedFactors = [{ id: "barebow", name: "barebow" }];
    const optionIndex = 1;
    const action = actions.compareChartSuccess(
      compareChart,
      selectedFactors,
      optionIndex
    );
    expect(action.type).toEqual(actions.COMPARE_CHART_SUCCESS);
    expect(action.compareChart).toEqual(compareChart);
    expect(action.selectedFactors).toEqual(selectedFactors);
    expect(action.optionIndex).toEqual(optionIndex);
  });
});

describe("fetchTrainingFactors", () => {
  it("Should dispatch fetchTrainingFactorsSuccess", () => {
    const trainingFactors = {
      trainingFactors: [{ id: "barebow", name: "barebow" }]
    };

    const getState = jest
      .fn()
      .mockImplementation(() => ({ auth: { authToken: "test" } }));

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json() {
          return trainingFactors;
        }
      })
    );

    const dispatch = jest.fn();
    return actions
      .fetchTrainingFactors()(dispatch, getState)
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/trainingFactors`, {
          headers: { Authorization: "Bearer test" },
          method: "GET"
        });
        expect(dispatch).toHaveBeenCalledWith(
          actions.fetchTrainingFactorsSuccess(trainingFactors)
        );
      });
  });
});

describe("fetchProgressChart", () => {
  it("Should dispatch progressChartSuccess", () => {
    const progressChart = [];

    const getState = jest
      .fn()
      .mockImplementation(() => ({ auth: { authToken: "test" } }));

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json() {
          return progressChart;
        }
      })
    );

    const dispatch = jest.fn();
    return actions
      .fetchProgressChart()(dispatch, getState)
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/charts/progress`, {
          headers: { Authorization: "Bearer test" },
          method: "GET"
        });
        expect(dispatch).toHaveBeenCalledWith(
          actions.progressChartSuccess(progressChart)
        );
        expect(dispatch).toHaveBeenCalledWith(actions.progressChartRequest());
      });
  });
});

describe("fetchCompareChart", () => {
  it("Should dispatch compareChartSuccess", () => {
    const compareChart = [];
    const selectedFactors = { selectedFactors: 1 };
    const optionIndex = 1;

    const getState = jest
      .fn()
      .mockImplementation(() => ({ auth: { authToken: "test" } }));

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json() {
          return compareChart;
        }
      })
    );

    const dispatch = jest.fn();
    return actions
      .fetchCompareChart(optionIndex, selectedFactors)(dispatch, getState)
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/charts/compare`, {
          headers: {
            Authorization: "Bearer test",
            "content-type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({ selectedFactors })
        });
        expect(dispatch).toHaveBeenCalledWith(
          actions.compareChartSuccess(
            compareChart,
            selectedFactors,
            optionIndex
          )
        );
        expect(dispatch).toHaveBeenCalledWith(actions.compareChartRequest());
      });
  });
});

describe("computeUserRanks", () => {
  it("Should request the correct url", () => {
    const getState = jest
      .fn()
      .mockImplementation(() => ({ auth: { authToken: "test" } }));

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true
      })
    );

    const dispatch = jest.fn();
    return actions
      .computeUserRank()(dispatch, getState)
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/ranks/`, {
          headers: {
            Authorization: "Bearer test"
          },
          method: "POST"
        });
      });
  });
});

describe("fetchUserRank", () => {
  it("Should dispatch fetchUserRankSuccess", () => {
    const rank = 100;

    const getState = jest
      .fn()
      .mockImplementation(() => ({ auth: { authToken: "test" } }));

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json() {
          return rank;
        }
      })
    );

    const dispatch = jest.fn();
    return actions
      .fetchUserRank()(dispatch, getState)
      .then(() => {
        expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/ranks`, {
          headers: { Authorization: "Bearer test" },
          method: "GET"
        });
        expect(dispatch).toHaveBeenCalledWith(
          actions.fetchUserRankSuccess(rank)
        );
        expect(dispatch).toHaveBeenCalledWith(actions.fetchUserRankRequest());
      });
  });
});
