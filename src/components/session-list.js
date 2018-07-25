import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import FormattedDate from "./formatted-date";
import "./session-list.css";

export function SessionList(props) {
  console.log("SESSION LIST ", props);
  const sessions = props.sessions.map(session => (
    <li
      key={session.id}
      onClick={() => props.history.push(`/session/${session.id}`)}
    >
      <div>
        <div>
          Training at {session.distance} {session.distanceUnits}
        </div>
        <div className="session-date">
          <FormattedDate date={session.created} />
        </div>
      </div>

      <div>
        {session.score}/{session.maxScore}
      </div>
    </li>
  ));

  return (
    <section>
      <header>
        <h2>My Training Sessions</h2>
      </header>
      <div className="session-list">
        <ul>{sessions}</ul>
      </div>
      <button>Show More</button>
    </section>
  );
}

const mapStateToProps = state => {
  return {
    sessions: state.archeryTrackerReducer.sessions
  };
};

export default withRouter(connect(mapStateToProps)(SessionList));
