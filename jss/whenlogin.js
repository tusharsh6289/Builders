document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const mobile = document.getElementById('mobile').value.trim();
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.mobile === mobile && u.password === password);

        if (user) {
            
            localStorage.setItem('currentUserMobile', user.mobile);

            alert('Login successful!');
            if (user.role === 'customer') {
                window.location.href = 'customer_login.html';
            } else if (user.role === 'mummy') {
                window.location.href = 'mummy_login.html';
            } else {
                alert('Unknown user role.');
            }
        } else {
            alert('Invalid mobile number or password. Please try again.');
        }
    });
});
