import React from "react";
import Popup from "../popup/Popup";
import { mount, shallow, render } from "enzyme";

describe("Popup" , () => {
  it("renders without crashing", () => {
    const component = shallow(<Popup />);
    expect(component).toMatchSnapshot();
  });

  it("renders the popup title", () => {
    const component = mount(<Popup />);
    expect(component.find("#title").length).toEqual(1);
    component.unmount();
  });
});
