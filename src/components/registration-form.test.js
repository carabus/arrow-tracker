import React from "react";
import { shallow } from "enzyme";

import { RegistrationForm } from "./registration-form";

describe("<RegistrationForm/>", () => {
  const handleSubmit = jest.fn();
  it("Renders without crashing", () => {
    shallow(<RegistrationForm loggedIn={false} handleSubmit={handleSubmit} />);
  });

  it("should call habdleSubmit on clicking Submit button", () => {
    const wrapper = shallow(
      <RegistrationForm loggedIn={false} handleSubmit={handleSubmit} />
    );
    wrapper.find("button").simulate("click");
    expect(handleSubmit).toHaveBeenCalled();
  });
});
