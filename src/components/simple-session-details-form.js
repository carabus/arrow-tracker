import React from "react";
import { createSession } from "../actions";
import { updateSession } from "../actions";
import { connect } from "react-redux";
import SessionOption from "./session-option";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { fetchTrainingFactors } from "../actions/profile";

export class SimpleSessionDetailsForm extends React.Component {
  state = {
    selectedOption: []
  };

  onSubmit = event => {
    event.preventDefault();
    console.log(this.state.selectedOption);

    const selectedOptionsNames = Object.values(this.state.selectedOption).map(
      option => option.name
    );

    console.log(selectedOptionsNames);

    if (this.props.currentSession) {
      let updatedSession = this.props.currentSession;
      updatedSession.distance = this.distance.value;
      updatedSession.distanceUnits = this.distanceUnits.value;
      updatedSession.trainingFactors = selectedOptionsNames;
      this.props.dispatch(updateSession(updatedSession));
      this.props.editingCallback();
      return;
    }

    this.props.dispatch(
      createSession(
        {
          distance: this.distance.value,
          distanceUnits: this.distanceUnits.value,
          trainingFactors: selectedOptionsNames
        },
        this.props.history
      )
    );
  };

  componentDidMount() {
    if (!this.props.trainingFactors.length) {
      console.log("I did not fetch any training factors");
      this.props.dispatch(fetchTrainingFactors());
    }
    if (this.props.currentSession) {
      this.distance.value = this.props.currentSession.distance;
      this.distanceUnits.value = this.props.currentSession.distanceUnits;
      const selectedOption = this.props.currentSession.trainingFactors.map(
        option => {
          return { id: option, name: option };
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
                options={this.props.trainingFactors}
              />
            </fieldset>
          </div>

          <button type="submit">Submit</button>
          <button type="button" onClick={() => this.props.editingCallback()}>
            Cancel
          </button>
        </form>
      </section>
    );
  }
}

const mapStateToProps = state => {
  console.log("MAP STATE TO PROPS FORM");
  return {
    trainingFactors: state.profileReducer.trainingFactors
  };
};

export default connect(mapStateToProps)(SimpleSessionDetailsForm);
