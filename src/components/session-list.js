import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import FormattedDate from "./formatted-date";
import "./session-list.css";

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
    let showMore;
    if (this.props.sessions.length) {
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
        } else {
          return null;
        }
      });
    }
    return (
      <section className="card">
        <div className="card-header">
          <h2>Recent Training Sessions</h2>
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
