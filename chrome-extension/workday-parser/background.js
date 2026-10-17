let lastByTab = {};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === 'PAGE_DETECTION') {
        const tabId = sender.tab?.id;
        if (!tabId) return;
        const record = { ...msg.payload, tabId, time: Date.now() };
        lastByTab[tabId] = record;
        chrome.storage.local.set({ lastByTab });
        return;
    }

    if (msg?.type === 'GET_LAST_DETECTION') {
        const tabId = msg.tabId;
        if (tabId && lastByTab[tabId]) {
            sendResponse(lastByTab[tabId]);
            return;
        }
        // fallback if service worker restarted
        chrome.storage.local.get('lastByTab', (res) => {
            const map = res.lastByTab || {};
            sendResponse(tabId ? map[tabId] || null : null);
        });
        return true; // declare async response
    }
});