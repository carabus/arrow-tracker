import * as actions from "../actions/profile";

const initialState = {
  trainingFactors: [],
  rank: 0,
  progressChart: [],
  compareChart: [
    {
      selectedFactors: [],
      chart: { name: "normal training", data: [] }
    }
  ]

  /*

[{
  selectedFactors [],
  chart = {
    name: "",
    data: []
  },
}]
add

*/

  /*  [
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
  ]*/
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_TRAINING_FACTORS_SUCCESS: {
      return Object.assign({}, state, {
        trainingFactors: action.trainingFactors,
        error: null
      });
      break;
    }
    case actions.FETCH_TRAINING_FACTORS_ERROR: {
      return Object.assign({}, state, {
        error: action.error
      });
      break;
    }

    case actions.PROGRESS_CHART_SUCCESS: {
      return Object.assign({}, state, {
        progressChart: action.progressChart,
        error: null
      });
      break;
    }
    case actions.PROGRESS_CHART_ERROR: {
      return Object.assign({}, state, {
        error: action.error
      });
      break;
    }

    case actions.COMPARE_CHART_SUCCESS: {
      let chartName = "";
      if (action.selectedFactors.length === 0) chartName = "normal training";
      else {
        chartName = action.selectedFactors.reduce(
          (factorName, factorNameSum, index) => {
            if (!index) return (factorNameSum += factorName);
            return (factorNameSum += ` & ${factorName}`);
          }
        );
      }

      let compareChart = state.compareChart.map((chart, index) => {
        if (index === action.optionIndex) {
          return {
            selectedFactors: action.selectedFactors.map(factor => ({
              id: factor,
              name: factor
            })),
            chart: {
              name: chartName,
              data: action.compareChart
            }
          };
        }
        return chart;
      });

      return Object.assign({}, state, {
        compareChart,
        error: null
      });
      break;
    }

    case actions.ADD_COMPARE_CHART: {
      return Object.assign({}, state, {
        compareChart: [
          ...state.compareChart,
          {
            selectedFactors: [],
            chart: null
          }
        ]
      });
      break;
    }

    case actions.REMOVE_COMPARE_CHART: {
      let compareChart = state.compareChart.map((chart, index) => {
        if (index === action.optionIndex) {
          return {
            selectedFactors: [],
            chart: null
          };
        }
        return chart;
      });

      return Object.assign({}, state, {
        compareChart,
        error: null
      });
      break;
    }

    case actions.REMOVE_COMPARE_CHART_OPTION: {
      let compareChart = state.compareChart.filter(
        (chart, index) => index != action.optionIndex
      );

      return Object.assign({}, state, {
        compareChart,
        error: null
      });
      break;
    }

    case actions.COMPARE_CHART_ERROR: {
      return Object.assign({}, state, {
        error: action.error
      });
      break;
    }

    case actions.FETCH_USER_RANK_SUCCESS: {
      return Object.assign({}, state, {
        rank: action.rank,
        error: null
      });
      break;
    }
    case actions.FETCH_USER_RANK_ERROR: {
      return Object.assign({}, state, {
        error: action.error
      });
      break;
    }

    default:
      return { ...state };
  }
};
