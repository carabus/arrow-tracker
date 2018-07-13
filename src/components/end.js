import React from "react";
import { connect } from "react-redux";

import { createEnd } from "../actions";
import { createArrow } from "../actions";
import { removeLastArrow } from "../actions";
import TargetCanvas from "./target-canvas";

export class End extends React.Component {
  constructor(props) {
    super(props);
    this.createArrow = this.createArrow.bind(this);
  }

  createArrow(arrow) {
    this.props.dispatch(
      createArrow(
        parseInt(this.props.match.params.sessionId, 10),
        parseInt(this.props.end.id, 10),
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
    console.log("RENDER", this.props);

    if (!this.props.end) return null;
    const arrows = this.props.end.arrows.map(arrow => (
      <span className="score red" key={arrow.arrowNumber}>
        {arrow.arrowScore}
      </span>
    ));

    return (
      <main role="main">
        <header>
          <h1>End {this.props.match.params.endNumber}</h1>
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
          <div>
            <button type="button" onClick={() => this.props.history.goBack()}>
              Back
            </button>
            <button
              type="button"
              onClick={() =>
                this.props.dispatch(
                  createEnd(
                    parseInt(this.props.match.params.sessionId, 10),
                    this.props.history
                  )
                )
              }
            >
              Next
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
  const session = state.archeryTrackerReducer.sessions.find(
    session => session.id === parseInt(props.match.params.sessionId, 10)
  );
  if (!session.ends) return { end: null };

  const end = session.ends.find(
    end => end.id === parseInt(props.match.params.endNumber, 10)
  );
  console.log("MAP STATE TO PROPS END", end);
  return {
    end: end
  };
};
export default connect(mapStateToProps)(End);
