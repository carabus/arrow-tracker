import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

export function SessionTable(props) {
  console.log(props.sessions);

  const sessions = props.sessions.map(session => (
    <Route
      render={({ history }) => (
        <tr
          key={session.id}
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

const mapStateToProps = state => ({
  sessions: Object.values(state.sessions)
});

export default connect(mapStateToProps)(SessionTable);
