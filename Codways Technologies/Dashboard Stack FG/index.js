document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // TAB SWITCHING
    // =========================

    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    loginTab.addEventListener("click", () => {

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        loginForm.classList.add("active-form");
        registerForm.classList.remove("active-form");

    });

    registerTab.addEventListener("click", () => {

        registerTab.classList.add("active");
        loginTab.classList.remove("active");

        registerForm.classList.add("active-form");
        loginForm.classList.remove("active-form");

    });

    // =========================
    // REGISTER
    // =========================

    registerForm.addEventListener("submit", (e) => {

        e.preventDefault();

        alert("Registration Successful!");

        registerForm.reset();

        loginTab.click();

    });

    // =========================
    // LOGIN
    // =========================

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const username =
            document.getElementById("loginUsername").value.trim();

        const password =
            document.getElementById("loginPassword").value.trim();

        if (
            username === "admin123" &&
            password === "admin@123"
        ) {

            alert("Login Successful!");

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            window.location.href = "dashboard.html";

        } else {

            alert(
                "Invalid Username or Password\n\nUsername: admin123\nPassword: admin@123"
            );

        }
    });

});

// PASSWORD TOGGLE

const eyeIcons = document.querySelectorAll(".password-box i");

eyeIcons.forEach(icon => {

    icon.addEventListener("click", () => {

        const input = icon.previousElementSibling;

        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

});