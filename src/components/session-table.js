import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import store from "../store";

export function SessionTable(props) {
  console.log(props.sessions);
  console.log(store.getState());

  const sessions = props.sessions.map(session => (
    <Route
      key={session.id}
      render={({ history }) => (
        <tr
          onClick={() => {
            history.push(`/session/${session.id}`);
          }}
        >
          <td>
            <p>Training at {session.distance}</p>
          </td>
          <td>{session.startDate}</td>
          <td>
            {session.score}/{session.maxScore}
          </td>
          <td>
            <button
              type="button"
              onClick={() => {
                history.push(`/session/${session.id}`);
              }}
            >
              Details
            </button>
          </td>
        </tr>
      )}
    />
  ));

  return (
    <section>
      <header>
        <h2>My Training Sessions</h2>
      </header>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Points</th>
            <th>&nbsp;</th>
          </tr>
        </thead>

        <tbody>{sessions}</tbody>
      </table>
      <button>Previous</button>
      <button>Next</button>
    </section>
  );
}

const mapStateToProps = state => {
  console.log("This is session table state", state);
  return {
    sessions: state.archeryTrackerReducer.sessions
  };
};

export default connect(mapStateToProps)(SessionTable);
