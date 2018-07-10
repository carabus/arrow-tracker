import React from "react";
import { connect } from "react-redux";
import { createSession } from "../actions";
import store from "../store";

export class SimpleSessionDetailsForm extends React.Component {
  onSubmit = event => {
    event.preventDefault();
    console.log("on submit", this.textInput.value, this);
    this.props.dispatch(createSession(this.textInput.value));
  };

  render() {
    console.log(store.getState());
    return (
      <section>
        <form onSubmit={this.onSubmit}>
          <input type="text" ref={input => (this.textInput = input)} />
          <button type="submit">Add</button>
        </form>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  sessions: state.archeryTrackerReducer.sessions
});

export default connect(mapStateToProps)(SimpleSessionDetailsForm);
