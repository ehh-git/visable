// content.js

// Function Definitions
// --------------------

// COLOR CHANGING
// Function to adjust color contrast
function adjustColorContrast() {
  // Minimum contrast ratio as per WCAG guidelines
  const MIN_CONTRAST_RATIO = 4.5;

  // Select all elements in the document
  const allElements = document.querySelectorAll("*");

  allElements.forEach((element) => {
    // Get computed styles
    const computedStyle = window.getComputedStyle(element);
    const textColor = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;

    // Convert colors to RGB arrays
    const textRGB = getRGBValues(textColor);
    const bgRGB = getRGBValues(backgroundColor);

    if (textRGB && bgRGB) {
      // Calculate contrast ratio
      const contrastRatio = getContrastRatio(textRGB, bgRGB);

      if (contrastRatio < MIN_CONTRAST_RATIO) {
        // Adjust text color to improve contrast
        const adjustedTextColor = adjustColor(textRGB, bgRGB, MIN_CONTRAST_RATIO);
        element.style.color = `rgb(${adjustedTextColor.join(",")})`;
        console.log(`Adjusted color for element:`, element);
      }
    }
  });

  console.log("Color contrast adjusted on the page.");
}

// Helper function to parse RGB values from CSS color string
function getRGBValues(color) {
  const rgbRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)/i;
  const match = rgbRegex.exec(color);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }
  return null;
}

// Helper function to calculate relative luminance
function getRelativeLuminance(rgb) {
  const [r, g, b] = rgb.map((component) => {
    component /= 255;
    return component <= 0.03928
      ? component / 12.92
      : Math.pow((component + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Helper function to calculate contrast ratio
function getContrastRatio(rgb1, rgb2) {
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Helper function to adjust color to meet minimum contrast ratio
function adjustColor(foregroundRGB, backgroundRGB, minContrastRatio) {
  let fg = [...foregroundRGB];
  let steps = 0;
  const maxSteps = 10;

  while (getContrastRatio(fg, backgroundRGB) < minContrastRatio && steps < maxSteps) {
    // Increase the brightness of the text color
    fg = fg.map((component) => Math.min(component + 10, 255));
    steps++;
  }

  // If contrast is still insufficient, invert the text color
  if (getContrastRatio(fg, backgroundRGB) < minContrastRatio) {
    fg = foregroundRGB.map((component) => 255 - component);
  }

  return fg;
}

function changeFontToTimesNewRoman() {
  chrome.storage.sync.get('changeFont', function(items) {
    if (items.changeFont !== false) {
      // Create a new style element
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        * {
          font-family: "Times New Roman", Times, serif !important;
        }
      `;
      // Append the style element to the head
      document.head.appendChild(styleElement);

      console.log('Font changed to Times New Roman.');
    } else {
      console.log('Change Font setting is disabled.');
    }
  });
}

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
  if (request.action === 'activateAccessibility') {
    // Check all settings and activate functions accordingly
    chrome.storage.sync.get(
      ['optimizeImages', 'simplifyText', 'increaseFontSize', 'changeFont', 'optimizeImagesDetail', 'simplifyTextDetail'],
      (items) => {
        if (items.optimizeImages !== false) {
          generateSubtextForImages();
        }
        if (items.simplifyText !== false) {
          summarizeLongText();
        }
        if (items.increaseFontSize !== false) {
          increaseFontSize();
        }
        if (items.changeFont !== false) {
          changeFontToTimesNewRoman();
        }
        if (items.adjustColors !== false) {
          adjustColorContrast();
        }
        // Include other functions as needed
      }
    );
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