import React from "react";
import requiresLogin from "./requires-login";
import SessionList from "./session-list";
import { CompareChart } from "./compare-chart";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { connect } from "react-redux";
import { fetchSessions } from "../actions";
import { fetchTrainingFactors } from "../actions/profile";
import { clearAuth } from "../actions/auth";
import { clearAuthToken } from "../local-storage";
import HeaderBar from "./header-bar";
import "./session.css";
import "./dashboard.css";
import {
  fetchProgressChart,
  fetchUserRank,
  fetchCompareChart
} from "../actions/profile";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

export class Dashboard extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchSessions());
    this.props.dispatch(fetchTrainingFactors());
    this.props.dispatch(fetchProgressChart());
    this.props.dispatch(fetchUserRank());
    this.props.dispatch(fetchCompareChart(0, []));
    window.scrollTo(0, 0);
  }

  logOut() {
    this.props.dispatch(clearAuth());
    clearAuthToken();
  }

  render() {
    let progressChart;
    if (!this.props.progressChart.length) {
      progressChart = (
        <div className="card-body">
          <p className="centered-text">Not enough data to display chart</p>
        </div>
      );
    } else {
      progressChart = (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={this.props.progressChart}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="session" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <div className="session dashboard">
        <HeaderBar />
        <main role="main">
          <p className="big-text centered-text greeting">
            Welcome {this.props.name}
          </p>
          <section className="card">
            <div className="row">
              <div className="column-40">
                <div className="card-header">
                  <header role="banner">
                    <h1>Dashboard</h1>
                  </header>
                </div>
                <section>
                  <div className="centered-text">
                    Your rank{" "}
                    <button
                      data-tip
                      data-for="rank"
                      data-event="click"
                      className="tooltip"
                    >
                      <i className="fas fa-question" />
                    </button>
                    <ReactTooltip id="rank" globalEventOff="click">
                      <div>
                        Rank percentile of average session score across all app
                        users.
                      </div>
                      <div>
                        Sessions with bigger distance are given more weight.
                      </div>
                    </ReactTooltip>
                  </div>
                  <div className="flex-wrapper">
                    <div className="single-chart">
                      <svg
                        viewBox="0 0 36 36"
                        className="circular-chart orange"
                      >
                        <path
                          className="circle-bg"
                          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="circle"
                          strokeDasharray={`${this.props.rank}, 100`}
                          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x={18} y="20.35" className="percentage">
                          {this.props.rank}
                        </text>
                      </svg>
                    </div>
                  </div>
                  <hr />
                  <Link to={`/new/session`}>
                    <button className="button-primary" type="button">
                      New Training
                    </button>
                  </Link>
                </section>
              </div>
              <div className="column-60">
                <h2>Session Scores (%)</h2>
                {progressChart}
              </div>
            </div>
          </section>
          <SessionList sessions={this.props.sessions} />
          <CompareChart
            compareChart={this.props.compareChart}
            dispatch={this.props.dispatch}
            trainingFactors={this.props.trainingFactors}
          />
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { currentUser } = state.auth;
  return {
    username: state.auth.currentUser.username,
    name: currentUser.name,
    sessions: state.archeryTrackerReducer.sessions,
    trainingFactors: state.profileReducer.trainingFactors,
    rank: state.profileReducer.rank,
    progressChart: state.profileReducer.progressChart,
    compareChart: state.profileReducer.compareChart
  };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
