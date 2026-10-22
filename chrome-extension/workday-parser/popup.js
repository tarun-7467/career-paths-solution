document.addEventListener('DOMContentLoaded', () => {
    const statusEl = document.getElementById('status');
    const questionEl = document.getElementById('question');
    const actionsEl = document.getElementById('actions');
    const detailsEl = document.getElementById('details');

    function buildPayloadFromDetails(details) {
        return {
            user: 1,
            company: (details.company_name || '').trim() || 'Unknown Company',
            position: (details.job_title || '').trim() || 'Unknown Position',
            status: 'Applied',
            date_applied: details.date_applied || new Date().toISOString().slice(0, 10),
            notes: details.notes || '',
            location: details.location || '',
            requisition_id: details.requisition_id || '',
            employment_type: details.employment_type || '',
            work_mode: details.work_mode || '',
            posted_date: details.posted_date || '',
            job_url: details.url || '',
            job_description: details.job_description || ''
        };
    }

    function renderEditForm(details) {
        if (!details) return;

        const form = document.createElement('form');
        form.id = 'job-form';
        form.innerHTML = `
            <div class="field-row">
                <label>Company</label>
                <input name="company_name" value="${(details.company_name || '').replace(/"/g, '&quot;')}" />
            </div>
            <div class="field-row">
                <label>Position</label>
                <input name="job_title" value="${(details.job_title || '').replace(/"/g, '&quot;')}" />
            </div>
            <div class="field-row">
                <label>Location</label>
                <input name="location" value="${(details.location || '').replace(/"/g, '&quot;')}" />
            </div>
            <div class="field-row">
                <label>Requisition ID</label>
                <input name="requisition_id" value="${(details.requisition_id || '').replace(/"/g, '&quot;')}" />
            </div>
            <div class="field-row">
                <label>Employment Type</label>
                <input name="employment_type" value="${(details.employment_type || '').replace(/"/g, '&quot;')}" />
            </div>
            <div class="field-row">
                <label>Work Mode</label>
                <input name="work_mode" value="${(details.work_mode || '').replace(/"/g, '&quot;')}" />
            </div>
            <div class="field-row">
                <label>Posted Date</label>
                <input name="posted_date" value="${(details.posted_date || '').replace(/"/g, '&quot;')}" />
            </div>
            <div class="field-row">
                <label>Status</label>
                <select name="status">
                    <option value="Applied" selected>Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            <div class="field-row">
                <label>Date Applied</label>
                <input type="date" name="date_applied" value="${(details.date_applied || new Date().toISOString().slice(0, 10))}" />
            </div>
            <div class="field-row">
                <label>Notes</label>
                <textarea name="notes" rows="3">${(details.notes || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            </div>
            <div class="inline-actions">
                <button type="submit" class="primary">Save</button>
                <button type="button" id="discard" class="secondary">Discard</button>
            </div>
            <div id="save-status" class="save-status hidden"></div>
        `;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const saveStatus = document.getElementById('save-status');
            const payload = new FormData(form);
            const basePayload = buildPayloadFromDetails(details);
            const data = {
                ...basePayload,
                company: payload.get('company_name') || basePayload.company,
                position: payload.get('job_title') || basePayload.position,
                status: payload.get('status') || 'Applied',
                date_applied: payload.get('date_applied') || basePayload.date_applied,
                notes: payload.get('notes') || basePayload.notes,
                location: payload.get('location') || basePayload.location,
                requisition_id: payload.get('requisition_id') || basePayload.requisition_id,
                employment_type: payload.get('employment_type') || basePayload.employment_type,
                work_mode: payload.get('work_mode') || basePayload.work_mode,
                posted_date: payload.get('posted_date') || basePayload.posted_date,
                job_url: details.url || basePayload.job_url,
                job_description: details.job_description || basePayload.job_description
            };

            saveStatus.textContent = 'Saving...';
            saveStatus.classList.remove('hidden', 'error');
            saveStatus.classList.add('success');

            try {
                const response = await fetch('http://127.0.0.1:8000/api/job-applications/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || `HTTP ${response.status}`);
                }

                saveStatus.textContent = 'Saved successfully.';
                saveStatus.classList.remove('error');
                saveStatus.classList.add('success');
                questionEl.classList.add('hidden');
                actionsEl.classList.add('hidden');
                setTimeout(() => {
                    detailsEl.classList.add('hidden');
                }, 1200);
            } catch (err) {
                console.error('Failed to save job application:', err);
                saveStatus.textContent = 'Save failed. Please try again.';
                saveStatus.classList.remove('success');
                saveStatus.classList.add('error');
            }
        });

        const discardBtn = form.querySelector('#discard');
        discardBtn.addEventListener('click', () => {
            detailsEl.innerHTML = '<strong>Discarded.</strong> Job details were not saved.';
            detailsEl.classList.remove('hidden');
            questionEl.classList.add('hidden');
            actionsEl.classList.add('hidden');
        });

        detailsEl.innerHTML = '';
        detailsEl.appendChild(form);
        detailsEl.classList.remove('hidden');
    }

    function renderDetails(details) {
        if (!details) return;
        renderEditForm(details);
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