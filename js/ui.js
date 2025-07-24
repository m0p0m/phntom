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
