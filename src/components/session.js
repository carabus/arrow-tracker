import React from "react";
import requiresLogin from "./requires-login";
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
import NavigationTrail from "./navigation-trail";
import HeaderBar from "./header-bar";

export class Session extends React.Component {
  componentDidMount() {
    if (!this.props.session) {
      this.props.dispatch(fetchSessions());
    }
    window.scrollTo(0, 0);
  }
  render() {
    if (!this.props.session && this.props.isLoading) {
      return (
        <main>
          <section>
            <p>Loading...</p>
          </section>
        </main>
      );
    }
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
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );

    const headerContent = <NavigationTrail />;

    return (
      <div>
        <HeaderBar content={headerContent} />
        <main role="main">
          <header role="banner">
            <h1>Training session</h1>
            <section className="sub-section">
              <p>
                Started on <FormattedDate date={this.props.session.created} />
              </p>
            </section>
          </header>
          <SessionDetails
            session={this.props.session}
            history={this.props.history}
          />
          <section className="white-gradient">
            <h2>Score Chart</h2>
            {simpleLineChart}
          </section>
          {endList}
          <section>
            <button
              disabled={this.props.isLoading}
              className="button-primary"
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
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    session: state.archeryTrackerReducer.sessions.find(
      session => session.id === props.match.params.sessionId
    ),
    isLoading: state.archeryTrackerReducer.isLoading
  };
};
export default requiresLogin()(connect(mapStateToProps)(Session));
