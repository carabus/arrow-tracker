import React from "react";

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
        <StartTracking />
        <SessionList />
        <Stats />
      </main>
    </div>
  );
}

export default connect()(Dashboard);
