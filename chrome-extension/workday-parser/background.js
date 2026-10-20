let lastByTab = {};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === 'PAGE_DETECTION') {
        const tabId = sender.tab?.id;
        if (tabId) {
            lastByTab[tabId] = { ...msg.payload, tabId, time: Date.now() };
            chrome.storage.local.set({ lastByTab });
        }
        return;
    }

    if (msg?.type === 'GET_LAST_DETECTION') {
        const tabId = msg.tabId;
        if (tabId && lastByTab[tabId]) {
            sendResponse(lastByTab[tabId]);
            return;
        }

        chrome.storage.local.get('lastByTab', (res) => {
            const map = res.lastByTab || {};
            sendResponse(tabId ? map[tabId] || null : null);
        });
        return true;
    }
});