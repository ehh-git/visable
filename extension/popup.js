document.getElementById("stripHtml").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "fetchData" });
  });
});

document.getElementById("testGptButton").addEventListener("click", () => {
  fetch("http://127.0.0.1:5000/gpt-test", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.message) {
          console.log("Response from GPT:", data.message);
      } else {
          console.error("Error from server:", data.error);
      }
  })
  .catch(error => console.error("Fetch error:", error));
});
