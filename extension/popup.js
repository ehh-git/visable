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
