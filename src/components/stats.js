import React from "react";
import { connect } from "react-redux";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import Select from "react-select";
import "react-select/dist/react-select.css";

export class Stats extends React.Component {
  state = {
    selectedOption: { id: 4, name: "barebow" }
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    // selectedOption can be null when the `x` (close) button is clicked
    if (selectedOption) {
      console.log(`Selected:`, selectedOption);
    }
  };

  render() {
    const progressChart = (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={this.props.profile.progressChart}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="session" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );

    const colors = ["#8884d8", "#049ea3", "a37e04"];

    const compareChart = (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={this.props.profile.compareChart}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="session"
            type="category"
            allowDuplicatedCategory={false}
          />

          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {this.props.profile.compareChart.map((s, i) => (
            <Line
              dataKey="score"
              data={s.data}
              name={s.name}
              key={s.name}
              stroke={colors[i]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
    return (
      <section>
        <h2>My Stats</h2>
        <p>My rank is {this.props.profile.rank}/100</p>
        <p>
          <a className="help" href="#" target="_self">
            How it's calculated?
          </a>
        </p>
        <section>
          <h3>Progress Chart</h3>
          {progressChart}
        </section>
        <section>
          <h3>Compare Chart</h3>
          <p>Choose session options</p>
          <form>
            <Select
              name="form-field-name"
              value={this.state.selectedOption}
              multi={true}
              onChange={this.handleChange}
              valueKey="id"
              labelKey="name"
              options={this.props.profile.additionalOptions}
            />
          </form>
          {compareChart}
        </section>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.profileReducer.profile
  };
};
export default connect(mapStateToProps)(Stats);
