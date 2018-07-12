import React, { Component } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import "./app.css";

import { loadData } from "../actions";
import HeaderBar from "./header-bar";
import Dashboard from "./dashboard";
import Session from "./session";
import End from "./end";
import NewSession from "./new-session";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <HeaderBar />
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />

            <Route exact path="/session/:sessionId" component={Session} />

            <Route exact path="/new/session" component={NewSession} />
            <Route
              exact
              path="/session/:sessionId/end/:endNumber"
              component={End}
            />
            {/*
        <Route exact path="/end/:sessionId/:endId" component={End} />
        */}
          </Switch>
        </div>
      </Router>
    );
  }
}

//export default App;
export default connect()(App);
