/* background.js */

// In order to use the browser action, we need to add message passing
// A content script has access to the current page, but is limited in the APIs it can access
// It cannot listen for clicks on the Browser Action button
// We need to add a background script instead
// A background script has access to every Chrome API but cannot access the current page
// The content script will be able to pull a URL out of the current page
// But will need to hand that URL over to the background script to do something useful with it
// We will use Message Passing -- allows scripts to send and listen for messages
// It is the only way for content scripts and background scripts to interact

// The general idea is:
// 1 - Listen for a click on the browser action in background.js. 
//     When it’s clicked, send a clicked_browser_action event to content.js.
// 2 - When content.js receives the event, it grabs the URL of the first link on the page. 
//     Then it sends open_new_tab back to background.js with the URL to open.
// 3 - background.js listens for open_new_tab 
//     and opens a new tab with the given URL when it receives the message.

appUrl = "http://localhost:8501"

/**
 * 1 - Browser Action Click Listener
 * This function is called when the user clicks on the Browser Action button
 * Send a message to content.js that the Browser Action button has been clicked
 * content.js will decide then what to do about it
 */
chrome.browserAction.onClicked.addListener(tab => {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    // Set the active tab
    let activeTab = tabs[0];
    // Send the message that content.js will receive
    // The keys of the JSON payload can be anything, but we chose "message" for simplicity
    chrome.tabs.sendMessage(activeTab.id, {
      "message": "clicked_browser_action"
    });
  });
});

/**
 * 3 - open_new_tab Event Listener
 * This function is called when content.js sent a message event
 * When the message is "open_new_tab", background.js will then open a new tab with the URL
 */
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // The request message from content.js could be anything: Switch through it
  switch (request.message) {
    case "redirecting_in_new_tab":
      // Grab the passed URL
      url = request.url
      // Build a new Google query url with the url to search for
      url = appUrl + "?url=" + url;
      // Open the Google query in a new tab
      chrome.tabs.create({"url": url});
      // Finish the case
      break;
    // Default case
    default:
      throw new Error("background.js says: That is not a valid request");
  }
});
