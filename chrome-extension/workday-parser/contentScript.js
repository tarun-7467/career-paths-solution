(function () {
    try {
        const isWorkdayHost = window.location.hostname.includes('workday');
        const title = document.title || '';
        const hasJobMarkers =
            /requisition|jobPosting|apply|job|requisitionId/i.test(document.body.innerText) ||
            Boolean(document.querySelector('[data-automation-id]')) ||
            Boolean(document.querySelector('a[href*="/recruiting/"]'));
        const supported = isWorkdayHost || hasJobMarkers;
        const payload = { supported, title, url: location.href };

        // send detection result to background/popup
        chrome.runtime.sendMessage({ type: 'PAGE_DETECTION', payload });
    } catch (e) {

        // fail silently
        console.error('Workday parser detection error', e);
    }
})();