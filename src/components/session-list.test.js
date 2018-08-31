import React from "react";
import { shallow } from "enzyme";

import { SessionList } from "./session-list";

describe("<SessionList/>", () => {
  const sessionListShort = [{ id: 1 }];
  const sessionListLong = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 }
  ];
  it("Renders without crashing", () => {
    shallow(<SessionList sessions={sessionListLong} />);
  });

  it("Renders Show More link when > 3 sessions ", () => {
    const wrapper = shallow(<SessionList sessions={sessionListLong} />);
    expect(wrapper.contains("Show More")).toEqual(true);
  });

  it("Does not render Show More link when < 3 sessions ", () => {
    const wrapper = shallow(<SessionList sessions={sessionListShort} />);
    expect(wrapper.contains("Show More")).toEqual(false);
  });

  it("Shows 3 sessions initially", () => {
    const wrapper = shallow(<SessionList sessions={sessionListLong} />);
    expect(wrapper.find("li").length).toBe(3);
  });

  it("Shows all sessions when Show More was clicked", () => {
    const wrapper = shallow(<SessionList sessions={sessionListLong} />);
    wrapper.find("a").simulate("click");
    expect(wrapper.find("li").length).toBe(10);
  });

  it("Shows No sessions message if there are no sessions", () => {
    const wrapper = shallow(<SessionList sessions={[]} />);
    expect(wrapper.contains("No recent training sessions")).toEqual(true);
  });
});
