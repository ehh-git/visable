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
  }
});
