import React from "react";
import { createSession } from "../actions";
import { updateSession } from "../actions";
import { connect } from "react-redux";
import SessionOption from "./session-option";

export class SimpleSessionDetailsForm extends React.Component {
  onSubmit = event => {
    event.preventDefault();

    if (this.props.currentSession) {
      this.props.dispatch(
        updateSession(this.props.currentSession.id, {
          distance: this.distance.value,
          distanceUnits: this.distanceUnits.value
        })
      );
      this.props.editingCallback();
      return;
    }

    this.props.dispatch(
      createSession({
        startDate: this.props.startDate,
        distance: this.distance.value,
        distanceUnits: this.distanceUnits.value,
        history: this.props.history
      })
    );
  };

  componentDidMount() {
    if (this.props.currentSession) {
      this.distance.value = this.props.currentSession.distance;
      this.distanceUnits.value = this.props.currentSession.distanceUnits;
    }
  }

  toggleCheckbox = event => {
    console.log("toggled checkbox", event.target.value);
  };

  render() {
    console.log("SESSION FORM PROPS", this.props);
    const options = this.props.profile.additionalOptions.map(option => (
      <SessionOption option={option} key={option.id} cb={this.toggleCheckbox} />
    ));
    return (
      <section>
        <form onSubmit={this.onSubmit}>
          <div className="form-section">
            <label htmlFor="distance">Distance</label>
            <input
              id="distance"
              type="number"
              required
              ref={input => (this.distance = input)}
            />
            <select
              id="distance-units"
              defaultValue="yards"
              required
              ref={input => (this.distanceUnits = input)}
            >
              <option value="meters">meters</option>
              <option value="yards">yards</option>
            </select>
          </div>
          <div className="form-section">
            <fieldset>
              <legend>Additional Options</legend>
              <div className="option-group">
                {options}
                <a href="#" target="_self">
                  + Add
                </a>
              </div>
            </fieldset>
          </div>

          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </form>
      </section>
    );
  }
}

const mapStateToProps = state => {
  console.log("MAP STATE TO PROPS FORM");
  return {
    profile: state.profileReducer.profile
  };
};

export default connect(mapStateToProps)(SimpleSessionDetailsForm);
