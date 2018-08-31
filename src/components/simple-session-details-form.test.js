import React from "react";
import { mount } from "enzyme";

import { SimpleSessionDetailsForm } from "./simple-session-details-form";

describe("<SimpleSessionDetailsForm/>", () => {
  const session = {
    distance: 20,
    distanceUnits: "yards",
    score: 100,
    maxScore: 200,
    trainingFactors: ["test"],
    ends: []
  };

  const callback = jest.fn();
  const dispatch = jest.fn();

  it("Renders without crashing", () => {
    mount(
      <SimpleSessionDetailsForm
        currentSession={session}
        editingCallback={callback}
        trainingFactors={["barebow"]}
        dispatch={dispatch}
      />
    );
  });
});
