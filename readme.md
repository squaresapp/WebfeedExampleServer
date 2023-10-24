# HTML Feed Example Server

This repository contains a Node.JS server that can be used for HTML Feed reader apps to test out the process of subscribing to new HTML Feeds, and polling them for updates.

## Setup Instructions

1. Clone this repository
2. Run an `npm install`.
3. Make sure TypeScript is installed, then run `tsc`.
4. Run `node ./+server.js` to launch the server

The server that is launched serves a home page with buttons to add new posts to the feed, and to clear the entire feed of all created posts.
