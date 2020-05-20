/*global chrome*/
import React, {Component} from 'react';

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

    // query all tabs
    chrome.tabs.query({}, function(results) {
      let tabUrls = []; // list of all open tabs
      let alertString; // error/confirmation request

      // get all open tabs' urls and indices
      results.forEach(function(tab) {
        // save url, index, and active status of each tab
        tabUrls.push({
          url: tab.url,
          index: tab.index,
          active: tab.active
        });
      });

      // store in chrome storage as json string
      chrome.storage.local.set({tabStash: tabUrls}, function() {
        // set error text if error occurred
        if (chrome.runtime.lastError) {
          alertString = "An error occurred, tabs failed to be stashed."
          _this.setState({ alertText: alertString, alertIsError: true });
        } else { // set confirmation text if success
          alertString = tabUrls.length + " tabs stashed.";
          _this.setState({ alertText: alertString, alertIsError: false });
        }
      });
    });
  }

  handleApply() {
    const _this = this;

    // retrieve stashed tabs from storage
    chrome.storage.local.get(["tabStash"], function(result) {
      let alertString;

      // set alert message/status if error
      if (chrome.runtime.lastError) {
        alertString = "An error occurred, stash could not be applied.";
        _this.setState({ alertText: alertString, alertIsError: true });
        return;
      }

      // handle empty stash
      if (Object.keys(result).length === 0) {
        // display empty stash message
        const alertString = "Cannot apply, stash is empty.";
        _this.setState({ alertText: alertString, alertIsError: true });
        return;
      }

      // get list of tabs
      const stashTabs = result.tabStash;
      stashTabs.forEach(function(tab) {
        // create new tab w/ index and active status
        chrome.tabs.create({
          url: tab.url,
          index: tab.index,
          active: tab.active
        });
      });
    })
  }

  handleClear() {
    const _this = this;

    // remove stash from storage
    chrome.storage.local.remove("tabStash", function() {
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
    const advancedMenu = this.state.showAdvanced ?
      <div className="advanced-menu">
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
