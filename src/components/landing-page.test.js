import React from "react";
import { shallow } from "enzyme";

import { LandingPage } from "./landing-page";
import { Redirect } from "react-router-dom";

describe("<LandingPage/>", () => {
  it("Renders without crashing", () => {
    shallow(<LandingPage loggedIn={false} />);
  });

  it("Loads Landing page when user is not logged in", () => {
    const wrapper = shallow(<LandingPage loggedIn={false} />);
    expect(wrapper.find(".landing-page").contains("Archery Tracker")).toEqual(
      true
    );
  });

  it("Redirects when user is logged in", () => {
    const wrapper = shallow(<LandingPage loggedIn={true} />);
    expect(wrapper.find(Redirect)).toHaveLength(1);
  });
});
