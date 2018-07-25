import React from "react";
import { connect } from "react-redux";
import { deleteEnd } from "../actions";
import { withRouter } from "react-router";
import Arrow from "./arrow";

export function EndListItem(props) {
  console.log("END LIST ITEM", props.end);
  console.log(props);
  const arrows = props.end.arrows.map(arrow => (
    <Arrow key={arrow._id} arrow={arrow} />
  ));

  return (
    <section>
      <h2>End {props.endNum}</h2>
      <p>{arrows}</p>

      <button
        type="button"
        onClick={() => {
          props.history.push(
            `/session/${props.session.id}/end/${props.end._id}`
          );
        }}
      >
        Edit
      </button>
      <button
        onClick={() => props.dispatch(deleteEnd(props.session, props.end))}
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
