import React from "react";
import { shallow } from "enzyme";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { App } from "./app";

describe("<App/>", () => {
  it("Renders without crashing", () => {
    shallow(<App />);
  });

  it("Renders routes", () => {
    const wrapper = shallow(<App loggedIn hasAuthToken />);
    expect(wrapper.find(Route).length).toBe(7);
    expect(wrapper.find(Redirect).length).toBe(1);
  });

  it("Shows error message when there was an error", () => {
    const wrapperErrorSessions = shallow(<App errorSessions={true} />);
    expect(
      wrapperErrorSessions.contains(<div>There was an error</div>)
    ).toEqual(true);

    const wrapperErrorCharts = shallow(<App errorCharts={true} />);
    expect(wrapperErrorCharts.contains(<div>There was an error</div>)).toEqual(
      true
    );
  });
});
