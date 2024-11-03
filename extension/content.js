// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchData") {
      fetch("http://localhost:5000/gpt-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sample: "data" })
      })
      .then(response => response.json())
      .then(data => console.log("Response from Flask:", data))
      .catch(error => console.error("Error:", error));
  }
});
