import { createStore } from "redux";

const initialState = {
  sessions: {
    1: {
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
              arrowCoordinates: { x: 100, y: 100 }
            },
            {
              arrowNumber: 2,
              arrowCoordinates: { x: 120, y: 120 }
            },
            {
              arrowNumber: 3,
              arrowCoordinates: { x: 125, y: 125 }
            }
          ]
        },
        {
          id: 1,
          arrows: [
            {
              arrowNumber: 1,
              arrowCoordinates: { x: 70, y: 70 }
            },
            {
              arrowNumber: 2,
              arrowCoordinates: { x: 80, y: 85 }
            },
            {
              arrowNumber: 3,
              arrowCoordinates: { x: 90, y: 85 }
            }
          ]
        }
      ]
    }
  }
};

const store = createStore(state => state, initialState);

export default store;
