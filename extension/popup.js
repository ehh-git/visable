document.getElementById("stripHtml").addEventListener("click", () => { 
  // Trigger when "stripHtml" button is clicked
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { 
    // Find the active tab in the current window
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id }, // Injects the script into the active tab
      function: replaceImagesOnPage // Call the function to replace images
    });
  });
});

// Define the function that will replace images on the page
function replaceImagesOnPage() {
  // Get the URL of the new image within the extension
  const newImageUrl = chrome.runtime.getURL("Images/blind.jpg");
  
  // Select all images on the page
  const images = document.querySelectorAll("img");

  // Replace the src and srcset of each image
  images.forEach(img => {
    img.src = newImageUrl;
    img.srcset = newImageUrl;
  });
}
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
