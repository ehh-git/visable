// URL of the new image to replace all images on the page
const newImageUrl = chrome.runtime.getURL("Images/blind.jpg"); // Ensure the path and file name are correct

// Function to replace all images on the page
function replaceImages() {
    // Select all <img> elements on the page
    const images = document.querySelectorAll("img");

    // Loop through each image element
    images.forEach(img => {
        // Replace the src attribute with the new image URL
        img.src = newImageUrl;

        // Optional: Replace srcset for responsive images
        img.srcset = newImageUrl;
    });
}

// Run the replaceImages function 
replaceImages();
