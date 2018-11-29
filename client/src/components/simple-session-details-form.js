import React from "react";
import { createSession } from "../actions";
import { updateSession } from "../actions";
import { connect } from "react-redux";
import { fetchTrainingFactors } from "../actions/profile";
import Select from "react-select";
import "react-select/dist/react-select.css";
import "./target/target-icon.css";

export class SimpleSessionDetailsForm extends React.Component {
  state = {
    selectedOption: []
  };

  onCancel = () => {
    // if existing session - turn off editing mode, if new session - go back to dashboard
    if (this.props.currentSession) {
      this.props.editingCallback();
    } else {
      this.props.history.push("/dashboard");
    }
  };

  onSubmit = event => {
    event.preventDefault();

    const selectedOptionsNames = Object.values(this.state.selectedOption).map(
      option => option.name
    );
    // if editing existing session
    if (this.props.currentSession) {
      let updatedSession = this.props.currentSession;
      updatedSession.distance = this.distance.value;
      updatedSession.distanceUnits = this.distanceUnits.value;
      updatedSession.trainingFactors = selectedOptionsNames;
      this.props.dispatch(updateSession(updatedSession));
      this.props.editingCallback();
      return;
    }

    // if creating new session
    let targetTypeValue = this.olympic.checked ? "Olympic" : "NFAA";
    this.props.dispatch(
      createSession(
        {
          distance: this.distance.value,
          distanceUnits: this.distanceUnits.value,
          trainingFactors: selectedOptionsNames,
          targetType: targetTypeValue
        },
        this.props.history
      )
    );
  };

  componentDidMount() {
    // fetch training factors if not already fetched by other component
    if (!this.props.trainingFactors.length) {
      this.props.dispatch(fetchTrainingFactors());
    }

    // if editing existion session - populate current values
    if (this.props.currentSession) {
      this.distance.value = this.props.currentSession.distance;
      this.distanceUnits.value = this.props.currentSession.distanceUnits;
      const selectedOption = this.props.currentSession.trainingFactors.map(
        option => {
          return { id: option, name: option };
        }
      );
      this.setState({ selectedOption });
    }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  render() {
    let targetType = "";
    if (!this.props.currentSession) {
      targetType = (
        <div className="form-section">
          <p>Target Type</p>
          <div className="radio-container">
            <input
              type="radio"
              id="NFAA"
              name="targetType"
              value="NFAA"
              ref={input => (this.nfaa = input)}
              defaultChecked
            />
            <label htmlFor="NFAA">NFAA</label>
            <input
              type="radio"
              id="olympic"
              name="targetType"
              value="olympic"
              ref={input => (this.olympic = input)}
            />
            <label htmlFor="olympic">Olympic</label>
          </div>
        </div>
      );
    }

    return (
      <section>
        <form onSubmit={this.onSubmit} className="new-session-form">
          {targetType}
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
                className="custom-select"
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

          <button
            disabled={this.props.isLoading}
            type="submit"
            className="button-primary"
          >
            Submit
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => this.onCancel()}
          >
            Cancel
          </button>
        </form>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    trainingFactors: state.profileReducer.trainingFactors
  };
};

export default connect(mapStateToProps)(SimpleSessionDetailsForm);
