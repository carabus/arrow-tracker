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
    console.log(this.props);

    const optionsList = this.props.session.trainingFactors.map(factor => (
      <li key={factor}>{factor}</li>
    ));

    if (this.state.editing) {
      return (
        <SimpleSessionDetailsForm
          currentSession={this.props.session}
          editingCallback={this.setEditing}
        />
      );
    }

    return (
      <section>
        <dl>
          <dt>Distance</dt>
          <dd>
            {this.props.session.distance} {this.props.session.distanceUnits}
          </dd>
          <dt>Additional options</dt>
          <dd>
            <ul>{optionsList}</ul>
          </dd>
        </dl>
        <button onClick={() => this.setEditing(true)}>Edit</button>
        <button
          onClick={() =>
            this.props.dispatch(
              deleteSession(this.props.session, this.props.history)
            )
          }
        >
          Delete
        </button>
      </section>
    );
  }
}

export default connect()(SessionDetails);
