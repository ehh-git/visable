// Event listener for "Strip to Basic HTML" button
document.getElementById("stripHtml").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "fetchData" });
  });
});

// Event listener for "Test GPT" button
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

// Event listener for "Perform Action" button
document.getElementById("stripHtmlCSS").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: replaceWithRawHTMLAndCSS,
    });
  });
});

// Function to replace the page with combined HTML and CSS content
function replaceWithRawHTMLAndCSS() {
  // Function to escape HTML characters
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Get the entire HTML of the current page
  const rawHTML = document.documentElement.outerHTML;

  // Get all styles from <style> elements and <link> elements
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        // Access the CSS rules from the stylesheet
        return Array.from(styleSheet.cssRules || [])
          .map(rule => rule.cssText)
          .join("\n");
      } catch (e) {
        console.warn('Could not access stylesheet: ', e);
        return '';
      }
    })
    .join("\n");

  // Combine HTML and CSS into a single string
  const combinedContent = `<html>\n<head>\n<style>\n${styles}\n</style>\n</head>\n<body>\n<pre style="overflow: auto; white-space: pre-wrap; width: 100%; height: 100vh; margin: 0;">${escapeHTML(rawHTML)}</pre>\n</body>\n</html>`;

  // Replace the entire document with the combined content
  document.open();
  document.write(combinedContent);
  document.close();
}
