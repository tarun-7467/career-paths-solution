let lastDetection = null;
chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg?.type === 'PAGE_DETECTION') {
        lastDetection = { ...msg.payload, tabId: sender.tab?.id, time: Date.now() };
    }
});
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === 'GET_LAST_DETECTION') sendResponse(lastDetection || null);
});