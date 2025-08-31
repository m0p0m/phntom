export function showLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'flex';
}

export function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
}

export function showApp() {
    document.getElementById('app').style.display = 'block';
}

export function showLogin() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('gallery-section').style.display = 'none';
}

export function showGallery() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('gallery-section').style.display = 'block';
}

export function showUserDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'block';
}

export function showSubscriptionModal() {
    document.getElementById('subscription-modal').style.display = 'block';
}

export function hideSubscriptionModal() {
    document.getElementById('subscription-modal').style.display = 'none';
}

export function showAdminPanel() {
    document.getElementById('admin-panel').style.display = 'block';
}

export function renderSubscriptions(subscriptions, onApprove, onReject) {
    const subscriptionsList = document.getElementById('subscriptions-list');
    subscriptionsList.innerHTML = '';
    subscriptions.forEach(sub => {
        const item = document.createElement('div');
        item.classList.add('subscription-item');
        item.innerHTML = `
            <div>
                <p>User ID: ${sub.userId}</p>
                <p>Status: ${sub.status}</p>
                <a href="/${sub.paymentProof}" target="_blank">View Proof</a>
            </div>
            <div>
                <button class="approve-btn">Approve</button>
                <button class="reject-btn">Reject</button>
            </div>
        `;
        item.querySelector('.approve-btn').addEventListener('click', () => onApprove(sub.id));
        item.querySelector('.reject-btn').addEventListener('click', () => onReject(sub.id));
        subscriptionsList.appendChild(item);
    });
}

export function renderLinks(links, onEdit, onDelete) {
    const linksList = document.getElementById('links-list');
    linksList.innerHTML = '';
    links.forEach(link => {
        const item = document.createElement('div');
        item.classList.add('link-item');
        item.innerHTML = `
            <div>
                <p>${link.title}</p>
                <p>${link.url}</p>
            </div>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        item.querySelector('.edit-btn').addEventListener('click', () => onEdit(link));
        item.querySelector('.delete-btn').addEventListener('click', () => onDelete(link.id));
        linksList.appendChild(item);
    });
}

export function renderUserLinks(links) {
    const linksContainer = document.getElementById('links-container');
    linksContainer.innerHTML = '<h3>Available Links:</h3>';
    links.forEach(link => {
        const linkEl = document.createElement('a');
        linkEl.href = link.url;
        linkEl.textContent = link.title;
        linkEl.target = '_blank';
        linksContainer.appendChild(linkEl);
    });
}

export function renderImages(images) {
    const imageGrid = document.getElementById('image-grid');
    imageGrid.innerHTML = '';

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.onload = () => {
                    img.classList.add('loaded');
                };
                observer.unobserve(img);
            }
        });
    });

    images.forEach(image => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');

        const img = document.createElement('img');
        img.dataset.src = image.thumbnailUrl;
        img.dataset.fullUrl = image.fullUrl;
        img.classList.add('lazy');

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const downloadButton = document.createElement('button');
        downloadButton.innerText = 'Download';
        downloadButton.addEventListener('click', () => {
            window.open(image.fullUrl, '_blank');
        });

        overlay.appendChild(downloadButton);
        imgContainer.appendChild(img);
        imgContainer.appendChild(overlay);
        imageGrid.appendChild(imgContainer);

        observer.observe(img);
    });
}
