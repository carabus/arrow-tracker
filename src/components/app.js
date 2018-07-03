import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import "./app.css";

import HeaderBar from "./header-bar";
import Dashboard from "./dashboard";
import Session from "./session";
import End from "./end";

class App extends Component {
  render() {
    return (
      <div className="app">
        <HeaderBar />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/session/:sessionId" component={Session} />
        <Route exact path="/end/:sessionId/:endId" component={End} />
      </div>
    );
  }
}

export default App;
