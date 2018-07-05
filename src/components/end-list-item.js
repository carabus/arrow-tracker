import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

export function EndListItem(props) {
  console.log(props);
  const arrows = props.end.arrows.map(arrow => (
    <span className="score red" key={arrow.arrowNumber}>
      {arrow.arrowScore}
    </span>
  ));

  return (
    <Route
      render={({ history }) => (
        <section>
          <h2>End {props.end.id}</h2>
          <p>{arrows}</p>

          <button
            type="button"
            onClick={() => {
              history.push(`/end/${props.sessionId}/${props.endId}`);
            }}
          >
            Edit
          </button>
          <button>Delete</button>
        </section>
      )}
    />
  );
}

const mapStateToProps = (state, props) => ({
  end: state.sessions[props.sessionId].ends[props.endId - 1]
});

export default connect(mapStateToProps)(EndListItem);
