import * as actions from "../actions/profile";
import { RESET } from "../actions";

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

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_TRAINING_FACTORS_SUCCESS: {
      return Object.assign({}, state, {
        trainingFactors: action.trainingFactors,
        error: null
      });
    }
    case actions.FETCH_PROFILE_ERROR: {
      return Object.assign({}, state, {
        error: action.error
      });
    }

    case actions.PROGRESS_CHART_SUCCESS: {
      return Object.assign({}, state, {
        progressChart: action.progressChart,
        error: null
      });
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
    }

    case actions.REMOVE_COMPARE_CHART_OPTION: {
      let compareChart = state.compareChart.filter(
        (chart, index) => index !== action.optionIndex
      );

      return Object.assign({}, state, {
        compareChart,
        error: null
      });
    }

    case actions.FETCH_USER_RANK_SUCCESS: {
      return Object.assign({}, state, {
        rank: action.rank,
        error: null
      });
    }

    case RESET: {
      return initialState;
    }

    default:
      return { ...state };
  }
};
