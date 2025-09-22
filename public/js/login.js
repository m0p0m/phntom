document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = loginForm.username.value;
            const password = loginForm.password.value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();

                if (res.ok) {
                    // Set token in a cookie that expires in 1 day
                    const d = new Date();
                    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
                    const expires = "expires=" + d.toUTCString();
                    document.cookie = "token=" + data.token + ";" + expires + ";path=/";
                    window.location.href = '/dashboard';
                } else {
                    errorMessage.textContent = data.message || 'Login failed';
                }
            } catch (err) {
                errorMessage.textContent = 'An error occurred. Please try again.';
            }
        });
    }
});
