import React from "react";
import { createSession } from "../actions";
import { updateSession } from "../actions";
import { connect } from "react-redux";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { fetchTrainingFactors } from "../actions/profile";

export class SimpleSessionDetailsForm extends React.Component {
  state = {
    selectedOption: []
  };

  onCancel = () => {
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
      this.setState({ selectedOption });
    }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  render() {
    return (
      <section>
        <form onSubmit={this.onSubmit} className="login-form">
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
