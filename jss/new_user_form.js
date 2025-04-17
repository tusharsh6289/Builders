document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const steps = Array.from(signupForm.querySelectorAll('.form-step'));
    const nextButtons = signupForm.querySelectorAll('.next-step');
    const prevButtons = signupForm.querySelectorAll('.prev-step');
    let currentStepIndex = 0;

    
    const termsModal = document.getElementById('terms-modal');
    const agreeButton = document.getElementById('agree-button');
    const termsAgree = document.getElementById('terms-agree');
    const closeBtn = document.querySelector('.close');

    function showStep(index) {
        steps.forEach((step, i) => step.classList.toggle('active-step', i === index));
        currentStepIndex = index;
        document.querySelector('.signup-form-column').scrollTop = 0;
    }

    function validateStep(index) {
        switch (index) {
            case 0:
                return document.getElementById('first-name').value.trim() !== '';
            case 1:
                return (
                    document.getElementById('birth-month').value &&
                    document.getElementById('birth-day').value &&
                    document.getElementById('birth-year').value &&
                    document.getElementById('gender').value
                );
            case 2:
                return (
                    /^[0-9]{10}$/.test(document.getElementById('mobile').value.trim()) &&
                    document.getElementById('otp').value.trim() !== ''
                );
            case 3:
                return true;
            case 4:
                const pass = document.getElementById('password').value;
                const confirmPass = document.getElementById('confirm-password').value;
                return pass && confirmPass && pass === confirmPass && pass.length >= 6;
            case 5:
                return (
                    document.getElementById('role').value &&
                    document.getElementById('address').value.trim() !== '' &&
                    /^[0-9]{6}$/.test(document.getElementById('pincode').value.trim())
                );
            default:
                return false;
        }
    }

    termsAgree.addEventListener('change', () => {
        agreeButton.disabled = !termsAgree.checked;
    });

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!validateStep(currentStepIndex)) {
                alert('Please fill all required fields correctly.');
                return;
            }
            if (currentStepIndex === 5 && document.getElementById('role').value === 'mummy' && !termsModal.classList.contains('shown')) {
                termsModal.style.display = 'block';
                termsModal.classList.add('shown');
                return;
            }
            if (currentStepIndex < steps.length - 1) {
                showStep(currentStepIndex + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStepIndex > 0) showStep(currentStepIndex - 1);
        });
    });

    agreeButton.addEventListener('click', () => {
        if (termsAgree.checked) {
            termsModal.style.display = 'none';
            showStep(currentStepIndex + 1);
        }
    });

    closeBtn.addEventListener('click', () => {
        termsModal.style.display = 'none';
        termsAgree.checked = false;
        agreeButton.disabled = true;
    });

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateStep(currentStepIndex)) {
            alert('Please fill all required fields correctly.');
            return;
        }

        const profilePicInput = document.getElementById('profile-picture');
        const avatarSelect = document.getElementById('common-avatar');

        function saveUser(profilePicDataUrl) {
            const role = document.getElementById('role').value;
            const user = {
                firstName: document.getElementById('first-name').value.trim(),
                lastName: document.getElementById('last-name').value.trim() || '',
                birthDate: `${document.getElementById('birth-year').value}-${document.getElementById('birth-month').value}-${document.getElementById('birth-day').value}`,
                gender: document.getElementById('gender').value,
                mobile: document.getElementById('mobile').value.trim(),
                profilePicture: profilePicDataUrl || avatarSelect.value || "resources/images1/avatar1.png",
                password: document.getElementById('password').value,
                role: role,
                address: document.getElementById('address').value.trim(),
                pincode: document.getElementById('pincode').value.trim(),
                ...(role === 'mummy'
                    ? {
                        menu: [],
                        earningsToday: 0,
                        earningsWeek: 0,
                        earningsLifetime: 0,
                        mealLimit: 20,
                        mealsLeft: 20,
                        rating: 4.5,
                        totalMeals: 0,
                        closingTimeTomorrow: "8:00 PM",
                        maxOrdersTomorrow: 10
                    }
                    : {
                        favorites: [],
                        cart: []
                    })
            };

            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUserMobile', user.mobile);
            alert('Registration completed!');
            window.location.href = role === 'mummy' ? 'mummy_login.html' : 'customer_login.html';
        }

        if (profilePicInput && profilePicInput.files && profilePicInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (event) {
                saveUser(event.target.result);
            };
            reader.readAsDataURL(profilePicInput.files[0]);
        } else {
            saveUser(null);
        }
    });

    showStep(0);
});
