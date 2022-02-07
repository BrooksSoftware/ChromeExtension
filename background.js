'use strict';

//Get current user from ybr
let cuid;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    chrome.cookies.get({ url: 'https://ybr.app/version-test/', name: 'ybr-gig_u1_testmain'},
      function(cookie){
        if(cookie){
          cuid = cookie.value;
        } else {
          console.log('No current user');
        }
      }
    );
    //send Response
    if (request.getUser === "cuid") {
      sendResponse({currentUser: cuid});
      //alert(cuid);
    }
  }
);

chrome.runtime.onInstalled.addListener(function() {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.amazon.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]),
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'zipperbuy.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]),
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.liquidation.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

 
});

chrome.webNavigation.onCompleted.addListener(function(details) {
  console.log(details);
  // chrome.tabs.insertCSS(null, {file: './mystyles.css'});
  chrome.tabs.executeScript(null, {file: 'scripts.js'});
}, {
  url: [{
      hostContains: 'www.amazon.com'
  }],
});

chrome.webNavigation.onCompleted.addListener(function(details) {
  // chrome.tabs.insertCSS(null, {file: './mystyles.css'});
  chrome.tabs.executeScript(null, {file: './zipperbuy.js'});
}, {
  url: [{
      hostContains: 'zipperbuy.com'
  }],
});

chrome.webNavigation.onCompleted.addListener(function(details) {
  // chrome.tabs.insertCSS(null, {file: './mystyles.css'});
  chrome.tabs.executeScript(null, {file: './liquidation.js'});
}, {
  url: [{
      hostContains: 'www.liquidation.com'
  }],
});


// Listener for the extension icon click
chrome.browserAction.onClicked.addListener(establishPort);

// Function to establish connection
function establishPort(tab) {
    // Pass the action to the correct tab
    let port = chrome.tabs.connect(tab.id, {name: "establish_connection"});
    
    // pass on a object to confirm action
    port.postMessage({action: "openModal"});

    // Listen for a response
    port.onMessage.addListener(request => {
        
        if (request.tags.length != 0) {
            console.log(request.tags);
            console.log(JSON.parse(request.tags));
            console.log(`background_script: ${port.sender}`);
        }

    });

    chrome.contextMenus.onClicked.addListener(function (clickData) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
         chrome.tabs.sendMessage(tabs[0].id, {type: "openModal"});
        });
      });

}


