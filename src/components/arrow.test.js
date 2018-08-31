import React from "react";
import { shallow } from "enzyme";

import Arrow from "./arrow";

describe("<Arrow/>", () => {
  const colors = {
    0: "miss",
    1: "white",
    2: "white",
    3: "black",
    4: "black",
    5: "blue",
    6: "blue",
    7: "red",
    8: "red",
    9: "yellow",
    10: "yellow"
  };
  let arrow = {
    coordinates: { x: 1, y: 1 },
    score: 9,
    isInverted: true
  };

  it("Renders without crashing", () => {
    shallow(<Arrow arrow={arrow} key={1} />);
  });

  it("Renders with correct style depending on the score", () => {
    for (let i = 0; i <= 10; i++) {
      arrow.score = i;
      const wrapper = shallow(<Arrow arrow={arrow} key={1} />);
      expect(wrapper.hasClass(colors[i])).toEqual(true);
    }
  });
});
