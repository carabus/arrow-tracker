import React from "react";
import requiresLogin from "./requires-login";

import StartTracking from "./start-tracking";
import SessionList from "./session-list";
import Stats from "./stats";
import MainHeader from "./main-header";
import { connect } from "react-redux";
import { fetchSessions } from "../actions";
import { fetchTrainingFactors } from "../actions/profile";
import { clearAuth } from "../actions/auth";
import { clearAuthToken } from "../local-storage";

export class Dashboard extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchSessions());
    this.props.dispatch(fetchTrainingFactors());
    window.scrollTo(0, 0);
  }

  logOut() {
    this.props.dispatch(clearAuth());
    clearAuthToken();
  }

  render() {
    return (
      <main role="main">
        <MainHeader />
        <section>
          <h2>Dashboard</h2>
        </section>

        <section>
          Hello, {this.props.name}!
          <button onClick={() => this.logOut()}>Log out</button>
        </section>
        <StartTracking />
        <SessionList />
        <Stats />
      </main>
    );
  }
}

const mapStateToProps = state => {
  const { currentUser } = state.auth;
  return {
    username: state.auth.currentUser.username,
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    sessions: state.archeryTrackerReducer.sessions
  };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
