import React from "react";
import requiresLogin from "./requires-login";

import StartTracking from "./start-tracking";
import SessionList from "./session-list";
import Stats from "./stats";
import { connect } from "react-redux";

export function Dashboard(props) {
  console.log("DASHBOARD", props);
  return (
    <div className="dashboard">
      <header role="banner">
        <h1>Archery Tracker Dashboard</h1>
      </header>
      <main role="main">
        <section className="dashboard">
          <div className="dashboard-name">Hello, {props.name}!</div>
        </section>
        <StartTracking />
        <SessionList />
        <Stats />
      </main>
    </div>
  );
}

const mapStateToProps = state => {
  const { currentUser } = state.auth;
  return {
    username: state.auth.currentUser.username,
    name: `${currentUser.firstName} ${currentUser.lastName}`
    /*protectedData: state.protectedData.data*/
  };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
