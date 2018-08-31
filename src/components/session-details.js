import React from "react";
import { connect } from "react-redux";
import SimpleSessionDetailsForm from "./simple-session-details-form";
import { deleteSession } from "../actions";

export class SessionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };

    this.setEditing = this.setEditing.bind(this);
  }

  setEditing() {
    this.setState({
      editing: !this.state.editing
    });
  }

  render() {
    let optionsList = this.props.session.trainingFactors.map(factor => (
      <li key={factor}>{factor}</li>
    ));

    if (!optionsList.length) {
      optionsList.push(<li key={"none"}>{"none"}</li>);
    }

    if (this.state.editing) {
      return (
        <SimpleSessionDetailsForm
          currentSession={this.props.session}
          editingCallback={this.setEditing}
        />
      );
    }

    let scorePercent = Math.round(
      (this.props.session.score / this.props.session.maxScore) * 100
    );

    return (
      <section>
        <p>Score</p>
        <p className="big-text">
          {" "}
          {this.props.session.score} / {this.props.session.maxScore} (
          {scorePercent}
          %)
        </p>
        <p>Distance</p>
        <p className="big-text">
          {this.props.session.distance} {this.props.session.distanceUnits}
        </p>
        <p>Training Factors</p>
        <div className="big-text">
          <ul>{optionsList}</ul>
        </div>
        <hr />
        <button className="edit" onClick={() => this.setEditing(true)}>
          <i className="fas fa-pen" />
        </button>
        <button
          className="delete"
          onClick={() =>
            this.props.dispatch(
              deleteSession(this.props.session, this.props.history)
            )
          }
        >
          <i className="fas fa-trash" />
        </button>
      </section>
    );
  }
}

export default connect()(SessionDetails);
