'use strict';

chrome.webNavigation.onCompleted.addListener(function(details) {
  chrome.tabs.insertCSS(null, {file: './mystyles.css'});
  chrome.tabs.executeScript(null, {file: './scripts.js'});
}, {
  url: [{
      hostContains: 'www.amazon.com'
  }],
});

chrome.webNavigation.onCompleted.addListener(function(details) {
  chrome.tabs.insertCSS(null, {file: './mystyles.css'});
  chrome.tabs.executeScript(null, {file: './zipperbuy.js'});
}, {
  url: [{
      hostContains: 'zipperbuy.com'
  }],
});