import React, { Component } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  withRouter
} from "react-router-dom";
import LandingPage from "./landing-page";
import Dashboard from "./dashboard";
import RegistrationPage from "./registration-page";
import LoginForm from "./login-form";
import { refreshAuthToken } from "../actions/auth";
import { computeUserRank } from "../actions/profile";
import Session from "./session";
import End from "./end";
import NewSession from "./new-session";

class App extends Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.loggedIn && this.props.loggedIn) {
      // When we are logged in, refresh the auth token periodically
      this.startPeriodicRefresh();
    } else if (prevProps.loggedIn && !this.props.loggedIn) {
      // Stop refreshing when we log out
      this.stopPeriodicRefresh();
    }
  }

  componentWillUnmount() {
    this.stopPeriodicRefresh();
  }

  startPeriodicRefresh() {
    this.refreshInterval = setInterval(
      () => this.props.dispatch(refreshAuthToken()),
      60 * 60 * 1000 // One hour
    );
    this.statsGenInterval = setInterval(
      () => this.props.dispatch(computeUserRank()),
      60 * 5 * 1000
    );
  }

  stopPeriodicRefresh() {
    if (!this.refreshInterval) {
      return;
    }

    clearInterval(this.refreshInterval);
  }

  render() {
    if (this.props.errorSessions || this.props.errorCharts) {
      return <div>There was an error</div>;
    }
    return (
      <Router>
        <div className="app">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/register" component={RegistrationPage} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/dashboard" component={Dashboard} />

            <Route exact path="/session/:sessionId" component={Session} />

            <Route exact path="/new/session" component={NewSession} />
            <Route
              exact
              path="/session/:sessionId/end/:endNumber"
              component={End}
            />
            <Redirect to="/" />

          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  hasAuthToken: state.auth.authToken !== null,
  loggedIn: state.auth.currentUser !== null,
  errorSessions: state.archeryTrackerReducer.error,
  errorCharts: state.profileReducer.error
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
