import React from "react";
import { shallow } from "enzyme";

import SessionOptionAutocomplete from "./session-options-autocomplete";

describe("<SessionOptionAutocomplete/>", () => {
  const options = [{ id: "barebow", name: "barebow" }];

  it("Renders without crashing", () => {
    shallow(<SessionOptionAutocomplete options={options} />);
  });
});
