// options.js

document.addEventListener('DOMContentLoaded', () => {
  // Restore saved settings
  chrome.storage.sync.get(
    ['optimizeImages', 'simplifyText', 'increaseFontSize', 'changeFont', 'optimizeImagesDetail', 'simplifyTextDetail', 'highContrast'],
    (data) => {
      document.getElementById('optimizeImages').checked = data.optimizeImages !== false;
      document.getElementById('simplifyText').checked = data.simplifyText !== false;
      document.getElementById('increaseFontSize').checked = data.increaseFontSize !== false;
      document.getElementById('changeFont').checked = data.changeFont !== false;
      document.getElementById('highContrast').checked = data.highContrast !== false;

      // Restore detail level selections for optimizeImages
      const optimizeImagesDetail = data.optimizeImagesDetail || 'medium';
      document.querySelector(`input[name="optimizeImagesDetail"][value="${optimizeImagesDetail}"]`).checked = true;

      // Restore detail level selections for simplifyText
      const simplifyTextDetail = data.simplifyTextDetail || 'medium';
      document.querySelector(`input[name="simplifyTextDetail"][value="${simplifyTextDetail}"]`).checked = true;

      toggleDetailOptions();
    }
  );

  // Save settings on change
  document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', () => {
      chrome.storage.sync.set({
        optimizeImages: document.getElementById('optimizeImages').checked,
        simplifyText: document.getElementById('simplifyText').checked,
        increaseFontSize: document.getElementById('increaseFontSize').checked,
        changeFont: document.getElementById('changeFont').checked,
        optimizeImagesDetail: document.querySelector('input[name="optimizeImagesDetail"]:checked').value,
        simplifyTextDetail: document.querySelector('input[name="simplifyTextDetail"]:checked').value,
        highContrast: document.getElementById('highContrast').checked,
      });
    });
  });

  // Toggle visibility of detail options based on checkbox state
  function toggleDetailOptions() {
    document.getElementById('optimizeImagesDetail').style.display = document.getElementById('optimizeImages').checked ? 'block' : 'none';
    document.getElementById('simplifyTextDetail').style.display = document.getElementById('simplifyText').checked ? 'block' : 'none';
    // No detail options for increaseFontSize and changeFont
  }

  // // Initial toggle
  // toggleDetailOptions();

  // Add event listeners to checkboxes
  document.getElementById('optimizeImages').addEventListener('change', toggleDetailOptions);
  document.getElementById('simplifyText').addEventListener('change', toggleDetailOptions);
  // No need to add an event listener for increaseFontSize and changeFont since they have no detail options
});
