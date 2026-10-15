let lastDetection = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'PAGE_DETECTION') {
    const record = { ...msg.payload, tabId: sender.tab?.id, time: Date.now() };
    lastDetection = record;
    // persist so popup can read after service worker restarts
    chrome.storage.local.set({ lastDetection: record });
    return; // no async response needed here
  }

  if (msg?.type === 'GET_LAST_DETECTION') {
    if (lastDetection) {
      sendResponse(lastDetection);
      return;
    }
    // async fallback to storage (service worker may have restarted)
    chrome.storage.local.get('lastDetection', (res) => {
      sendResponse(res.lastDetection || null);
    });
    return true; // keep message channel open for async sendResponse
  }
});