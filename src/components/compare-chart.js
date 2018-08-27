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
  fetchCompareChart,
  addCompareChart,
  removeCompareChart,
  removeCompareChartOption
} from "../actions/profile";
import ReactTooltip from "react-tooltip";
export class CompareChart extends React.Component {
  chartColors = [
    "#007bff",
    "#6610f2",
    "#6f42c1",
    "#e83e8c",
    "#dc3545",
    "#fd7e14",
    "#ffc107",
    "#28a745",
    "#20c997",
    "#17a2b8"
  ];

  handleAddOption() {
    this.props.dispatch(addCompareChart());
  }

  handleRemoveOption(optionIndex) {
    this.props.dispatch(removeCompareChartOption(optionIndex));
  }

  handleChangeOption(selectedOption, optionIndex) {
    if (selectedOption && selectedOption.length !== 0) {
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
    const optionsSelect = this.props.compareChart.map((chart, index) => (
      <div key={index} className="option-row">
        <div className="flex-full-width">
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
        </div>
        <div>
          <button
            className="delete-option"
            disabled={!index ? true : false}
            onClick={() => this.handleRemoveOption(index)}
          >
            <i className="fas fa-minus" />
          </button>
        </div>
      </div>
    ));

    const compareChart = (
      <ResponsiveContainer width="100%" height={250}>
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

    let cardContent;
    if (!this.props.compareChart.length || !this.props.trainingFactors.length) {
      cardContent = (
        <div className="card-body">
          <p className="centered-text">Not enough data to display chart</p>
        </div>
      );
    } else {
      cardContent = (
        <div className="row">
          <div className="column-40 card-column-no-body">
            <p className="big-text">
              Add Chart{" "}
              <button
                className="add-option"
                onClick={() => this.handleAddOption()}
              >
                <i className="fas fa-plus" />
              </button>
            </p>
            <form>{optionsSelect}</form>
          </div>
          <div className="column-60 card-column-no-body">{compareChart}</div>
        </div>
      );
    }

    return (
      <div>
        <section className="card">
          <div className="card-header">
            <div className="flex-header">
              <div width="20px" />
              <h2>Compare Training Factors</h2>
              <div>
                <button
                  data-tip
                  data-for="compare"
                  data-event="click"
                  className="tooltip"
                >
                  <i className="fas fa-question" />
                </button>
                <ReactTooltip id="compare" globalEventOff="click">
                  <div>
                    Compare scores for sessions with different training factors.
                  </div>
                  <div>
                    Sessions with no training factors are selected by default.
                  </div>
                </ReactTooltip>
              </div>
            </div>
          </div>
          {cardContent}
        </section>
      </div>
    );
  }
}

export default connect()(CompareChart);
