import React from "react";

import StartTracking from "./start-tracking";
import SessionTable from "./session-table";
import Stats from "./stats";

export default function Dashboard(props) {
  return (
    <div className="dashboard">
      <header role="banner">
        <h1>Archery Tracker Dashboard</h1>
      </header>
      <main role="main">
        <StartTracking />
        <SessionTable />
        <Stats />
      </main>
    </div>
  );
}
