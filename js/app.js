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
            const user = await api.login(username, password);
            sessionStorage.setItem('user', JSON.stringify(user));
            ui.showUserDashboard();

            if (user.isAdmin) {
                ui.showAdminPanel();
                loadAdminData();
            }

            if (user.subscription.active) {
                const links = await api.getLinks(user.id);
                ui.renderUserLinks(links);
            }
        } catch (error) {
            alert(error);
        }
    });

    const adminTabs = document.querySelectorAll('.tab-btn');
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.tab-btn.active').classList.remove('active');
            tab.classList.add('active');
            document.querySelector('.tab-content.active').classList.remove('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });

    async function loadAdminData() {
        const subscriptions = await api.getSubscriptions();
        ui.renderSubscriptions(subscriptions, approveSubscription, rejectSubscription);
        const links = await api.getLinks();
        ui.renderLinks(links, editLink, deleteLink);
    }

    async function approveSubscription(id) {
        await api.updateSubscriptionStatus(id, 'approved');
        loadAdminData();
    }

    async function rejectSubscription(id) {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            await api.updateSubscriptionStatus(id, 'rejected', reason);
            loadAdminData();
        }
    }

    const linkForm = document.getElementById('link-form');
    linkForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('link-id').value;
        const title = document.getElementById('link-title').value;
        const url = document.getElementById('link-url').value;
        if (id) {
            await api.updateLink(id, title, url);
        } else {
            await api.addLink(title, url);
        }
        linkForm.reset();
        loadAdminData();
    });

    function editLink(link) {
        document.getElementById('link-id').value = link.id;
        document.getElementById('link-title').value = link.title;
        document.getElementById('link-url').value = link.url;
    }

    async function deleteLink(id) {
        if (confirm('Are you sure you want to delete this link?')) {
            await api.deleteLink(id);
            loadAdminData();
        }
    }

    const buySubscriptionBtn = document.getElementById('buy-subscription-btn');
    buySubscriptionBtn.addEventListener('click', () => {
        ui.showSubscriptionModal();
    });

    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        ui.hideSubscriptionModal();
    });

    const subscriptionForm = document.getElementById('subscription-form');
    subscriptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const paymentProof = document.getElementById('payment-proof').files[0];
        const user = JSON.parse(sessionStorage.getItem('user'));
        try {
            await api.subscribe(user.id, paymentProof);
            alert('Subscription request submitted successfully!');
            ui.hideSubscriptionModal();
        } catch (error) {
            alert(error);
        }
    });
});
