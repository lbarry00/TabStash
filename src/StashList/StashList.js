/*global chrome*/
import React, {Component} from "react";
import Stash from "./Stash";

// include lodash for collections
var _ = require("lodash");

class StashList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stashList: []
    }

    this.deleteStash = this.deleteStash.bind(this);
    this.applyStash = this.applyStash.bind(this);
  }

  componentDidMount() {
    const _this = this; // for scoping
    chrome.storage.local.get(["tabStash"], function(result) {
      _this.setState({ stashList: result.tabStash });
    });
  }

  componentDidUpdate() {
    const _this = this; // for scoping
    chrome.storage.local.get(["tabStash"], function(result) {
      _this.setState({ stashList: result.tabStash });
    });
  }

  deleteStash(index) {
    const _this = this;

    // get the current list, delete the stash, then remove the gap in the array
    let stashList = this.state.stashList;
    delete stashList[index];
    stashList = _.compact(stashList);

    // put in storage and update state
    chrome.storage.local.set({tabStash: stashList}, function() {
      _this.setState({ stashList: stashList });
    });
  }

  applyStash(index) {
    const _this = this;

    let stashList = this.state.stashList;
    const stash = stashList[index];

    stash.forEach(function(tab) {
      // create new tabs
      chrome.tabs.create({
        url: tab.url,
        index: tab.index,
        active: tab.active
      });
    })

    // delete the stash from the list after it's been applied
    _this.deleteStash(index);
  }

  render() {
    const _this = this;

    const stashList = this.state.stashList;
    //const stashList = require("../stashlist.json");

    // handle empty list
    if (stashList.length < 1) {
      return (
        <p>Stash list empty.</p>
      )
    }

    const list = stashList.map(function(stash, index) {
      return(
        <Stash stash={stash} index={index} deleteStash={_this.deleteStash} applyStash={_this.applyStash} />
      )
    });

    return(
      <div className="stash-list">
        {list}
      </div>
    )
  }
}

export default StashList;
