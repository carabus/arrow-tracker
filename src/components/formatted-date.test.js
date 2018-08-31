import React from "react";
import { shallow } from "enzyme";

import FormattedDate from "./formatted-date";

describe("<FormattedDate/>", () => {
  const date = new Date("August 19, 2017 23:15:30");
  const expectedDate = "August 19, 2017 11:15 PM";

  it("Renders without crashing", () => {
    shallow(<FormattedDate date={date} />);
  });

  it("Renders date in exected format", () => {
    const wrapper = shallow(<FormattedDate date={date} />);
    expect(wrapper.contains(expectedDate)).toEqual(true);
  });
});
