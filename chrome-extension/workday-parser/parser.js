const FIELD_SELECTORS = {
    job_title: ['[data-automation-id="jobPostingHeader"]', '#jobPostingHeader', 'h1'],
    company_name: ['[data-automation-id="companyName"]', '#companyName', '[data-automation-id="company"]', '#company'],
    location: ['[data-automation-id="locations"]', '#locations', '[data-automation-id="location"]', '#location'],
    requisition_id: ['[data-automation-id="requisitionId"]', '#requisitionId'],
    employment_type: ['[data-automation-id="time"]', '#time', '[data-automation-id="employmentType"]', '#employmentType'],
    posted_date: ['[data-automation-id="postedOn"]', '#postedOn'],
    work_mode: ['[data-automation-id="remoteType"]', '#remoteType', '[data-automation-id="workArrangement"]', '#workArrangement']
};

function clean(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
}

function normalize(value) {
    let text = clean(value);
    const prefixes = [
        'job title',
        'company',
        'location',
        'locations',
        'job requisition id',
        'requisition id',
        'time type',
        'employment type',
        'posted on',
        'remote type',
        'work arrangement',
        'work location',
        'work mode'
    ];

    for (const prefix of prefixes) {
        if (text.toLowerCase().startsWith(prefix + ' ')) {
            text = text.slice(prefix.length).trim();
        }
    }

    return clean(text);
}

function read(selector) {
    const el = document.querySelector(selector);
    return clean(el ? (el.innerText || el.textContent || '') : '');
}

function firstMatch(selectors) {
    for (const selector of selectors) {
        const value = read(selector);
        if (value) return normalize(value);
    }
    return '';
}

function cleanCompany(value) {
    let text = normalize(value);
    if (!text) return '';

    text = text.replace(/^At\s+/i, '');
    text = text.replace(/\/careers\/.*$/i, '');
    text = text.replace(/\s+(?:benefits|please note|equal employment|life at|about us|careers)\b.*$/i, '');
    text = text.replace(/\s*[|–-]\s*.*$/, '');

    return clean(text);
}

function extractCompanyName() {
    const direct = firstMatch(FIELD_SELECTORS.company_name);
    if (direct) return cleanCompany(direct);

    const bodyText = clean(document.body ? (document.body.innerText || '') : '');
    const match = bodyText.match(/At\s+([A-Z][A-Za-z0-9&.\- ]{1,40})\s*,/i);
    if (match) return cleanCompany(match[1]);

    const host = (window.location.hostname || '').toLowerCase();
    const candidate = host
        .split('.')
        .filter(Boolean)
        .find((part) => !['workday', 'workdayjobs', 'myworkdayjobs', 'myworkday', 'com', 'net', 'org', 'io'].includes(part));

    if (candidate) return cleanCompany(candidate.replace(/[-_]/g, ' '));

    return '';
}

function hasJobDetailDom() {
    return !!document.getElementById('job-posting-details') ||
        !!document.getElementById('jobPostingHeader') ||
        !!document.getElementById('requisitionId') ||
        !!document.querySelector('[data-automation-id="jobPostingHeader"]');
}

function extractJobDetails() {
    if (!hasJobDetailDom()) {
        return {
            job_title: '',
            company_name: '',
            location: '',
            requisition_id: '',
            employment_type: '',
            posted_date: '',
            work_mode: ''
        };
    }

    return {
        job_title: firstMatch(FIELD_SELECTORS.job_title),
        company_name: extractCompanyName(),
        location: firstMatch(FIELD_SELECTORS.location),
        requisition_id: firstMatch(FIELD_SELECTORS.requisition_id),
        employment_type: firstMatch(FIELD_SELECTORS.employment_type),
        posted_date: firstMatch(FIELD_SELECTORS.posted_date),
        work_mode: firstMatch(FIELD_SELECTORS.work_mode)
    };
}