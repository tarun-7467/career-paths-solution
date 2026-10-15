(function () {
  const LOG = (...a) => console.log('[WD-DETECT]', ...a);

  const hostPatterns = ['workday', 'workdayjobs', 'myworkdayjobs', 'myworkday'];
  function isWorkdayHost() {
    return hostPatterns.some(p => window.location.hostname.includes(p));
  }

  function extractRequisitionId(text) {
    const m = text.match(/\bJR-\d{4,}\b/i);
    return m ? m[0] : null;
  }

  function getTitle() {
    // common title spots
    const h1 = document.querySelector('h1')?.innerText?.trim();
    if (h1) return h1;
    const metaTitle = document.querySelector('meta[property="og:title"]')?.content;
    return metaTitle || document.title || '';
  }

  function detect() {
    try {
      const bodyText = (document.body && document.body.innerText) || '';
      const title = getTitle();
      const markers = /requisition|jobPosting|apply|job|requisitionId|JR-\d{4,}/i;
      const hasJobMarkers = markers.test(bodyText) ||
        Boolean(document.querySelector('[data-automation-id]')) ||
        Boolean(document.querySelector('a[href*="/recruiting/"]'));
      const supported = isWorkdayHost() || hasJobMarkers;
      const requisitionId = extractRequisitionId(bodyText);
      const payload = { supported, title, url: location.href, requisitionId, detectedAt: Date.now() };
      LOG('detect =>', payload);
      chrome.runtime.sendMessage({ type: 'PAGE_DETECTION', payload });
    } catch (err) {
      LOG('detect error', err);
    }
  }

  // attempt detection now, and again after DOM mutations / delays
  detect();

  // retry a few times (pages may load content async)
  let retries = 0;
  const maxRetries = 5;
  const retryInterval = 600;
  const retryTimer = setInterval(() => {
    if (retries++ >= maxRetries) { clearInterval(retryTimer); return; }
    detect();
  }, retryInterval);

  // Observe DOM for large changes (for single-page loads)
  const mo = new MutationObserver((mutations) => {
    if (mutations.length) detect();
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // respond to on-demand RUN_DETECTION
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === 'RUN_DETECTION') {
      detect();
      sendResponse({ ok: true });
    }
  });
})();