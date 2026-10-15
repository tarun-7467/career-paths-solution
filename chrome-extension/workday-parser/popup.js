document.addEventListener('DOMContentLoaded', async () => {
    const statusEl = document.getElementById('status');
    const titleEl = document.getElementById('title');
    const toggleBtn = document.getElementById('toggleBtn');

    // load enabled flag
    chrome.storage.local.get({ enabled: true }, (res) => {
        toggleBtn.textContent = res.enabled ? 'Disable' : 'Enable';
    });

    toggleBtn.onclick = () => {
        chrome.storage.local.get({ enabled: true }, (res) => {
            chrome.storage.local.set({ enabled: !res.enabled }, () => {
                toggleBtn.textContent = !res.enabled ? 'Disable' : 'Enable';
            });
        });
    };

    // ask background for last detection
    chrome.runtime.sendMessage({ type: 'GET_LAST_DETECTION' }, (resp) => {
        if (!resp) {
            statusEl.textContent = 'Unsupported';
            titleEl.textContent = '';
            return;
        }
        statusEl.textContent = resp.supported ? 'Supported (Workday)' : 'Unsupported';
        titleEl.textContent = resp.title || resp.url;
    });
});