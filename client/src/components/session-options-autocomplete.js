import React from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";

export default class SessionOptionsAutocomplete extends React.Component {
  state = {
    selectedOption: ""
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    // selectedOption can be null when the `x` (close) button is clicked
    if (selectedOption) {
      console.log(`Selected:`, selectedOption);
    }
  };
  render() {
    const { selectedOption } = this.state;

    return (
      <Select.Creatable
        name="form-field-name"
        value={selectedOption}
        multi={true}
        onChange={this.handleChange}
        valueKey="id"
        labelKey="name"
        options={this.props.options}
      />
    );
  }
}
