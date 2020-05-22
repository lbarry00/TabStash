# TabStash
 `git stash`, but for Chrome tabs.

## About
TabStash is a lightweight Chrome extension that allows users to temporarily save their currently-opened browser tabs, to be re-opened later. 

### Features
- Save all currently open tabs in a "stash"
    - Saves the tab URL, position in browser bar, and whether the tab is focused
- Restore the most recently stashed tabs
- Stash multiple sets of tabs
- Restore a specific stash
- Delete a stash
- Clear all stashes

### Why use TabStash?

Although this functionality already exists in the "continue where you left off" feature of Chrome or with the Ctrl+Shift+T shortcut, many users want to easily restore their tabs without permanently enabling this setting.

### Development/Build Scripts
- `npm start`
  UI debugging
- `npm test`
	- Run tests
- `npm run build`
	- Build unpacked extension
	- Load in chrome://extensions with "Developer mode" enabled, point to `/build` folder
