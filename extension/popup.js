document.addEventListener('DOMContentLoaded', () => {
  const apiEndpointInput = document.getElementById('apiEndpoint');
  const authTokenInput = document.getElementById('authToken');
  const autoSyncToggle = document.getElementById('autoSyncToggle');
  const syncStatusText = document.getElementById('syncStatusText');
  const saveBtn = document.getElementById('saveBtn');
  const messageEl = document.getElementById('message');
  
  const latestProblemSection = document.getElementById('latestProblemSection');
  const latestProblemTitle = document.getElementById('latestProblemTitle');
  const copyJsonBtn = document.getElementById('copyJsonBtn');

  let currentProblemData = null;

  // Load latest problem
  chrome.storage.local.get(['latestProblem'], (result) => {
    if (result.latestProblem) {
      currentProblemData = result.latestProblem;
      latestProblemTitle.textContent = currentProblemData.title;
      latestProblemSection.classList.remove('hidden');
    }
  });

  // Handle Copy JSON
  copyJsonBtn.addEventListener('click', () => {
    if (currentProblemData) {
      navigator.clipboard.writeText(JSON.stringify(currentProblemData, null, 2))
        .then(() => {
          copyJsonBtn.textContent = "Copied!";
          setTimeout(() => { copyJsonBtn.textContent = "Copy JSON to Clipboard"; }, 2000);
        })
        .catch(err => {
          console.error("Failed to copy:", err);
          copyJsonBtn.textContent = "Failed :(";
        });
    }
  });

  // Load saved settings
  chrome.storage.sync.get(['apiEndpoint', 'authToken', 'autoSync'], (result) => {
    if (result.apiEndpoint) apiEndpointInput.value = result.apiEndpoint;
    if (result.authToken) authTokenInput.value = result.authToken;
    
    // Default autoSync to true if not set
    const isAutoSyncEnabled = result.autoSync !== false;
    autoSyncToggle.checked = isAutoSyncEnabled;
    updateSyncStatusText(isAutoSyncEnabled);
  });

  autoSyncToggle.addEventListener('change', (e) => {
    updateSyncStatusText(e.target.checked);
  });

  function updateSyncStatusText(isEnabled) {
    syncStatusText.textContent = isEnabled ? 'Enabled' : 'Disabled';
    if (isEnabled) {
      syncStatusText.style.color = 'var(--c-success)';
    } else {
      syncStatusText.style.color = 'var(--c-text-2)';
    }
  }

  // Save settings
  saveBtn.addEventListener('click', () => {
    const apiEndpoint = apiEndpointInput.value.trim();
    const authToken = authTokenInput.value.trim();
    const autoSync = autoSyncToggle.checked;

    chrome.storage.sync.set({
      apiEndpoint,
      authToken,
      autoSync
    }, () => {
      // Show success message
      messageEl.classList.remove('hidden');
      setTimeout(() => {
        messageEl.classList.add('hidden');
      }, 3000);
    });
  });
});
