/*global chrome*/
import React, {Component} from 'react';

import StashList from "../StashList/StashList";

// include lodash for collections
var _ = require("lodash");

class Popup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // alert string, and whether it should have the "error" class
      alertText: "",
      alertIsError: false,

      // toggle advanced menu
      showAdvanced: false
    }
    this.toggleAdvanced = this.toggleAdvanced.bind(this);
    this.handleStash = this.handleStash.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  toggleAdvanced() {
    this.setState({showAdvanced: !this.state.showAdvanced});
  }

  handleStash() {
    const _this = this; // for scoping inside callbacks

    // query all open tabs
    chrome.tabs.query({}, function(results) {
      let newStash = []; // list of all open tabs
      let alertString; // error/confirmation message

      // get all open tabs' urls and indices
      results.forEach(function(tab) {
        // save url, index, and active status of each tab
        // also store favicon for use in stash list
        newStash.push({
          url: tab.url,
          index: tab.index,
          active: tab.active,
          favIconUrl: tab.favIconUrl || ""
        });
      });

      // get the current stash list
      chrome.storage.local.get(["tabStash"], function(result) {
        let stashList = result.tabStash;

        // if there's an existing list of stashes, need to initialize the array
        if(typeof stashList == "undefined") {
          stashList = [];
        }
        stashList.push(newStash);

        // store the updated array in browser storage
        chrome.storage.local.set({tabStash: stashList}, function() {
          // set error text if error occurred
          if (chrome.runtime.lastError) {
            alertString = "An error occurred, tabs failed to be stashed."
            _this.setState({ alertText: alertString, alertIsError: true });
          } else { // set confirmation text if success, update state w/ new list
            alertString = newStash.length + " tabs stashed.";
            _this.setState({ stashList: stashList, alertText: alertString, alertIsError: false });
          }
        });
      });
    });
  }

  handleApply() {
    const _this = this; // for scoping inside callbacks

    // retrieve stashed tabs from storage
    chrome.storage.local.get(["tabStash"], function(result) {
      let alertString;

      // set alert message/status if error
      if (chrome.runtime.lastError) {
        alertString = "An error occurred, stash could not be applied.";
        _this.setState({ alertText: alertString, alertIsError: true });
        return;
      }

      let stashList = result.tabStash;

      // handle empty stash list
      if (stashList.length === 0) {
        // display empty stash message
        const alertString = "Cannot apply, stash is empty.";
        _this.setState({ alertText: alertString, alertIsError: true });
        return;
      }

      // get list of tabs
      _.last(stashList).forEach(function(tab) {
        // create new tab w/ index and active status
        chrome.tabs.create({
          url: tab.url,
          index: tab.index,
          active: tab.active
        });
      });

      // remove applied stash from the stash list
      stashList = _.dropRight(stashList);
      chrome.storage.local.set({tabStash: stashList}, function() {
        _this.setState({ alertText: "Stash applied.", alertIsError: false });
      });
    });
  }

  handleClear() {
    const _this = this; // for scoping inside callbacks

    let stashList = [];

    // remove stash from storage
    chrome.storage.local.set({tabStash: stashList}, function() {
      let alertString;

      // handle error if it occurs
      if (chrome.runtime.lastError) {
        alertString = "An error occurred, stash could not be cleared.";
        _this.setState({ alertText: alertString, alertIsError: true });
        return;
      }

      // update alert text to confirm stash clear
      _this.setState({ alertText: "Stash cleared.", alertIsError: false });
    });
  }

  render() {
    const _this = this;

    // create alert element with alert text, error class(?)
    let alertMessage;
   if(_this.state.alertIsError) {
      alertMessage = <p className="alert-text error">{this.state.alertText}</p>
    } else {
      alertMessage = <p className="alert-text">{this.state.alertText}</p>
    }

    // open/close menu button
    const menuIcon = this.state.showAdvanced ? "\u2715 Close" : "\u2630 Menu";

    // show menu elements if toggled on
    const advancedMenu = _this.state.showAdvanced ?
      <div className="advanced-menu">
        <p>Stash List (click to apply)</p>
        <StashList />
        <button id="clear-button" title="Clear stashed tabs" onClick={this.handleClear}>Clear Stash</button>
      </div> : null;

    return (
      <div className="popup">
        <h1 id="title">TabStash</h1>
        <img src="./img/icon128.png" alt="TabStash icon" ></img>
        {alertMessage}
        <div className="main-buttons-container">
          <button id="stash-button" title="Stash current tabs" onClick={this.handleStash}>Stash</button>
          <button id="apply-button" title="Apply stashed tabs" onClick={this.handleApply}>Apply</button>
        </div>
        <div id="adv-menu-button" onClick={this.toggleAdvanced}>{menuIcon}</div>
        {advancedMenu}
      </div>
    );
  }
}

export default Popup;
