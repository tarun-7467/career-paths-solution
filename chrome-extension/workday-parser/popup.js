document.addEventListener('DOMContentLoaded', () => {
    const statusEl = document.getElementById('status');
    const questionEl = document.getElementById('question');
    const actionsEl = document.getElementById('actions');
    const detailsEl = document.getElementById('details');

    function renderDetails(details) {
        if (!details) return;

        const rows = [
            details.job_title ? `<strong>Title:</strong> ${details.job_title}` : null,
            details.company_name ? `<strong>Company:</strong> ${details.company_name}` : null,
            details.location ? `<strong>Location:</strong> ${details.location}` : null,
            details.requisition_id ? `<strong>Requisition ID:</strong> ${details.requisition_id}` : null,
            details.employment_type ? `<strong>Employment Type:</strong> ${details.employment_type}` : null,
            details.posted_date ? `<strong>Posted:</strong> ${details.posted_date}` : null,
            details.work_mode ? `<strong>Work Mode:</strong> ${details.work_mode}` : null
        ].filter(Boolean);

        detailsEl.innerHTML = rows.length ? rows.join('<br>') : 'No details found for this job.';
        detailsEl.classList.remove('hidden');
    }

    function showSkip() {
        questionEl.classList.add('hidden');
        actionsEl.classList.add('hidden');
        detailsEl.innerHTML = '<strong>Skipped.</strong> No job details were added.';
        detailsEl.classList.remove('hidden');
    }

    function updateUI(resp) {
        if (!resp || !resp.supported) {
            statusEl.textContent = 'Unsupported';
            statusEl.classList.add('unsupported');
            statusEl.classList.remove('supported');
            questionEl.classList.add('hidden');
            actionsEl.classList.add('hidden');
            detailsEl.classList.add('hidden');
            return;
        }

        statusEl.textContent = 'Supported (Workday)';
        statusEl.classList.add('supported');
        statusEl.classList.remove('unsupported');
        questionEl.classList.remove('hidden');
        actionsEl.classList.remove('hidden');
        detailsEl.classList.add('hidden');
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs?.[0]?.id;
        if (!tabId) {
            updateUI(null);
            return;
        }

        chrome.runtime.sendMessage({ type: 'GET_LAST_DETECTION', tabId }, (resp) => {
            if (resp) {
                updateUI(resp);
                document.getElementById('confirm').onclick = () => renderDetails(resp);
                document.getElementById('cancel').onclick = () => showSkip();
                return;
            }

            chrome.tabs.sendMessage(tabId, { type: 'RUN_DETECTION' }, () => {
                setTimeout(() => {
                    chrome.runtime.sendMessage({ type: 'GET_LAST_DETECTION', tabId }, (newResp) => {
                        updateUI(newResp);
                        document.getElementById('confirm').onclick = () => renderDetails(newResp);
                        document.getElementById('cancel').onclick = () => showSkip();
                    });
                }, 300);
            });
        });
    });
});