document.addEventListener('DOMContentLoaded', () => {
    const statusEl = document.getElementById('status');
    const titleEl = document.getElementById('title');

    function updateUI(resp) {
        if (!resp) {
            statusEl.textContent = 'Unsupported';
            titleEl.textContent = '';
            return;
        }

        statusEl.textContent = resp.supported ? 'Supported (Workday)' : 'Unsupported';
        titleEl.textContent = resp.requisitionId
            ? `${resp.title || 'Workday page'} — ${resp.requisitionId}`
            : (resp.title || resp.url || '');
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs?.[0]?.id;
        if (!tabId) {
            statusEl.textContent = 'Unsupported';
            return;
        }

        chrome.runtime.sendMessage({ type: 'GET_LAST_DETECTION', tabId }, (resp) => {
            if (resp) {
                updateUI(resp);
                return;
            }

            chrome.tabs.sendMessage(tabId, { type: 'RUN_DETECTION' }, () => {
                setTimeout(() => {
                    chrome.runtime.sendMessage({ type: 'GET_LAST_DETECTION', tabId }, (newResp) => {
                        updateUI(newResp);
                    });
                }, 300);
            });
        });
    });
});