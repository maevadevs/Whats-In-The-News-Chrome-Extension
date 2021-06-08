/* content.js */

// A content script is “a JavaScript file that runs in the context of web pages.” 
// This means that a content script can interact with web pages that the browser visits.
// However, not every JavaScript file in a Chrome extension can do this.

// The general idea is:
// 1 - Listen for a click on the browser action in background.js. 
//     When it’s clicked, send a clicked_browser_action event to content.js.
// 2 - When content.js receives the event, it grabs the URL of the first link on the page. 
//     Then it sends open_new_tab back to background.js with the URL to open.
// 3 - background.js listens for open_new_tab 
//     and opens a new tab with the given URL when it receives the message.

/**
 * 2 - Event listener for messages sent by background.js
 * This function is called whenever background.js sends a message
 * Here, we react to the message sent by background.js and makes something happen
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // The request message from content.js could be anything: Switch through it
  switch (request.message) {
    case "clicked_browser_action":
      // Grab the current URL
      currentUrl = getCurrentUrl();
      // We will just use a basic confirm if the user wants to continue
      doSearch = window.confirm("You will now be redirected to What's In The News Webapp")
      // If user confirm, open Google Search in a new tab
      if (doSearch) {
        // Grab the URL and pass it to background.js
        // Only background.js can open a new tab: We have to pass the url to background.js
        chrome.runtime.sendMessage({
          "message": "redirecting_in_new_tab", 
          "url": currentUrl
        });
      }
      // Finish the case
      break;
    // Default case
    default:
      throw new Error("content.js says: That is not a valid request");
  }
});

// Note that we don’t need to check if the document has loaded
// By default, Chrome injects content scripts after the DOM is completd

// Remember to add this file to manifest.json > content_scripts
