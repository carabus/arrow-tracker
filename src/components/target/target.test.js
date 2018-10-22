import React from "react";
import { mount } from "enzyme";

import TargetCanvas from "./target";

describe("<TragetCanvas/>", () => {
  const arrows = [{ coordinates: { x: 1, y: 1 }, score: 8, isInverted: false }];
  const createArrow = jest.fn();

  it("Renders without crashing", () => {
    mount(<TargetCanvas arrows={arrows} createArrow={createArrow} />);
  });
});
