import React from "react";
import requiresLogin from "./requires-login";
import { connect } from "react-redux";
import { createEnd, fetchSessions } from "../actions";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import EndListItem from "./end-list-item";
import SessionDetails from "./session-details";
import HeaderBar from "./header-bar";
import "./session.css";
import FormattedDate from "./formatted-date";

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
            <p className="centered-text">Loading...</p>
          </section>
        </main>
      );
    }
    if (!this.props.session) {
      return (
        <main>
          <section>
            <p className="centered-text">No Such Session</p>
          </section>
        </main>
      );
    }

    const endList = this.props.session.ends.map((end, index) => {
      return (
        <div key={end._id}>
          <EndListItem
            session={this.props.session}
            end={end}
            endNum={index + 1}
          />
          <hr />
        </div>
      );
    });

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
          <Line
            type="monotone"
            dataKey="score"
            stroke="#007bff"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );

    return (
      <div class="session">
        <HeaderBar sessionId={this.props.session.id} />
        <main role="main">
          <section className="card">
            <div className="row">
              <div className="column-40">
                <div className="card-header">
                  <div className="flex-header">
                    <header role="banner">
                      <h1>Training Session</h1>
                    </header>
                  </div>
                  <p className="centered-text ">
                    Started on{" "}
                    <FormattedDate date={this.props.session.created} />
                  </p>
                </div>

                <SessionDetails
                  session={this.props.session}
                  history={this.props.history}
                />
              </div>
              <div className="column-60">
                <h2>End Scores</h2>
                {simpleLineChart}
              </div>
            </div>
          </section>
          <section className="card">
            <div className="card-header">
              <div className="flex-header">
                <div width="20px" />
                <h2>Ends</h2>
                <div>
                  <button
                    disabled={this.props.isLoading}
                    className="create"
                    type="button"
                    onClick={() =>
                      this.props.dispatch(
                        createEnd(this.props.session, this.props.history)
                      )
                    }
                  >
                    <i class="fas fa-plus" />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">{endList}</div>
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
