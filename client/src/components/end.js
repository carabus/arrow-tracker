import React from "react";
import { connect } from "react-redux";
import requiresLogin from "./requires-login";
import "./session.css";

import {
  createEnd,
  fetchSessions,
  createArrow,
  removeLastArrow,
  updateSession
} from "../actions";
import Target from "./target/target";
import Arrow from "./arrow";
import HeaderBar from "./header-bar";
import { Link } from "react-router-dom";

export class End extends React.Component {
  componentWillUnmount() {
    // Attempt to save User Data when leaving End page
    this.props.dispatch(updateSession(this.props.session));
  }
  componentDidMount() {
    if (!this.props.session) {
      this.props.dispatch(fetchSessions());
    }
    window.scrollTo(0, 0);
  }

  constructor(props) {
    super(props);
    this.createArrow = this.createArrow.bind(this);
  }

  createArrow(arrow) {
    this.props.dispatch(
      createArrow(this.props.session, this.props.end, arrow.point, arrow.score)
    );
  }

  render() {
    if (!this.props.end && this.props.isLoading) {
      return (
        <main>
          <section>
            <p className="centered-text">Loading...</p>
          </section>
        </main>
      );
    }
    if (!this.props.end) {
      return (
        <main>
          <section>
            <p className="centered-text">No such End</p>
          </section>
        </main>
      );
    }

    const arrows = this.props.end.arrows.map((arrow, index) => (
      <Arrow arrow={arrow} key={index} />
    ));

    console.log({ targetType: this.props.session.targetType });

    return (
      <div className="session">
        <HeaderBar
          sessionId={this.props.session.id}
          endId={this.props.end._id}
        />
        <main role="main">
          <section className="card">
            <div className="card-header">
              <header>
                <h1>End #{this.props.endNum}</h1>
              </header>
            </div>
            <section>
              <div className="sub-section target-wrapper">
                <Target
                  arrows={this.props.end.arrows}
                  createArrow={this.createArrow}
                  type={this.props.session.targetType}
                />
              </div>
              <div className="card-body flat-top">
                <div className="sub-section">{arrows}</div>
                <div className="sub-section">
                  <button
                    className="button-secondary button-miss"
                    type="button"
                    onClick={() =>
                      this.createArrow({
                        point: { x: -1, y: -1 },
                        score: 0
                      })
                    }
                  >
                    Miss
                  </button>
                  <button
                    className="button-secondary button-undo"
                    type="button"
                    onClick={() =>
                      this.props.dispatch(
                        removeLastArrow(this.props.session, this.props.end)
                      )
                    }
                  >
                    Undo
                  </button>
                </div>
                <hr />

                <button
                  className="button-primary button-new-end"
                  disabled={this.props.isLoading}
                  type="button"
                  onClick={() =>
                    this.props.dispatch(
                      createEnd(this.props.session, this.props.history)
                    )
                  }
                >
                  New End
                </button>
              </div>
            </section>
            <div className="card-footer">
              <Link to="/dashboard">
                <button type="button" className="button-secondary">
                  Finish Session
                </button>
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const session = state.archeryTrackerReducer.sessions.find(
    session => session.id === props.match.params.sessionId
  );

  if (!session)
    return {
      session: null,
      end: null,
      isLoading: state.archeryTrackerReducer.isLoading
    };
  if (!session.ends)
    return {
      session: session,
      end: null,
      isLoading: state.archeryTrackerReducer.isLoading
    };

  const end = session.ends.find(
    end => end._id === props.match.params.endNumber
  );

  return {
    session: session,
    end: end,
    endNum: session.ends.indexOf(end) + 1,
    isLoading: state.archeryTrackerReducer.isLoading
  };
};
export default requiresLogin()(connect(mapStateToProps)(End));
