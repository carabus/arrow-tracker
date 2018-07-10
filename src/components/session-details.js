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

    this.onSubmit = this.onSubmit.bind(this);
    this.setEditing = this.setEditing.bind(this);
  }

  setEditing() {
    this.setState({
      editing: !this.state.editing
    });
  }

  onSubmit(values) {
    console.log(values);
    this.setEditing();
    //return this.props.dispatch(login(values.email, values.password));
  }

  render() {
    const optionsList = this.props.session.additionalOptions.map(option => (
      <li key={option.optionName}>{option.optionName}</li>
    ));

    if (this.state.editing) {
      return (
        <SimpleSessionDetailsForm
          onSubmit={this.onSubmit}
          profile={this.props.profile}
        />
      );
    }

    return (
      <section>
        <dl>
          <dt>Distance</dt>
          <dd>{this.props.session.distance}</dd>
          <dt>Additional options</dt>
          <dd>
            <ul>{optionsList}</ul>
          </dd>
        </dl>
        <button onClick={() => this.setEditing(true)}>Edit</button>
        <button
          onClick={() =>
            this.props.dispatch(deleteSession(this.props.session.id))
          }
        >
          Delete
        </button>
      </section>
    );
  }
}

const mapStateToProps = (state, props) => ({
  profile: state.archeryTrackerReducer.profile
});

export default connect(mapStateToProps)(SessionDetails);
