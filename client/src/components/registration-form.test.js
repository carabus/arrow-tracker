import React from "react";
import { shallow } from "enzyme";
import { Redirect } from "react-router-dom";
import { RegistrationForm } from "./registration-form";

describe("<RegistrationForm/>", () => {
  const handleSubmit = jest.fn();
  const dispatch = jest.fn();
  it("Renders without crashing", () => {
    shallow(
      <RegistrationForm
        loggedIn={false}
        handleSubmit={handleSubmit}
        dispatch={dispatch}
      />
    );
  });

  it("Redirects when user is logged in", () => {
    const wrapper = shallow(
      <RegistrationForm loggedIn={true} dispatch={dispatch} />
    );
    expect(wrapper.find(Redirect)).toHaveLength(1);
  });

  it("should call habdleSubmit on clicking Submit button", () => {
    const wrapper = shallow(
      <RegistrationForm
        loggedIn={false}
        handleSubmit={handleSubmit}
        dispatch={dispatch}
      />
    );
    wrapper.find("button").simulate("click");
    expect(handleSubmit).toHaveBeenCalled();
  });
});
