import React from "react";
import { createSession } from "../actions";
import { updateSession } from "../actions";
import { connect } from "react-redux";
import SessionOption from "./session-option";
import Select from "react-select";
import "react-select/dist/react-select.css";
/*import SessionOptionsAutocomplete from "./session-options-autocomplete.js";*/

export class SimpleSessionDetailsForm extends React.Component {
  state = {
    selectedOption: ""
  };

  onSubmit = event => {
    event.preventDefault();

    if (this.props.currentSession) {
      this.props.dispatch(
        updateSession(this.props.currentSession.id, {
          distance: this.distance.value,
          distanceUnits: this.distanceUnits.value,
          additionalOptions: Object.values(this.state.selectedOption)
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
        additionalOptions: Object.values(this.state.selectedOption),
        history: this.props.history
      })
    );
  };

  componentDidMount() {
    if (this.props.currentSession) {
      this.distance.value = this.props.currentSession.distance;
      this.distanceUnits.value = this.props.currentSession.distanceUnits;
      const selectedOption = this.props.currentSession.additionalOptions.map(
        (option, index) => {
          console.log(option);
          console.log(index);
          return { id: option.id, name: option.name };
        }
      );
      console.log("STATE", selectedOption);
      this.setState({ selectedOption });
    }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    // selectedOption can be null when the `x` (close) button is clicked
    if (selectedOption) {
      console.log(`Selected:`, selectedOption);
    }
  };

  render() {
    console.log("SESSION FORM PROPS", this.props);

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
              <Select.Creatable
                name="form-field-name"
                value={this.state.selectedOption}
                multi={true}
                onChange={this.handleChange}
                valueKey="id"
                labelKey="name"
                options={this.props.profile.additionalOptions}
              />
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
