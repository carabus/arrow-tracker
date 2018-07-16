import { createStore, applyMiddleware, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { archeryTrackerReducer } from "./reducers/index";
import { profileReducer } from "./reducers/profile";
import thunk from "redux-thunk";

//const store = createStore(state => state, initialState);
const store = createStore(
  combineReducers({
    archeryTrackerReducer,
    profileReducer,
    form: formReducer
  }),
  applyMiddleware(thunk)
);

export default store;
