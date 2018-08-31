import React from "react";
import { shallow } from "enzyme";

import { RegistrationPage } from "./registration-page";
import { Redirect } from "react-router-dom";

describe("<RegistrationPage/>", () => {
  const handleSubmit = jest.fn();
  it("Renders without crashing", () => {
    shallow(<RegistrationPage loggedIn={false} />);
  });

  it("Loads Registration page when user is not logged in", () => {
    const wrapper = shallow(<RegistrationPage loggedIn={false} />);

    expect(
      wrapper.contains(
        <h2>
          <i className="fas fa-pen" /> Sign Up
        </h2>
      )
    ).toEqual(true);
  });

  it("Redirects when user is logged in", () => {
    const wrapper = shallow(<RegistrationPage loggedIn={true} />);
    expect(wrapper.find(Redirect)).toHaveLength(1);
  });
});
