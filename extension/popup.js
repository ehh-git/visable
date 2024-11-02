document.getElementById("stripHtml").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          document.body.innerHTML = document.body.textContent;
        }
      });
    });
  });
  