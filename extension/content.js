// content.js

// Function Definitions
// --------------------

// Function to generate subtext for all images on the page
function generateSubtextForImages() {
  chrome.storage.sync.get(['optimizeImages', 'optimizeImagesDetail'], function(items) {
    if (items.optimizeImages !== false) {
      const detailLevel = items.optimizeImagesDetail || 'medium';

      // Get all images on the page
      const images = document.querySelectorAll("img");

      // For each image
      images.forEach((img) => {
        const imageUrl = img.src;

        // Send the image URL and detail level to the server
        fetch("http://127.0.0.1:5000/generate-subtext", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image_url: imageUrl, detail_level: detailLevel }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.subtext) {
              // Set the alt attribute of the image
              img.alt = data.subtext;
              console.log(`Updated alt text for image: ${imageUrl}`);
            } else {
              console.error("Error from server:", data.error);
            }
          })
          .catch((error) => console.error("Fetch error:", error));
      });
    } else {
      console.log('Optimize Images setting is disabled.');
    }
  });
}


// Message Listener
// ----------------

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "gptTest") {
    // Handle GPT Test action
    fetch("http://localhost:5000/gpt-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sample: "data" }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Response from Flask (gpt-test):", data))
      .catch((error) => console.error("Error in gpt-test fetch:", error));
  } else if (request.action === "generateSubtext") {
    // Handle Generate Subtext action
    console.log("Content script received 'generateSubtext' action");
    generateSubtextForImages();
  } else if (request.action === "summarizeContent") {
    // Handle Summarize Content action
    console.log("Content script received 'summarizeContent' action");
    summarizeLongText();
  } else if (request.action === "increaseFontSize") {
    increaseFontSize();
  }
});

// RIGHT HERE IS FOR FONT SIZE
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
        if (fontSize && fontSize < 20) {
          element.style.fontSize = "40px";
        }
      });
    }
  });
}

// RIGHT HERE IS FOR SIMPLIFY
// Function to summarize long text content
function summarizeLongText() {
  chrome.storage.sync.get(['simplifyText', 'simplifyTextDetail'], function(items) {
    if (items.simplifyText !== false) {
      const detailLevel = items.simplifyTextDetail || 'medium';

      // Define the minimum word count to trigger summarization
      const MIN_WORD_COUNT = 50;

      // Helper function to walk through text nodes
      function walk(node) {
        let child, next;

        switch (node.nodeType) {
          case 1: // Element
            // Skip certain tags
            const tagName = node.tagName.toLowerCase();
            if (["script", "style", "textarea", "input"].includes(tagName)) {
              break;
            }
          // Fall through to process child nodes
          case 9: // Document
          case 11: // Document fragment
            child = node.firstChild;
            while (child) {
              next = child.nextSibling;
              walk(child);
              child = next;
            }
            break;
          case 3: // Text node
            handleText(node);
            break;
        }
      }

      // Function to handle text nodes
      function handleText(textNode) {
        const textContent = textNode.nodeValue;
        const wordCount = textContent.trim().split(/\s+/).length;

        if (wordCount >= MIN_WORD_COUNT) {
          // Create a placeholder to prevent multiple requests
          if (textNode.processed) return;
          textNode.processed = true;

          // Send the text and detail level to the server for summarization
          fetch("http://127.0.0.1:5000/summarize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: textContent, detail_level: detailLevel }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.summary) {
                // Replace the original text with the summarized version

                // Create a new text node with the summary
                const newTextNode = document.createTextNode(data.summary);

                // Replace the old text node with the new one
                textNode.parentNode.replaceChild(newTextNode, textNode);

                console.log("Text summarized:", data.summary);
              } else {
                console.error("Error from server:", data.error);
              }
            })
            .catch((error) => console.error("Fetch error:", error));
        }
      }

      // Start walking the document body
      walk(document.body);
    } else {
      console.log('Simplify Text setting is disabled.');
    }
  });
}

// super button
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "activateAccessibility") {
    generateSubtextForImages();
    summarizeLongText();
    increaseFontSize();
    // Add other functions as needed
  }
});
