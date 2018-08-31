import React from "react";
import { shallow, mount } from "enzyme";

import { Session } from "./session";

import { createEnd, fetchSessions } from "../actions";

describe("<Session/>", () => {
  const session = {
    distance: 20,
    distanceUnits: "yards",
    score: 100,
    maxScore: 200,
    trainingFactors: ["test"],
    ends: []
  };

  const dispatch = jest.fn();

  it("Renders without crashing", () => {
    shallow(<Session session={session} />);
  });

  it("Shows loading message when data still loading ", () => {
    const wrapper = shallow(
      <Session session={null} isLoading={true} dispatch={dispatch} />
    );
    expect(wrapper.contains("Loading...")).toEqual(true);
  });

  it("Shows not found message when there is no such session", () => {
    const wrapper = shallow(
      <Session session={null} isLoading={false} dispatch={dispatch} />
    );
    expect(wrapper.contains("No Such Session")).toEqual(true);
  });

  it("Shows Session page", () => {
    const wrapper = shallow(
      <Session session={session} isLoading={false} dispatch={dispatch} />
    );
    expect(wrapper.contains(<h1>Training Session</h1>)).toEqual(true);
  });

  xit("Dispatches fetch session on load ", () => {
    const wrapper = mount(
      <Session session={null} isLoading={false} dispatch={dispatch} />
    );
    expect(dispatch).toHaveBeenCalledWith(fetchSessions());
  });
});
