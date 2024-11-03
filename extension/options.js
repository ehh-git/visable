// options.js

document.addEventListener('DOMContentLoaded', () => {
  // Restore saved settings
  chrome.storage.sync.get(
    ['optimizeImages', 'simplifyText', 'increaseFontSize', 'optimizeImagesDetail', 'simplifyTextDetail'],
    (data) => {
      document.getElementById('optimizeImages').checked = data.optimizeImages !== false;
      document.getElementById('simplifyText').checked = data.simplifyText !== false;
      document.getElementById('increaseFontSize').checked = data.increaseFontSize !== false;

      // Restore detail level selections for optimizeImages
      const optimizeImagesDetail = data.optimizeImagesDetail || 'medium';
      document.querySelector(`input[name="optimizeImagesDetail"][value="${optimizeImagesDetail}"]`).checked = true;

      // Restore detail level selections for simplifyText
      const simplifyTextDetail = data.simplifyTextDetail || 'medium';
      document.querySelector(`input[name="simplifyTextDetail"][value="${simplifyTextDetail}"]`).checked = true;
    }
  );

  // Save settings on change
  document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', () => {
      chrome.storage.sync.set({
        optimizeImages: document.getElementById('optimizeImages').checked,
        simplifyText: document.getElementById('simplifyText').checked,
        increaseFontSize: document.getElementById('increaseFontSize').checked,
        optimizeImagesDetail: document.querySelector('input[name="optimizeImagesDetail"]:checked').value,
        simplifyTextDetail: document.querySelector('input[name="simplifyTextDetail"]:checked').value,
      });
    });
  });

  // Toggle visibility of detail options based on checkbox state
  function toggleDetailOptions() {
    document.getElementById('optimizeImagesDetail').style.display = document.getElementById('optimizeImages').checked ? 'block' : 'none';
    document.getElementById('simplifyTextDetail').style.display = document.getElementById('simplifyText').checked ? 'block' : 'none';
    // Removed increaseFontSizeDetail toggling since there are no detail options
  }

  // Initial toggle
  toggleDetailOptions();

  // Add event listeners to checkboxes
  document.getElementById('optimizeImages').addEventListener('change', toggleDetailOptions);
  document.getElementById('simplifyText').addEventListener('change', toggleDetailOptions);
  // No need to add an event listener for increaseFontSize since it has no detail options
});
