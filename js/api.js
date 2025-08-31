export async function login(username, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

export async function subscribe(userId, paymentProof) {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('paymentProof', paymentProof);

    const response = await fetch('/api/subscribe', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
}

export async function getSubscriptions() {
    const response = await fetch('/api/subscriptions');
    return response.json();
}

export async function updateSubscriptionStatus(id, status, rejectionReason) {
    const response = await fetch(`/api/subscriptions/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
}

export async function getLinks(userId) {
    let url = '/api/links';
    if (userId) {
        url += `?userId=${userId}`;
    }
    const response = await fetch(url);
    if(response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.error);
    }
}

export async function addLink(title, url) {
    const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
}

export async function updateLink(id, title, url) {
    const response = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
}

export async function deleteLink(id) {
    const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
}

export function getImages() {
    // Mock image data
    return Promise.resolve([]);
}
