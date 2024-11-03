// popup.js

// Function Definitions
// --------------------

// Function to replace images on the page
function replaceImagesOnPage() {
  // Get the URL of the new image within the extension
  const newImageUrl = chrome.runtime.getURL("Images/blind.jpg");

  // Select all images on the page
  const images = document.querySelectorAll("img");

  // Replace the src and srcset of each image
  images.forEach((img) => {
    img.src = newImageUrl;
    img.srcset = newImageUrl;
  });
}

// Function to display raw HTML and CSS
function displayRawHTMLAndCSS() {
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
    .map((styleSheet) => {
      try {
        // Access the CSS rules from the stylesheet
        return Array.from(styleSheet.cssRules || [])
          .map((rule) => rule.cssText)
          .join("\n");
      } catch (e) {
        console.warn("Could not access stylesheet: ", e);
        return "";
      }
    })
    .join("\n");

  // Combine HTML and CSS into a single string
  const combinedContent = `<html>\n<head>\n<style>\n${styles}\n</style>\n</head>\n<body>\n<pre>${escapeHTML(
    rawHTML
  )}</pre>\n</body>\n</html>`;
  const rawHTMLAndCSS = `<pre>${escapeHTML(combinedContent)}</pre>`;

  document.open();
  document.write(rawHTMLAndCSS);
  document.close();
}

// Function to increase font size if it is less than 20px
function increaseFontSize() {
  chrome.storage.sync.get('increaseFontSize', (data) => {
    if (data.increaseFontSize !== false) {
      // Get all elements in the document
      const allElements = document.querySelectorAll("*");

      allElements.forEach((element) => {
        // Get the computed style for the element
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);

        // If font size is less than 20px, set it to 50px
        if (fontSize && fontSize < 16) {
          element.style.fontSize = "21px";
        }
      });
    }
  });
}

// Event Listeners
// ---------------

// super button
document.getElementById("activateAccessibility").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "activateAccessibility" });
  });
});


// settings 
document.getElementById("settingsButton").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});