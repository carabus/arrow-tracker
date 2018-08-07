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
import {
  fetchProgressChart,
  fetchUserRank,
  fetchCompareChart,
  addCompareChart,
  removeCompareChart,
  removeCompareChartOption
} from "../actions/profile";

export class Stats extends React.Component {
  chartColors = [
    "#00ffff",
    "#000000",
    "#0000ff",
    "#a52a2a",
    "#00ffff",
    "#00008b",
    "#008b8b",
    "#a9a9a9",
    "#006400",
    "#bdb76b",
    "#8b008b",
    "#556b2f",
    "#ff8c00",
    "#9932cc",
    "#8b0000",
    "#e9967a",
    "#9400d3",
    "#ff00ff",
    "#ffd700",
    "#008000",
    "#4b0082",
    "#f0e68c",
    "#00ff00",
    "#ff00ff",
    "#800000",
    "#000080",
    "#808000",
    "#ffa500",
    "#800080",
    "#800080",
    "#ff0000"
  ];

  componentDidMount() {
    this.props.dispatch(fetchProgressChart());
    this.props.dispatch(fetchUserRank());
    this.props.dispatch(fetchCompareChart(0, []));
  }

  handleAddOption() {
    this.props.dispatch(addCompareChart());
  }

  handleRemoveOption(optionIndex) {
    this.props.dispatch(removeCompareChartOption(optionIndex));
  }

  handleChangeOption(selectedOption, optionIndex) {
    if (selectedOption && selectedOption.length != 0) {
      this.props.dispatch(
        fetchCompareChart(
          optionIndex,
          Object.values(selectedOption).map(option => option.name)
        )
      );
    }

    if (selectedOption && selectedOption.length === 0) {
      this.props.dispatch(removeCompareChart(optionIndex));
    }
  }

  render() {
    const progressChart = (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={this.props.progressChart}
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

    const optionsSelect = this.props.compareChart.map((chart, index) => (
      <div key={index}>
        <Select
          name="form-field-name"
          value={
            !index
              ? [{ id: "normal training", name: "normal training" }]
              : chart.selectedFactors
          }
          multi={true}
          onChange={selectedOption =>
            this.handleChangeOption(selectedOption, index)
          }
          valueKey="id"
          labelKey="name"
          options={this.props.trainingFactors}
          disabled={!index ? true : false}
        />
        <button
          disabled={!index ? true : false}
          onClick={() => this.handleRemoveOption(index)}
        >
          -
        </button>
      </div>
    ));

    const compareChart = (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={this.props.compareChart.map(chart => chart.chart)}
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
          {this.props.compareChart
            .filter(chart => chart.chart !== null)
            .map((s, i) => (
              <Line
                type="monotone"
                dataKey="score"
                data={s.chart.data}
                name={s.chart.name}
                key={s.chart.name}
                stroke={this.chartColors[i]}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    );

    return (
      <section>
        <h2>My Stats</h2>
        <p>My rank is {this.props.rank}/100</p>
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
          <p>
            Choose session options{" "}
            <button onClick={() => this.handleAddOption()}>+</button>
          </p>
          <form>{optionsSelect}</form>
          {compareChart}
        </section>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    trainingFactors: state.profileReducer.trainingFactors,
    rank: state.profileReducer.rank,
    progressChart: state.profileReducer.progressChart,
    compareChart: state.profileReducer.compareChart
  };
};
export default connect(mapStateToProps)(Stats);
