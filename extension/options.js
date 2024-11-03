document.addEventListener('DOMContentLoaded', () => {
    // Restore saved settings
    chrome.storage.sync.get(['optimizeImages', 'simplifyText', 'increaseFontSize'], (data) => {
      document.getElementById('optimizeImages').checked = data.optimizeImages !== false;
      document.getElementById('simplifyText').checked = data.simplifyText !== false;
      document.getElementById('increaseFontSize').checked = data.increaseFontSize !== false;
    });
  
    // Save settings on change
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        chrome.storage.sync.set({
          optimizeImages: document.getElementById('optimizeImages').checked,
          simplifyText: document.getElementById('simplifyText').checked,
          increaseFontSize: document.getElementById('increaseFontSize').checked,
        });
      });
    });
  });
  