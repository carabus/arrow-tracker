import { createStore, applyMiddleware, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { archeryTrackerReducer } from "./reducers/index";
import thunk from "redux-thunk";

//const store = createStore(state => state, initialState);
const store = createStore(
  combineReducers({
    archeryTrackerReducer,
    form: formReducer
  }),
  applyMiddleware(thunk)
);

export default store;
