import React from "react";
import { mount } from "enzyme";

import Target from "./target";

describe("<Target/>", () => {
  const arrows = [{ coordinates: { x: 1, y: 1 }, score: 8}];
  const createArrow = jest.fn();

  it("Renders without crashing", () => {
    mount(<Target arrows={arrows} createArrow={createArrow} />);
  });
});
