import React from "react";
import { connect } from "react-redux";

import {
  createEnd,
  /*
  createArrow,
  removeLastArrow,*/
  fetchSessions,
  createArrow1,
  removeLastArrow1,
  updateSession
} from "../actions";
import TargetCanvas from "./target-canvas";
import Arrow from "./arrow";
import NavigationTrail from "./navigation-trail";

export class End extends React.Component {
  componentWillUnmount() {
    console.log("Component Will Unmount");
    this.props.dispatch(updateSession(this.props.session));
  }
  componentDidMount() {
    if (!this.props.session) {
      this.props.dispatch(fetchSessions());
    }
  }

  constructor(props) {
    super(props);
    this.createArrow = this.createArrow.bind(this);
  }

  createArrow(arrow) {
    this.props.dispatch(
      createArrow1(
        this.props.session,
        this.props.end,
        arrow.point,
        arrow.score,
        arrow.isInverted
      )
    );
  }

  render() {
    if (!this.props.end) return null;

    const arrows = this.props.end.arrows.map((arrow, index) => (
      <Arrow arrow={arrow} key={index} />
    ));

    return (
      <main role="main">
        <header>
          <h1>End #{this.props.endNum}</h1>
        </header>
        <NavigationTrail sessionId={this.props.match.params.sessionId} />
        <section>
          <div className="sub-section">
            <TargetCanvas
              arrows={this.props.end.arrows}
              createArrow={this.createArrow}
            />
          </div>
          <div className="sub-section">
            {arrows}
            <button
              className="button-secondary"
              type="button"
              onClick={() =>
                this.createArrow({
                  point: { x: -1, y: -1 },
                  score: 0,
                  isInverted: false
                })
              }
            >
              Miss
            </button>
            <button
              className="button-secondary"
              type="button"
              onClick={() =>
                this.props.dispatch(
                  removeLastArrow1(this.props.session, this.props.end)
                )
              }
            >
              Undo
            </button>
          </div>
        </section>
        <section>
          <button
            className="button-secondary"
            type="button"
            onClick={() => this.props.history.goBack()}
          >
            Back
          </button>
          <button
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
    );
  }
}

const mapStateToProps = (state, props) => {
  const session = state.archeryTrackerReducer.sessions.find(
    session => session.id === props.match.params.sessionId
  );

  if (!session) return { session: null, end: null };
  if (!session.ends) return { session: session, end: null };

  const end = session.ends.find(
    end => end._id === props.match.params.endNumber
  );

  return {
    session: session,
    end: end,
    endNum: session.ends.indexOf(end) + 1
  };
};
export default connect(mapStateToProps)(End);
