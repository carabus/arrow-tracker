import React from "react";
import requiresLogin from "./requires-login";

import StartTracking from "./start-tracking";
import SessionList from "./session-list";
import Stats from "./stats";
import { connect } from "react-redux";
import { fetchSessions } from "../actions";
import { fetchTrainingFactors } from "../actions/profile";

export class Dashboard extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchSessions());
    this.props.dispatch(fetchTrainingFactors());
  }

  render() {
    console.log(this.props.sessions);
    return (
      <div className="dashboard">
        <header role="banner">
          <h1>Archery Tracker Dashboard</h1>
        </header>
        <main role="main">
          <section className="dashboard">
            <div className="dashboard-name">Hello, {this.props.name}!</div>
          </section>
          <StartTracking />
          <SessionList />
          <Stats />
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("STATE", state);
  const { currentUser } = state.auth;
  return {
    username: state.auth.currentUser.username,
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    sessions: state.archeryTrackerReducer.sessions
  };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
