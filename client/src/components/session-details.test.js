import React from "react";
import { shallow } from "enzyme";

import { SessionDetails } from "./session-details";
import SimpleSessionDetailsForm from "./simple-session-details-form";
import { deleteSession } from "../actions";

describe("<SessionDetails/>", () => {
  const session = {
    distance: 20,
    distanceUnits: "yards",
    score: 100,
    maxScore: 200,
    trainingFactors: ["test"]
  };

  it("Renders without crashing", () => {
    shallow(<SessionDetails session={session} />);
  });

  it("Renders in display mode by default", () => {
    const wrapper = shallow(<SessionDetails session={session} />);

    expect(wrapper.find(SimpleSessionDetailsForm)).toHaveLength(0);
  });

  it("Renders session details", () => {
    const wrapper = shallow(<SessionDetails session={session} />);
    expect(wrapper.contains(`${session.distance} ${session.distanceUnits}`));
    expect(wrapper.contains(<li>{session.trainingFactors[0]}</li>));
    expect(wrapper.contains(` ${session.score} / ${session.maxScore} (50%)`));
  });

  it("Renders form when Edit button is clicked", () => {
    const wrapper = shallow(<SessionDetails session={session} />);
    wrapper.find(".edit").simulate("click");
    expect(wrapper.find(SimpleSessionDetailsForm)).toHaveLength(1);
  });

  xit("Dispatches deleteSession when Delete is clicked", () => {
    const dispatch = jest.fn();
    const history = {};
    const wrapper = shallow(
      <SessionDetails session={session} dispatch={dispatch} history={history} />
    );
    wrapper.find(".delete").simulate("click");
    expect(dispatch).toHaveBeenCalledWith(deleteSession(session, history));
  });
});
