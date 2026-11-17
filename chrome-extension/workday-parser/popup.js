document.addEventListener('DOMContentLoaded', () => {
    const statusEl = document.getElementById('status');
    const questionEl = document.getElementById('question');
    const actionsEl = document.getElementById('actions');
    const detailsEl = document.getElementById('details');

    const API_BASE = 'http://localhost:8000';
    let lastDetails = null;

    function setStatus(message, isError = false) {
        statusEl.textContent = message;
        statusEl.classList.toggle('error', isError);
        statusEl.classList.toggle('success', !isError);
    }

    function getToken() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['careerPathsApiToken'], (result) => {
                resolve(result.careerPathsApiToken || '');
            });
        });
    }

    function setToken(token) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ careerPathsApiToken: token }, resolve);
        });
    }

    function renderLoginForm() {
        detailsEl.innerHTML = '';
        const form = document.createElement('form');
        form.id = 'extension-login-form';
        form.innerHTML = `
            <div class="field-row">
                <label>Email</label>
                <input type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div class="field-row">
                <label>Password</label>
                <input type="password" name="password" placeholder="Password" required />
            </div>
            <div class="inline-actions">
                <button type="submit" class="primary">Log in to save</button>
            </div>
            <div id="save-status" class="save-status hidden"></div>
        `;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const status = document.getElementById('save-status');
            const formData = new FormData(form);
            const email = (formData.get('email') || '').toString().trim();
            const password = (formData.get('password') || '').toString();

            if (!email || !password) {
                status.textContent = 'Enter your email and password.';
                status.classList.remove('hidden');
                status.classList.remove('success');
                status.classList.add('error');
                return;
            }

            status.textContent = 'Logging in...';
            status.classList.remove('hidden', 'error');
            status.classList.add('success');

            try {
                
                const response = await fetch(`${API_BASE}/api/auth/extension-login/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const payload = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(payload.error || payload.detail || 'Login failed.');
                }

                if (!payload.apiToken) {
                    throw new Error('Login succeeded but no token was returned.');
                }

                await setToken(payload.apiToken);
                status.textContent = 'Login successful.';
                status.classList.remove('error');
                status.classList.add('success');
                renderSaveForm(lastDetails);
            } catch (err) {
                console.error('Extension login failed:', err);
                status.textContent = err.message || 'Login failed. Please try again.';
                status.classList.remove('success');
                status.classList.add('error');
            }
        });

        detailsEl.appendChild(form);
        detailsEl.classList.remove('hidden');
        questionEl.classList.add('hidden');
        actionsEl.classList.add('hidden');
    }

    function buildPayload(details) {
        return {
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
            job_description: details.job_description || '',
        };
    }

    function renderSaveForm(details) {
        if (!details) return;

        const form = document.createElement('form');
        form.id = 'job-form';
        form.innerHTML = `
            <div class="field-row"><label>Company</label><input name="company_name" value="${(details.company_name || '').replace(/"/g, '&quot;')}" /></div>
            <div class="field-row"><label>Position</label><input name="job_title" value="${(details.job_title || '').replace(/"/g, '&quot;')}" /></div>
            <div class="field-row"><label>Location</label><input name="location" value="${(details.location || '').replace(/"/g, '&quot;')}" /></div>
            <div class="field-row"><label>Requisition ID</label><input name="requisition_id" value="${(details.requisition_id || '').replace(/"/g, '&quot;')}" /></div>
            <div class="field-row"><label>Employment Type</label><input name="employment_type" value="${(details.employment_type || '').replace(/"/g, '&quot;')}" /></div>
            <div class="field-row"><label>Work Mode</label><input name="work_mode" value="${(details.work_mode || '').replace(/"/g, '&quot;')}" /></div>
            <div class="field-row"><label>Posted Date</label><input name="posted_date" value="${(details.posted_date || '').replace(/"/g, '&quot;')}" /></div>
            <div class="field-row">
                <label>Status</label>
                <select name="status">
                    <option value="Applied" selected>Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            <div class="field-row"><label>Date Applied</label><input type="date" name="date_applied" value="${(details.date_applied || new Date().toISOString().slice(0, 10))}" /></div>
            <div class="field-row"><label>Notes</label><textarea name="notes" rows="3">${(details.notes || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea></div>
            <div class="inline-actions">
                <button type="submit" class="primary">Save</button>
                <button type="button" id="discard" class="secondary">Discard</button>
            </div>
            <div id="save-status" class="save-status hidden"></div>
        `;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const saveStatus = document.getElementById('save-status');
            const formData = new FormData(form);
            const base = buildPayload(details);
            const payload = {
                ...base,
                company: formData.get('company_name') || base.company,
                position: formData.get('job_title') || base.position,
                status: formData.get('status') || 'Applied',
                date_applied: formData.get('date_applied') || base.date_applied,
                notes: formData.get('notes') || base.notes,
                location: formData.get('location') || base.location,
                requisition_id: formData.get('requisition_id') || base.requisition_id,
                employment_type: formData.get('employment_type') || base.employment_type,
                work_mode: formData.get('work_mode') || base.work_mode,
                posted_date: formData.get('posted_date') || base.posted_date,
                job_url: details.url || base.job_url,
                job_description: details.job_description || base.job_description,
            };

            saveStatus.textContent = 'Saving...';
            saveStatus.classList.remove('hidden', 'error');
            saveStatus.classList.add('success');

            try {
                const token = await getToken();
                if (!token) {
                    renderLoginForm();
                    return;
                }

                const response = await fetch(`${API_BASE}/api/job-applications/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
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
                setTimeout(() => detailsEl.classList.add('hidden'), 1200);
            } catch (err) {
                console.error('Failed to save job application:', err);
                saveStatus.textContent = err.message || 'Save failed. Please try again.';
                saveStatus.classList.remove('success');
                saveStatus.classList.add('error');
            }
        });

        form.querySelector('#discard').addEventListener('click', () => {
            detailsEl.innerHTML = '<strong>Discarded.</strong> Job details were not saved.';
            detailsEl.classList.remove('hidden');
            questionEl.classList.add('hidden');
            actionsEl.classList.add('hidden');
        });

        detailsEl.innerHTML = '';
        detailsEl.appendChild(form);
        detailsEl.classList.remove('hidden');
    }

    function showSkip() {
        questionEl.classList.add('hidden');
        actionsEl.classList.add('hidden');
        detailsEl.innerHTML = '<strong>Skipped.</strong> No job details were added.';
        detailsEl.classList.remove('hidden');
    }

    function updateUI(resp) {
        lastDetails = resp || null;
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
                document.getElementById('confirm').onclick = () => renderSaveForm(resp);
                document.getElementById('cancel').onclick = () => showSkip();
                return;
            }

            chrome.tabs.sendMessage(tabId, { type: 'RUN_DETECTION' }, () => {
                setTimeout(() => {
                    chrome.runtime.sendMessage({ type: 'GET_LAST_DETECTION', tabId }, (newResp) => {
                        updateUI(newResp);
                        document.getElementById('confirm').onclick = () => renderSaveForm(newResp);
                        document.getElementById('cancel').onclick = () => showSkip();
                    });
                }, 300);
            });
        });
    });
});