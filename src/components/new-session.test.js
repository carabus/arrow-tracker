import React from "react";
import { shallow } from "enzyme";

import { NewSession } from "./new-session";

describe("<NewSession/>", () => {
  it("Renders without crashing", () => {
    shallow(<NewSession isLoading="false" trainingFactors={[]} />);
  });

  it("Loads New Session Page", () => {
    const wrapper = shallow(
      <NewSession isLoading="false" trainingFactors={[]} />
    );
    expect(wrapper.find(".session").contains("New Training Session")).toEqual(
      true
    );
  });
});
