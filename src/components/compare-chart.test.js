import React from "react";
import { shallow } from "enzyme";
import { LineChart } from "recharts";
import { addCompareChart, removeCompareChartOption } from "../actions/profile";

import { CompareChart } from "./compare-chart";

describe("<CompareChart/>", () => {
  const compareChart = [
    {
      selectedFactors: [],
      chart: { name: "normal training", data: [{ session: 1, score: 68 }] }
    },
    {
      selectedFactors: [
        { id: "barebow", name: "barebow" },
        { id: "outside", name: "outside" }
      ],
      chart: {
        name: "outside & barebow",
        data: [{ session: 1, score: 68 }]
      }
    }
  ];
  const trainingFactors = ["barebow", "outside"];
  const dispatch = jest.fn();

  it("Renders without crashing", () => {
    shallow(
      <CompareChart
        trainingFactors={trainingFactors}
        compareChart={compareChart}
        dispatch={dispatch}
      />
    );
  });

  it("Renders no data message when no training factors data", () => {
    const wrapper = shallow(
      <CompareChart
        trainingFactors={[]}
        compareChart={compareChart}
        dispatch={dispatch}
      />
    );
    expect(wrapper.contains("Not enough data to display chart")).toEqual(true);
    expect(wrapper.find(LineChart)).toHaveLength(0);
  });

  it("Renders no data message when no chart data", () => {
    const wrapper = shallow(
      <CompareChart
        trainingFactors={trainingFactors}
        compareChart={[]}
        dispatch={dispatch}
      />
    );
    expect(wrapper.contains("Not enough data to display chart")).toEqual(true);
    expect(wrapper.find(LineChart)).toHaveLength(0);
  });

  it("Renders chart when data is present", () => {
    const wrapper = shallow(
      <CompareChart
        trainingFactors={trainingFactors}
        compareChart={compareChart}
        dispatch={dispatch}
      />
    );
    expect(wrapper.contains("Not enough data to display chart")).toEqual(false);
    expect(wrapper.find(LineChart)).toHaveLength(1);
  });

  it("Dispatches add compare chart when add is clicked", () => {
    const wrapper = shallow(
      <CompareChart
        trainingFactors={trainingFactors}
        compareChart={compareChart}
        dispatch={dispatch}
      />
    );
    wrapper.find(".add-option").simulate("click");
    expect(dispatch).toHaveBeenCalledWith(addCompareChart());
  });

  it("Dispatches remove option when delete is clicked next to option", () => {
    const wrapper = shallow(
      <CompareChart
        trainingFactors={trainingFactors}
        compareChart={compareChart}
        dispatch={dispatch}
      />
    );

    wrapper
      .find(".delete-option")
      .at(1)
      .simulate("click");
    expect(dispatch).toHaveBeenCalledWith(removeCompareChartOption(1));
  });
});
