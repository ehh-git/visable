document.getElementById("stripHtmlCSS").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: displayRawHTMLAndCSS,
    });
  });
});
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
  const combinedContent = `<html>\n<head>\n<style>\n${styles}\n</style>\n</head>\n<body>\n<pre>${escapeHTML(rawHTML)}</pre>\n</body>\n</html>`;

  // Create a full-screen overlay to display the combined content
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.color = 'white';
  overlay.style.overflow = 'auto';
  overlay.style.padding = '20px';
  overlay.style.zIndex = '9999';
  overlay.style.fontFamily = 'monospace';
  overlay.style.fontSize = '14px';

  // Add close button to the overlay
  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '20px';
  closeButton.style.right = '20px';
  closeButton.style.backgroundColor = 'red';
  closeButton.style.color = 'white';
  closeButton.style.border = 'none';
  closeButton.style.padding = '10px';
  closeButton.style.cursor = 'pointer';

  closeButton.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  // Set the content of the overlay
  overlay.innerHTML = `<pre>${escapeHTML(combinedContent)}</pre>`;
  overlay.appendChild(closeButton);

  // Append the overlay to the body
  document.body.appendChild(overlay);
}