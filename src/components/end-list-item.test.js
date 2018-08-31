import React from "react";
import { shallow } from "enzyme";

import { EndListItem } from "./end-list-item";
import { deleteEnd } from "../actions";

describe("<EndListItem/>", () => {
  const end = { _id: 1, arrows: [] };
  const session = { id: 1, ends: [end] };
  const endNum = 1;

  it("Renders without crashing", () => {
    shallow(<EndListItem session={session} end={end} endNum={endNum} />);
  });

  //can not compare this type of actions
  xit("Dispatches deleteEnd action when clicking delete button", () => {
    const dispatch = jest.fn();
    const wrapper = shallow(
      <EndListItem
        session={session}
        end={end}
        endNum={endNum}
        dispatch={dispatch}
      />
    );
    wrapper.find(".delete").simulate("click");
    expect(dispatch).toHaveBeenCalledWith(deleteEnd(session, end));
  });
});
