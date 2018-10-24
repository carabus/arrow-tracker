import React from "react";
import { shallow } from "enzyme";

import Input from "./input";

describe("<Input/>", () => {
  const label = "Name";
  const input = { name: "name" };
  const type = "text";
  const meta = { touched: false, error: "", warning: "" };

  it("Renders without crashing", () => {
    shallow(<Input label={label} input={input} type={type} meta={meta} />);
  });

  it("Renders input label as expected", () => {
    const wrapper = shallow(
      <Input label={label} input={input} meta={meta} type={type} />
    );
    expect(
      wrapper.find(`label[htmlFor="${input.name}"]`).contains(label)
    ).toEqual(true);
  });

  it("Renders input as expected", () => {
    const wrapper = shallow(
      <Input label={label} input={input} meta={meta} type={type} />
    );
    expect(
      wrapper.find(`input[id="${input.name}"][type="${type}"]`).length
    ).toBe(1);
  });

  it("Renders error messages in label id present", () => {
    const meta = { touched: true, error: "There was an error", warning: "" };
    const wrapper = shallow(
      <Input label={label} input={input} meta={meta} type={type} />
    );
    expect(
      wrapper.find(`label[htmlFor="${input.name}"]`).contains(meta.error)
    ).toEqual(true);
  });
});
