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
