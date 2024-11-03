// content.js

// Function Definitions
// --------------------

// Function to generate subtext for all images on the page
function generateSubtextForImages() {
  // Get all images on the page
  const images = document.querySelectorAll("img");

  // For each image
  images.forEach((img) => {
    const imageUrl = img.src;

    // Send the image URL to the server
    fetch("http://127.0.0.1:5000/generate-subtext", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url: imageUrl }),
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
  }
});

// RIGHT HERE IS FOR SIMPLIFY
// Function to summarize long text content
function summarizeLongText() {
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

      // Send the text to the server for summarization
      fetch("http://127.0.0.1:5000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textContent }),
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
}

// super button
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "activateAccessibility") {
    generateSubtextForImages();
    summarizeLongText();
    // increaseFontSize();
    // Add other functions as needed
  }
});
