// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "stripHTML") {
      document.body.innerHTML = document.body.textContent;
    }
  });
  