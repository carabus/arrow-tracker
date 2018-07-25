import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { createEnd, fetchSessions } from "../actions";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import EndListItem from "./end-list-item";
import SessionDetails from "./session-details";
import FormattedDate from "./formatted-date";

export class Session extends React.Component {
  componentDidMount() {
    if (!this.props.session) {
      this.props.dispatch(fetchSessions());
    }
  }
  render() {
    if (!this.props.session) {
      return (
        <main>
          <section>
            <p>No Such Session</p>
          </section>
        </main>
      );
    }

    const endList = this.props.session.ends.map((end, index) => (
      <EndListItem
        session={this.props.session}
        end={end}
        key={end._id}
        endNum={index + 1}
      />
    ));

    const simpleLineChart = (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={this.props.session.chart}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );

    return (
      <main role="main">
        <header role="banner">
          <h1>Training session</h1>
          <p>
            Started on <FormattedDate date={this.props.session.created} />
          </p>
        </header>
        <SessionDetails
          session={this.props.session}
          history={this.props.history}
        />
        <section>{simpleLineChart}</section>
        {endList}
        <section>
          <button
            type="button"
            onClick={() =>
              this.props.dispatch(
                createEnd(this.props.session, this.props.history)
              )
            }
          >
            + New End
          </button>
        </section>
      </main>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    session: state.archeryTrackerReducer.sessions.find(
      session => session.id === props.match.params.sessionId
    )
  };
};
export default connect(mapStateToProps)(Session);
