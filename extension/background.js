// O(1) Knot - Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log("O(1) Knot Extension Installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SUBMISSION_DETECTED") {
    const problemData = message.payload;
    console.log("Background received submission:", problemData);

    // Save the latest extracted problem to local storage so the popup can access it
    chrome.storage.local.set({ latestProblem: problemData });

    // Check sync settings and attempt to POST to backend
    chrome.storage.sync.get(['apiEndpoint', 'authToken', 'autoSync'], async (settings) => {
      // Default to autoSync = true if not explicitly disabled
      const isAutoSyncEnabled = settings.autoSync !== false;
      
      if (!isAutoSyncEnabled) {
        console.log("Auto-Sync is disabled. Skipping API POST.");
        return;
      }

      let endpoint = settings.apiEndpoint;
      if (endpoint && !endpoint.endsWith('/api/extension/sync')) {
          endpoint = endpoint.replace(/\/$/, '') + '/api/extension/sync';
      }
      if (!endpoint) {
        console.warn("No API Endpoint configured. Cannot auto-sync.");
        return;
      }

      try {
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (settings.authToken) {
          headers['Authorization'] = `Bearer ${settings.authToken}`;
        }

        console.log(`Sending to backend: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(problemData)
        });

        if (response.ok) {
          console.log("Successfully synced to backend!");
          // Could fire a Chrome notification here
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon128.png',
            title: 'O(1) Knot Sync',
            message: `Successfully synced: ${problemData.title}`
          });
        } else {
          console.error("Backend sync failed:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Network error during auto-sync:", error);
      }
    });

    sendResponse({ status: "processed" });
  }
  return true; // Keep message channel open for async response if needed
});
