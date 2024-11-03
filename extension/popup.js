document.getElementById("stripHtml").addEventListener("click", () => {
	// Trigger when "stripHtml" button is clicked
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		// Find the active tab in the current window
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id }, // Injects the script into the active tab
			function: replaceImagesOnPage, // Call the function to replace images
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
	images.forEach((img) => {
		img.src = newImageUrl;
		img.srcset = newImageUrl;
	});
}
// Event listener for "Test GPT" button
document.getElementById("testGptButton").addEventListener("click", () => {
	fetch("http://127.0.0.1:5000/gpt-test", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.message) {
				console.log("Response from GPT:", data.message);
			} else {
				console.error("Error from server:", data.error);
			}
		})
		.catch((error) => console.error("Fetch error:", error));
});

// Event listener for "Perform Action" button
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
	// Get all elements in the document
	const allElements = document.querySelectorAll("*");

	allElements.forEach((element) => {
		// Get the computed style for the element
		const computedStyle = window.getComputedStyle(element);
		const fontSize = parseFloat(computedStyle.fontSize);

		// If font size is less than 20px, set it to 25px
		if (fontSize && fontSize < 20) {
			element.style.fontSize = "25px";
		}
	});
}

// Add this function to execute when "Increase Font Size" button is clicked
document
	.getElementById("increaseFontSizeButton")
	.addEventListener("click", () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				function: increaseFontSize,
			});
		});
	});

// Function to get all color values from the page
function getAllColorValues() {
	const colorValues = [];

	// Select all elements in the document
	const allElements = document.querySelectorAll("*");

	allElements.forEach((element) => {
		// Get the computed style of each element
		const computedStyle = window.getComputedStyle(element);
		const textColor = computedStyle.color;
		const backgroundColor = computedStyle.backgroundColor;

		// Add color values to the list if they aren't already there
		if (textColor && !colorValues.includes(textColor)) {
			colorValues.push(textColor);
		}
		if (backgroundColor && !colorValues.includes(backgroundColor)) {
			colorValues.push(backgroundColor);
		}
	});

	console.log("Color values on the page:", colorValues);
}

document.getElementById("testBtn").addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			function: replaceColorsOnPage,
		});
	});
});

// const colorMap = {
// 	"rgb(0, 4, 15)": "rgb(25, 25, 112)",
// 	"rgb(255, 254, 254)": "rgb(245, 245, 245)",
// 	"rgb(112, 109, 226)": "rgb(60, 60, 220)",
// 	"rgb(121, 112, 255)": "rgb(90, 90, 210)",
// 	"rgba(11, 12, 16, 0.733)": "rgba(45, 45, 45, 0.8)",
// };

function replaceColorsOnPage() {
	const colorMap = {
		"rgb(219, 226, 239)": "rgb(150, 150, 150)",
		"rgb(17, 45, 78)": "rgb(255, 255, 255)",
		"rgb(63, 114, 175)": "rgb(255, 255, 255)",
	};
  

	// Select all elements in the document
	const allElements = document.querySelectorAll("*");

	allElements.forEach((element) => {
		// Get the computed style of each element
		const computedStyle = window.getComputedStyle(element);
		const textColor = computedStyle.color;
		const backgroundColor = computedStyle.backgroundColor;

		// Check if the color or background color matches any key in the colorMap and replace if so
		if (colorMap[textColor]) {
			element.style.color = colorMap[textColor];
		}
		if (colorMap[backgroundColor]) {
			element.style.backgroundColor = colorMap[backgroundColor];
		}
	});
	console.log("aaaa");
}
