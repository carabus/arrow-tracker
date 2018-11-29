import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import FormattedDate from "./formatted-date";
import "./session-list.css";
import ReactTooltip from "react-tooltip";
import TargetIcon from "./target/target-icon.js";

export class SessionList extends React.Component {
  state = {
    isExpanded: false
  };

  handleExpand = e => {
    e.preventDefault();
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  };

  render() {
    // Only showing Show More link if over 3 sessions found
    let showMore;
    if (this.props.sessions.length && this.props.sessions.length > 3) {
      showMore = (
        <a href="" onClick={e => this.handleExpand(e)}>
          {this.state.isExpanded ? "Show Less" : "Show More"}
        </a>
      );
    }

    let sessions;
    if (!this.props.sessions.length) {
      sessions = <p className="centered-text">No recent training sessions</p>;
    } else {
      sessions = this.props.sessions.map((session, index) => {
        const scorePercent = Math.round(
          (session.score / session.maxScore) * 100
        );
        if (this.state.isExpanded || (!this.state.isExpanded && index < 3)) {
          return (
            <div key={session.id}>
              <li
                onClick={() =>
                  this.props.history.push(`/session/${session.id}`)
                }
              >
                <div style={{ display: "flex" }}>
                  <TargetIcon targetType={session.targetType} />
                  <div>
                    <div>
                      Training at {session.distance} {session.distanceUnits}
                    </div>
                    <div className="session-date">
                      <FormattedDate date={session.created} />
                    </div>
                  </div>
                </div>
                <div>
                  {session.score} / {session.maxScore} ( {scorePercent}% )
                </div>
              </li>
              <hr />
            </div>
          );
        } else {
          return null;
        }
      });
    }
    return (
      <section className="card">
        <div className="card-header">
          <div className="flex-header">
            <div width="20px" />
            <h2>Recent Training Sessions</h2>
            <div>
              <button
                data-tip
                data-for="list"
                data-event="click"
                className="tooltip"
              >
                <i className="fas fa-question" />
              </button>
              <ReactTooltip id="list" globalEventOff="click">
                <div>Up to 10 recent sessions are displayed</div>
              </ReactTooltip>
            </div>
          </div>
        </div>

        <div className="card-body session-list">
          <ul>{sessions}</ul>
          {showMore}
        </div>
      </section>
    );
  }
}

export default withRouter(connect()(SessionList));
