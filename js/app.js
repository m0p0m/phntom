import * as ui from './ui.js';
import * as api from './api.js';

window.addEventListener('load', () => {
    ui.showLoadingScreen();
    // Simulate a loading delay
    setTimeout(() => {
        ui.hideLoadingScreen();
        ui.showApp();
        ui.showLogin();
    }, 1500);

    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            await api.login(username, password);
            ui.showGallery();
            api.connectToServer();
            const images = await api.getImages();
            ui.renderImages(images);
        } catch (error) {
            alert(error);
        }
    });
});
