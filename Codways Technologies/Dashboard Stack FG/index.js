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
// TOAST
// =========================

function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.className = "";

    toast.classList.add(type);
    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

// =========================
// REGISTER
// =========================

registerForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const username = document
    .getElementById("registerName")
    .value
    .trim();

    const email = document
        .getElementById("registerEmail")
        .value
        .trim();

    const password = document
        .getElementById("registerPassword")
        .value
        .trim();

    if (!username || !email || !password) {
        showToast(
    "Please fill all fields",
    "error"
);
        return;
    }

let users = JSON.parse(
    localStorage.getItem("users")
) || [];

// Duplicate Username
const usernameExists = users.some(
    user => user.username === username
);

if (usernameExists) {

    showToast(
    "Username already exists",
    "error"
);
    return;

}

// Duplicate Email
const emailExists = users.some(
    user => user.email === email
);

if (emailExists) {

    showToast(
    "Email already registered",
    "error"
);
    return;

}

const user = {
    id: Date.now(),
    username,
    email,
    password,

    streak: 1,
    lastLoginDate:
        new Date().toDateString(),

    createdAt:
        new Date().toISOString()
};

users.push(user);

localStorage.setItem(
    "users",
    JSON.stringify(users)
);

showToast(
    "Registration Successful 🎉",
    "success"
);

registerForm.reset();

loginTab.click();

});

// =========================
// LOGIN
// =========================

loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const username = document
        .getElementById("loginUsername")
        .value
        .trim();

    const password = document
        .getElementById("loginPassword")
        .value
        .trim();

const users = JSON.parse(
    localStorage.getItem("users")
) || [];

// Demo Admin Login
if (
    username === "admin123" &&
    password === "admin@123"
) {

    const adminUser = {
    id: 0,
    username: "Krish Garg",
    email: "admin@example.com"
};

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(adminUser)
    );

    showToast(
        "Admin Login Successful 🎉",
        "success"
    );

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 1200);

    return;

}

// Registered Users Login
const savedUser = users.find(user =>
    user.username === username &&
    user.password === password
);

if (!savedUser) {

    showToast(
        "Invalid Username or Password",
        "error"
    );

    return;

}

const today = new Date().toDateString();

if (!savedUser.lastLoginDate) {

    savedUser.streak = 1;
    savedUser.lastLoginDate = today;
}

else {

    const oneDay = 1000 * 60 * 60 * 24;

    const diff = Math.floor(
        (new Date(today) -
        new Date(savedUser.lastLoginDate))
        / oneDay
    );

    if (diff === 1) {

        savedUser.streak =
            (savedUser.streak || 0) + 1;

        savedUser.lastLoginDate = today;
    }

    else if (diff > 1) {

        savedUser.streak = 1;
        savedUser.lastLoginDate = today;
    }
}

localStorage.setItem(
    "users",
    JSON.stringify(users)
);

localStorage.setItem(
    "isLoggedIn",
    "true"
);

localStorage.setItem(
    "loggedInUser",
    JSON.stringify(savedUser)
);

showToast(
    "Login Successful 🎉",
    "success"
);

setTimeout(() => {

    window.location.href = "dashboard.html";

}, 1200);

showToast(
    "Login Successful 🎉",
    "success"
);

localStorage.setItem(
    "isLoggedIn",
    "true"
);

localStorage.setItem(
    "loggedInUser",
    JSON.stringify(savedUser)
);

setTimeout(() => {

    window.location.href = "dashboard.html";

}, 1200);

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

});