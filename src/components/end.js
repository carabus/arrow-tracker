import React from "react";
import { connect } from "react-redux";

import {
  createEnd,
  createArrow,
  removeLastArrow,
  fetchSessions
} from "../actions";
import TargetCanvas from "./target-canvas";
import Arrow from "./arrow";

export class End extends React.Component {
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
      createArrow(
        this.props.session,
        this.props.end,
        arrow.point,
        arrow.score,
        arrow.isInverted
      )
    );
  }

  removeLastArrow() {
    this.props.dispatch(
      removeLastArrow(
        parseInt(this.props.match.params.sessionId, 10),
        parseInt(this.props.end.id, 10)
      )
    );
  }

  render() {
    if (!this.props.end) return null;

    const arrows = this.props.end.arrows.map(arrow => (
      <Arrow arrow={arrow} key={arrow._id} />
    ));

    return (
      <main role="main">
        <header>
          <h1>End #{this.props.endNum}</h1>
        </header>
        <section>
          <div>
            <TargetCanvas
              arrows={this.props.end.arrows}
              createArrow={this.createArrow}
            />
          </div>
          <div>
            {arrows}
            <button
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
          <div>
            <button type="button" onClick={() => this.props.history.goBack()}>
              Back
            </button>
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
          </div>
          {/*
          <form id="record-end">
            <div className="form-section">
              <TargetCanvas
                arrows={this.props.end.arrows}
                createArrow={this.createArrow}
              />
            </div>
            <div className="form-section">
              {arrows}
              <button
                type="button"
                onClick={() =>
                  this.props.dispatch(
                    removeLastArrow(
                      parseInt(this.props.match.params.sessionId, 10),
                      parseInt(this.props.end.id, 10)
                    )
                  )
                }
              >
                Undo
              </button>
            </div>
            <button type="button">Back</button>
            <button type="submit">Next</button>
          </form>
          */}
        </section>
      </main>
    );
  }
}

const mapStateToProps = (state, props) => {
  console.log(
    "MAP STATE TO PROPS",
    props.match.params.sessionId,
    props.match.params.endId
  );
  console.log(state.archeryTrackerReducer.sessions);
  const session = state.archeryTrackerReducer.sessions.find(
    session => session.id === props.match.params.sessionId
  );
  if (!session.ends) return { end: null };

  const end = session.ends.find(
    end => end._id === props.match.params.endNumber
  );
  console.log("MAP STATE TO PROPS END", end);
  return {
    session: session,
    end: end,
    endNum: session.ends.indexOf(end) + 1
  };
};
export default connect(mapStateToProps)(End);
