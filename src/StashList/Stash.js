import React, {Component} from "react";

class Stash extends Component {
  constructor(props) {
    super(props);

    this.handleDeleteStash = this.handleDeleteStash.bind(this);
    this.handleApplyStash = this.handleApplyStash.bind(this);
  }

  handleDeleteStash() {
    const index = this.props.index;
    this.props.deleteStash(index);
  }

  handleApplyStash() {
    const index = this.props.index;
    this.props.applyStash(index);
  }

  render() {
    const stash = this.props.stash;

    let extraElements = 0; // # of tabs past 5

    const tabImgs = stash.map(function(tab, index) {
      // only render icons for the first 5 tabs, then just show the count above 5
      if (index >= 5) {
        extraElements++;
        return true;
      }

      // use a default icon if a tab lacks a favicon
      if (tab.favIconUrl.length > 0) {
        return (<img src={tab.favIconUrl} alt={tab.url + " favicon"} title={tab.url} className="tab-icon"></img>);
      } else {
        return(<img src="./img/bluecircle.png" alt="Default favicon" title={tab.url} className="tab-icon"></img>);
      }
    });

    // display count of tabs past 5
    let numMore = null;
    if (extraElements > 0) {
      numMore = <p>{extraElements} more...</p>
    }

    return (
      <div className="stash">
        <div className="stash-icons-list" onClick={this.handleApplyStash}>
          {tabImgs}
          {numMore}
        </div>
        <button className="delete-stash" onClick={this.handleDeleteStash}>X</button>
      </div>
    );
  }
}

export default Stash;
