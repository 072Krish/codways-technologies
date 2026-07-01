document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // SIDEBAR
    // ==========================================

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const collapseBtn = document.querySelector(".collapse-btn");

    function toggleSidebar() {

        sidebar.classList.toggle("hidden");
        mainContent.classList.toggle("expanded");

    }

    if (window.innerWidth <= 992) {

        sidebar.classList.add("hidden");
        mainContent.classList.add("expanded");

    }

    menuToggle?.addEventListener("click", toggleSidebar);

    collapseBtn?.addEventListener("click", () => {

        if (window.innerWidth <= 992) {

            sidebar.classList.add("hidden");
            mainContent.classList.add("expanded");

        } else {

            toggleSidebar();

        }

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 992) {

            sidebar.classList.remove("hidden");
            mainContent.classList.remove("expanded");

        } else {

            sidebar.classList.add("hidden");
            mainContent.classList.add("expanded");

        }

    });

    // ==========================================
    // THEME
    // ==========================================

    const themeToggle =
        document.getElementById("themeToggle");

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle?.querySelector("i")
            ?.classList.replace("fa-moon", "fa-sun");

    }

    themeToggle?.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const icon =
            themeToggle.querySelector("i");

        if (document.body.classList.contains("dark-mode")) {

            localStorage.setItem("theme", "dark");

            icon.classList.replace("fa-moon", "fa-sun");

        } else {

            localStorage.setItem("theme", "light");

            icon.classList.replace("fa-sun", "fa-moon");

        }

    });

    // ==========================================
    // LOGIN CHECK
    // ==========================================

    if (localStorage.getItem("isLoggedIn") !== "true") {

        window.location.href = "index.html";

        return;

    }

    // ==========================================
    // LOCAL STORAGE
    // ==========================================

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    let loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {

        window.location.href = "index.html";

        return;

    }

    // ==========================================
    // DOM ELEMENTS
    // ==========================================

    const profilePreview =
        document.getElementById("profilePreview");

    const profileUpload =
        document.getElementById("profileUpload");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const firstName =
        document.getElementById("firstName");

    const lastName =
        document.getElementById("lastName");

    const username =
        document.getElementById("username");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const dob =
        document.getElementById("dob");

    const institution =
        document.getElementById("institution");

    const educationLevel =
        document.getElementById("educationLevel");

    const currentCourse =
        document.getElementById("currentCourse");

    const skills =
        document.getElementById("skills");

    const careerGoal =
        document.getElementById("careerGoal");

    const currentPassword =
        document.getElementById("currentPassword");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const saveBtn =
        document.getElementById("saveBtn");

    const cancelBtn =
        document.getElementById("cancelBtn");

    // ==========================================
    // HELPERS
    // ==========================================

    function saveUsers() {

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }

    function saveCurrentUser() {

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(loggedInUser)
        );

    }

    function getUserIndex() {

        return users.findIndex(user =>
            user.id === loggedInUser.id
        );

    }

    function showToast(message, type = "success") {

        const toast =
            document.getElementById("toast");

        if (!toast) return;

        toast.textContent = message;

        toast.className = "toast";

        toast.classList.add(type);

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

    }

        // ==========================================
    // LOAD USER DATA
    // ==========================================

    function loadUserData() {

        profileName.textContent =
            loggedInUser.username || "";

        profileEmail.textContent =
            loggedInUser.email || "";

        username.value =
            loggedInUser.username || "";

        email.value =
            loggedInUser.email || "";

        firstName.value =
            loggedInUser.firstName || "";

        lastName.value =
            loggedInUser.lastName || "";

        phone.value =
            loggedInUser.phone || "";

        dob.value =
            loggedInUser.dob || "";

        institution.value =
            loggedInUser.institution || "";

        educationLevel.value =
            loggedInUser.educationLevel || "";

        currentCourse.value =
            loggedInUser.currentCourse || "";

        skills.value =
            loggedInUser.skills || "";

        careerGoal.value =
            loggedInUser.careerGoal || "";

        if (loggedInUser.profileImage) {

            profilePreview.src =
                loggedInUser.profileImage;

        }

    }

    loadUserData();

    // ==========================================
    // PASSWORD TOGGLE
    // ==========================================

    document
        .querySelectorAll(".togglePassword")
        .forEach(icon => {

            icon.addEventListener("click", () => {

                const input =
                    icon.previousElementSibling;

                if (input.type === "password") {

                    input.type = "text";

                    icon.classList.replace(
                        "fa-eye",
                        "fa-eye-slash"
                    );

                } else {

                    input.type = "password";

                    icon.classList.replace(
                        "fa-eye-slash",
                        "fa-eye"
                    );

                }

            });

        });

    // ==========================================
    // PROFILE IMAGE UPLOAD
    // ==========================================

    profileUpload?.addEventListener("change", e => {

        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            showToast(
                "Please select a valid image.",
                "error"
            );

            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            showToast(
                "Image size should be less than 5 MB.",
                "error"
            );

            return;

        }

        const reader = new FileReader();

        reader.onload = () => {

            const image = reader.result;

            profilePreview.src = image;

            loggedInUser.profileImage = image;

            const index = getUserIndex();

            if (index !== -1) {

                users[index].profileImage = image;

            }

            saveUsers();

            saveCurrentUser();

            showToast(
                "Profile picture updated successfully."
            );

        };

        reader.readAsDataURL(file);

    });

    // ==========================================
    // REMOVE PROFILE IMAGE
    // ==========================================

    profilePreview?.addEventListener("dblclick", () => {

        if (!loggedInUser.profileImage) return;

        if (!confirm("Remove profile picture?")) {

            return;

        }

        profilePreview.src =
            "https://api.dicebear.com/7.x/initials/svg?seed=" +
            encodeURIComponent(loggedInUser.username);

        delete loggedInUser.profileImage;

        const index = getUserIndex();

        if (index !== -1) {

            delete users[index].profileImage;

        }

        saveUsers();

        saveCurrentUser();

        showToast(
            "Profile picture removed."
        );

    });

        // ==========================================
    // SAVE CHANGES
    // ==========================================

    saveBtn?.addEventListener("click", () => {

        const newData = {

            firstName: firstName.value.trim(),

            lastName: lastName.value.trim(),

            username: username.value.trim(),

            email: email.value.trim(),

            phone: phone.value.trim(),

            dob: dob.value,

            institution: institution.value.trim(),

            educationLevel: educationLevel.value,

            currentCourse: currentCourse.value.trim(),

            skills: skills.value.trim(),

            careerGoal: careerGoal.value.trim()

        };

        let usernameChanged = false;
        let emailChanged = false;
        let passwordChanged = false;
        let personalChanged = false;
        let academicChanged = false;

        // ==========================
        // REQUIRED
        // ==========================

        if (!newData.username) {

            showToast(
                "Username is required.",
                "error"
            );

            username.focus();

            return;

        }

        if (!newData.email) {

            showToast(
                "Email is required.",
                "error"
            );

            email.focus();

            return;

        }

        const index = getUserIndex();

        // ==========================
        // DUPLICATE USERNAME
        // ==========================

        if (newData.username !== loggedInUser.username) {

            const usernameExists =
                users.some((user, i) =>

                    i !== index &&
                    user.username.toLowerCase() ===
                    newData.username.toLowerCase()

                );

            if (usernameExists) {

                showToast(
                    "Username already exists.",
                    "error"
                );

                return;

            }

            usernameChanged = true;

        }

        // ==========================
        // DUPLICATE EMAIL
        // ==========================

        if (newData.email !== loggedInUser.email) {

            const emailExists =
                users.some((user, i) =>

                    i !== index &&
                    user.email.toLowerCase() ===
                    newData.email.toLowerCase()

                );

            if (emailExists) {

                showToast(
                    "Email already registered.",
                    "error"
                );

                return;

            }

            emailChanged = true;

        }

        // ==========================
        // PERSONAL INFO
        // ==========================

        if (

            newData.firstName !==
            (loggedInUser.firstName || "") ||

            newData.lastName !==
            (loggedInUser.lastName || "") ||

            newData.phone !==
            (loggedInUser.phone || "") ||

            newData.dob !==
            (loggedInUser.dob || "")

        ) {

            personalChanged = true;

        }

        // ==========================
        // ACADEMIC INFO
        // ==========================

        if (

            newData.institution !==
            (loggedInUser.institution || "") ||

            newData.educationLevel !==
            (loggedInUser.educationLevel || "") ||

            newData.currentCourse !==
            (loggedInUser.currentCourse || "") ||

            newData.skills !==
            (loggedInUser.skills || "") ||

            newData.careerGoal !==
            (loggedInUser.careerGoal || "")

        ) {

            academicChanged = true;

        }

        // ==========================
        // PASSWORD CHANGE
        // ==========================

        if (

            currentPassword.value ||
            newPassword.value ||
            confirmPassword.value

        ) {

            if (

                currentPassword.value !==
                loggedInUser.password

            ) {

                showToast(
                    "Current password is incorrect.",
                    "error"
                );

                return;

            }

            if (newPassword.value.length < 6) {

                showToast(
                    "Password must be at least 6 characters.",
                    "error"
                );

                return;

            }

            if (

                newPassword.value !==
                confirmPassword.value

            ) {

                showToast(
                    "Passwords do not match.",
                    "error"
                );

                return;

            }

            loggedInUser.password =
                newPassword.value;

            passwordChanged = true;

        }

        // ==========================
        // UPDATE USER OBJECT
        // ==========================

        Object.assign(
            loggedInUser,
            newData
        );

        if (index !== -1) {

            users[index] = {

                ...users[index],

                ...loggedInUser

            };

        }

        saveUsers();

        saveCurrentUser();

        profileName.textContent =
            loggedInUser.username;

        profileEmail.textContent =
            loggedInUser.email;

        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

                // ==========================================
        // SMART TOASTS
        // ==========================================

        if (usernameChanged && passwordChanged) {

            showToast(
                "Username and password updated successfully."
            );

        }

        else if (usernameChanged) {

            showToast(
                "Username updated successfully."
            );

        }

        else if (passwordChanged) {

            showToast(
                "Password updated successfully."
            );

        }

        else if (emailChanged) {

            showToast(
                "Email updated successfully."
            );

        }

        else if (personalChanged && academicChanged) {

            showToast(
                "Profile updated successfully."
            );

        }

        else if (personalChanged) {

            showToast(
                "Personal information updated."
            );

        }

        else if (academicChanged) {

            showToast(
                "Academic information updated."
            );

        }

        else {

            showToast(
                "No changes to save.",
                "error"
            );

        }

    });

    // ==========================================
    // CANCEL
    // ==========================================

    cancelBtn?.addEventListener("click", () => {

        loadUserData();

        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

        showToast(
            "Changes discarded."
        );

    });

});