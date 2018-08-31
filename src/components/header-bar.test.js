import React from "react";
import { shallow } from "enzyme";

import { HeaderBar } from "./header-bar";
import { clearAuth } from "../actions/auth";
import { reset } from "../actions/index";

describe("<HeaderBar/>", () => {
  it("Renders without crashing", () => {
    shallow(<HeaderBar loggedIn={true} />);
  });

  it("Displays logout link when logged in", () => {
    const wrapper = shallow(<HeaderBar loggedIn={true} />);
    expect(wrapper.contains("Log out")).toEqual(true);
  });

  it("Displays logout link when logged in", () => {
    const wrapper = shallow(<HeaderBar loggedIn={false} />);
    expect(wrapper.contains("Login")).toEqual(true);
  });

  it("Displays session breadcrumb trail when sessionId is passed", () => {
    const wrapper = shallow(<HeaderBar loggedIn={true} sessionId={1} />);
    expect(wrapper.find(".breadcrumb").contains("Session")).toEqual(true);
    expect(wrapper.find(".breadcrumb").contains("End")).toEqual(false);
  });

  it("Displays session and end breadcrumb trail when sessionId and endId are passed", () => {
    const wrapper = shallow(
      <HeaderBar loggedIn={true} sessionId={1} endId={1} />
    );
    expect(wrapper.find(".breadcrumb").contains("Session")).toEqual(true);
    expect(wrapper.find(".breadcrumb").contains("End")).toEqual(true);
  });

  it("Dispatches clearAuth and reset when Logout is clicked", () => {
    const dispatch = jest.fn();
    const wrapper = shallow(
      <HeaderBar loggedIn={true} sessionId={1} endId={1} dispatch={dispatch} />
    );

    wrapper.find(".logout").simulate("click");
    expect(dispatch).toHaveBeenCalledWith(clearAuth());
    expect(dispatch).toHaveBeenCalledWith(reset());
  });
});
