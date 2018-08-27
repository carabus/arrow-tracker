import React from "react";
import { connect } from "react-redux";
import { deleteEnd } from "../actions";
import { withRouter } from "react-router";
import Arrow from "./arrow";

export function EndListItem(props) {
  const arrows = props.end.arrows.map(arrow => (
    <Arrow key={arrow._id} arrow={arrow} />
  ));

  return (
    <section className="table-row">
      <div className="table-cell">
        <div className="end-num">#{props.endNum}</div>
        <div>{arrows}</div>
      </div>
      <div className="nowrap-cell">
        <button
          className="edit"
          type="button"
          onClick={() => {
            props.history.push(
              `/session/${props.session.id}/end/${props.end._id}`
            );
          }}
        >
          <i className="fas fa-pen" />
        </button>
        <button
          className="delete"
          onClick={() => props.dispatch(deleteEnd(props.session, props.end))}
        >
          <i className="fas fa-trash" />
        </button>
      </div>
    </section>
  );
}
/*
const mapStateToProps = (state, props) => ({
  end: state.archeryTrackerReducer.ends.find(end => props.endId === end.id)
});
*/
export default withRouter(connect()(EndListItem));
