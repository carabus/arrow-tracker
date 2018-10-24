import React from "react";
import { shallow } from "enzyme";

import { LoginForm } from "./login-form";
import { Redirect } from "react-router-dom";
import { login } from "../actions/auth";

describe("<LoginForm/>", () => {
  const handleSubmit = jest.fn();
  it("Renders without crashing", () => {
    shallow(<LoginForm loggedIn={false} handleSubmit={handleSubmit} />);
  });

  it("Loads Login page when user is not logged in", () => {
    const wrapper = shallow(
      <LoginForm loggedIn={false} handleSubmit={handleSubmit} />
    );
    expect(wrapper.find(".login-form")).toHaveLength(2);
  });

  it("Redirects when user is logged in", () => {
    const wrapper = shallow(
      <LoginForm loggedIn={true} handleSubmit={handleSubmit} />
    );
    expect(wrapper.find(Redirect)).toHaveLength(1);
  });

  it("should call habdleSubmit on clicking Submit button", () => {
    const wrapper = shallow(
      <LoginForm loggedIn={false} handleSubmit={handleSubmit} />
    );
    wrapper.find("button").simulate("click");
    expect(handleSubmit).toHaveBeenCalled();
  });
});
