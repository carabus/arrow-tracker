import React from "react";
import { shallow } from "enzyme";

import { Dashboard } from "./dashboard";

describe("<Dashboard/>", () => {
  const sessions = [];
  const trainingFactors = [];
  const progressChart = [];
  const compareChart = [];
  const rank = 0;
  const dispatch = jest.fn();

  it("Renders without crashing", () => {
    shallow(
      <Dashboard
        sessions={sessions}
        trainingFactors={trainingFactors}
        progressChart={progressChart}
        compareChart={compareChart}
        rank={rank}
        dispatch={dispatch}
      />
    );
  });
});
