import React from 'react';

function Popup() {
  return (
    <div className="Popup">
      <h1>TabStash</h1>
      <button id="stash-button" title="Stash current tabs">Stash</button>
      <button id="apply-button" title="Apply most recent stash">Apply</button>
    </div>
  );
}

export default Popup;
