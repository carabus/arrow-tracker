import React from "react";
import { Field, reduxForm } from "redux-form";
import CheckboxGroup from "./checkbox-group";

const SessionDetailsForm = props => {
  console.log(props);
  const { onSubmit, handleSubmit, pristine, reset, submitting } = props;

  const options = props.profile.additionalOptions.map(option => ({
    label: option.name,
    value: option.name
  }));

  return (
    <form onSubmit={handleSubmit(values => onSubmit(values))}>
      <div>
        <label>Distance</label>
        <div>
          <Field name="distance" component="select" value="none">
            <option value="18">18 meters</option>
            <option value="25">25 meters</option>
            <option value="none">--Please choose an option--</option>
          </Field>
        </div>
      </div>
      <div>
        <label htmlFor="additionalOptions">Additional Options</label>
        <CheckboxGroup name="additionalOptions" options={options} />
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>
          Submit
        </button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Clear Values
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: "simple" // a unique identifier for this form
})(SessionDetailsForm);
