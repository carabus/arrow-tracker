import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import FormattedDate from "./formatted-date";
import "./session-list.css";

export function SessionList(props) {
  const sessions = props.sessions.map(session => {
    const scorePercent = Math.round((session.score / session.maxScore) * 100);
    return (
      <div key={session.id}>
        <li onClick={() => props.history.push(`/session/${session.id}`)}>
          <div>
            <div>
              Training at {session.distance} {session.distanceUnits}
            </div>
            <div className="session-date">
              <FormattedDate date={session.created} />
            </div>
          </div>

          <div>
            {session.score} / {session.maxScore} ( {scorePercent}% )
          </div>
        </li>
        <hr />
      </div>
    );
  });

  return (
    <section class="card">
      <div class="card-header">
        <h2>Recent Training Sessions</h2>
      </div>
      <div class="card-body session-list">
        <ul>{sessions}</ul>
      </div>
    </section>
  );
}

const mapStateToProps = state => {
  return {
    sessions: state.archeryTrackerReducer.sessions
  };
};

export default withRouter(connect(mapStateToProps)(SessionList));
