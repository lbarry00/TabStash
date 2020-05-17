import React from "react";
import Popup from "../popup/Popup";
import { mount, shallow, render } from "enzyme";

describe("Rendering" , () => {
  it("renders without crashing", () => {
    const component = shallow(<Popup />);
    expect(component).toMatchSnapshot();
  });

  it("renders the popup title", () => {
    const component = shallow(<Popup />);
    expect(component.find("#title").exists()).toBe(true);
    component.unmount();
  });

  it("renders the stash button correctly", () => {
    const component = shallow(<Popup />);
    expect(component.find("#stash-button").text()).toEqual("Stash");
  });

  it("renders the apply button correctly", () => {
    const component = shallow(<Popup />);
    expect(component.find("#apply-button").text()).toEqual("Apply");
  })

  it("renders the clear button correctly", () => {
    const component = shallow(<Popup />);
    expect(component.find("#clear-button").text()).toEqual("Clear");
  })
});

describe("Alert Text", () => {
  it("renders empty alert text", () => {
    const component = shallow(<Popup />);
    expect(component.find(".alert-text").exists()).toBe(true);
  })
})
