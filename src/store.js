import { createStore, applyMiddleware, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { archeryTrackerReducer } from "./reducers/index";
import { profileReducer } from "./reducers/profile";
import authReducer from "./reducers/auth";
import thunk from "redux-thunk";
import { loadAuthToken } from "./local-storage";
import { setAuthToken, refreshAuthToken } from "./actions/auth";

//const store = createStore(state => state, initialState);
const store = createStore(
  combineReducers({
    auth: authReducer,
    archeryTrackerReducer,
    profileReducer,
    form: formReducer
  }),
  applyMiddleware(thunk)
);

// Hydrate the authToken from localStorage if it exist
const authToken = loadAuthToken();
if (authToken) {
  const token = authToken;
  store.dispatch(setAuthToken(token));
  store.dispatch(refreshAuthToken());
}

export default store;
