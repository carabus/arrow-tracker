import * as actions from "../actions";

const initialState = {
  profile: {
    additionalOptions: [
      { id: 1, name: "fancy arrows" },
      { id: 2, name: "outdoors" },
      { id: 3, name: "without stabilizer" },
      { id: 4, name: "barebow" }
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
