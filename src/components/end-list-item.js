import React from "react";
import { connect } from "react-redux";
import { deleteEnd } from "../actions";
import { withRouter } from "react-router";
import Arrow from "./arrow";

export function EndListItem(props) {
  console.log("END LIST ITEM");
  console.log(props);
  const arrows = props.end.arrows.map(arrow => (
    <Arrow key={arrow.arrowNumber} arrow={arrow} />
  ));

  return (
    <section>
      <h2>End {props.end.id}</h2>
      <p>{arrows}</p>

      <button
        type="button"
        onClick={() => {
          props.history.push(`/session/${props.sessionId}/end/${props.endId}`);
        }}
      >
        Edit
      </button>
      <button
        onClick={() => props.dispatch(deleteEnd(props.sessionId, props.endId))}
      >
        Delete
      </button>
    </section>
  );
}
/*
const mapStateToProps = (state, props) => ({
  end: state.archeryTrackerReducer.ends.find(end => props.endId === end.id)
});
*/
export default withRouter(connect()(EndListItem));
