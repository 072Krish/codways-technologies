document.addEventListener("DOMContentLoaded", () => {

    // ================= SIDEBAR TOGGLE =================

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const collapseBtn = document.querySelector(".collapse-btn");

    function toggleSidebarState() {
        sidebar.classList.toggle("hidden");
        mainContent.classList.toggle("expanded");
    }

    if (window.innerWidth <= 992) {
        sidebar.classList.add("hidden");
        mainContent.classList.add("expanded");
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            toggleSidebarState();
        });
    }

    if (collapseBtn) {
        collapseBtn.addEventListener("click", () => {
            if (window.innerWidth <= 992) {
                sidebar.classList.add("hidden");
                mainContent.classList.add("expanded");
            } else {
                toggleSidebarState();
            }
        });
    }

    // Resize Handle
    window.addEventListener("resize", () => {
        if (window.innerWidth > 992) {
            sidebar.classList.remove("hidden");
            mainContent.classList.remove("expanded");
        } else {
            sidebar.classList.add("hidden");
            mainContent.classList.add("expanded");
        }
    });
    // ================= DARK / LIGHT MODE =================

    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {

        // Load saved theme
        if (localStorage.getItem("theme") === "dark") {

            document.body.classList.add("dark-mode");

            const icon = themeToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            }
        }

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const icon = themeToggle.querySelector("i");

            if (document.body.classList.contains("dark-mode")) {

                localStorage.setItem("theme", "dark");

                if (icon) {
                    icon.classList.remove("fa-moon");
                    icon.classList.add("fa-sun");
                }

            } else {

                localStorage.setItem("theme", "light");

                if (icon) {
                    icon.classList.remove("fa-sun");
                    icon.classList.add("fa-moon");
                }
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // LOGIN CHECK
    // =========================

    const isLoggedIn =
        localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {

        window.location.href = "index.html";
        return;

    }

    // =========================
    // TOAST
    // =========================

    function showToast(message, type = "success") {

        const toast =
            document.getElementById("toast");

        if (!toast) return;

        toast.textContent = message;

        toast.className = "";

        toast.classList.add(type);

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

    }

    // =========================
    // LOCAL STORAGE
    // =========================

    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    let loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    if (!loggedInUser) {

        window.location.href = "index.html";

        return;

    }

    // =========================
    // INPUTS
    // =========================

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

    // =========================
    // PROFILE
    // =========================

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profilePreview =
        document.getElementById("profilePreview");

    const profileUpload =
        document.getElementById("profileUpload");

    // =========================
    // BUTTONS
    // =========================

    const saveBtn =
        document.getElementById("saveBtn");

    const cancelBtn =
        document.getElementById("cancelBtn");

    // =========================
    // LOAD USER DATA
    // =========================

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

    // =========================
    // PASSWORD TOGGLE
    // =========================

    const eyeIcons =
        document.querySelectorAll(".togglePassword");

    eyeIcons.forEach(icon => {

        icon.addEventListener("click", () => {

            const input =
                icon.previousElementSibling;

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove("fa-eye");

                icon.classList.add("fa-eye-slash");

            }

            else {

                input.type = "password";

                icon.classList.remove("fa-eye-slash");

                icon.classList.add("fa-eye");

            }

        });

    });
    // =========================
    // PROFILE IMAGE UPLOAD
    // =========================

    profileUpload.addEventListener("change", (e) => {

        const file = e.target.files[0];

        if (!file) return;

        // Image Validation
        if (!file.type.startsWith("image/")) {

            showToast(
                "Please select a valid image.",
                "error"
            );

            profileUpload.value = "";

            return;

        }

        // 5 MB Limit
        if (file.size > 5 * 1024 * 1024) {

            showToast(
                "Image size should be less than 5 MB.",
                "error"
            );

            profileUpload.value = "";

            return;

        }

        const reader = new FileReader();

        reader.onload = function () {

            const imageData = reader.result;

            // Live Preview
            profilePreview.src = imageData;

            // Update Current User
            loggedInUser.profileImage = imageData;

            // Update loggedInUser
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(loggedInUser)
            );

            // Update users[]
            const userIndex = users.findIndex(user =>
                user.id === loggedInUser.id
            );

            if (userIndex !== -1) {

                users[userIndex].profileImage = imageData;

                localStorage.setItem(
                    "users",
                    JSON.stringify(users)
                );

            }

            showToast(
                "Profile picture updated successfully."
            );

        };

        reader.readAsDataURL(file);

    });

    // =========================
    // REMOVE IMAGE (Optional)
    // Double Click Avatar
    // =========================

    profilePreview.addEventListener("dblclick", () => {

        if (!loggedInUser.profileImage) return;

        if (!confirm("Remove profile picture?")) {

            return;

        }

        profilePreview.src =
            "images/default-avatar.png";

        delete loggedInUser.profileImage;

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(loggedInUser)
        );

        const userIndex = users.findIndex(user =>
            user.id === loggedInUser.id
        );

        if (userIndex !== -1) {

            delete users[userIndex].profileImage;

            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );

        }

        showToast(
            "Profile picture removed."
        );

    });

        // =========================
    // SAVE CHANGES
    // =========================

    saveBtn.addEventListener("click", () => {

        // ---------- VALUES ----------

        const newUsername =
            username.value.trim();

        const newEmail =
            email.value.trim();

        const newFirstName =
            firstName.value.trim();

        const newLastName =
            lastName.value.trim();

        const newPhone =
            phone.value.trim();

        const newDob =
            dob.value;

        const newInstitution =
            institution.value.trim();

        const newEducation =
            educationLevel.value;

        const newCourse =
            currentCourse.value.trim();

        const newSkills =
            skills.value.trim();

        const newCareerGoal =
            careerGoal.value.trim();

        const oldUsername =
            loggedInUser.username;

        const oldPassword =
            loggedInUser.password;

        let usernameChanged = false;

        let passwordChanged = false;

        let personalChanged = false;

        let academicChanged = false;

        // =========================
        // REQUIRED CHECK
        // =========================

        if (!newUsername) {

            showToast(
                "Username is required.",
                "error"
            );

            username.focus();

            return;

        }

        if (!newEmail) {

            showToast(
                "Email is required.",
                "error"
            );

            email.focus();

            return;

        }

        // =========================
        // DUPLICATE USERNAME
        // =========================

        if (newUsername !== oldUsername) {

            const usernameExists =
                users.some(user =>

                    user.username === newUsername &&
                    user.id !== loggedInUser.id

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

        // =========================
        // PERSONAL INFO
        // =========================

        if (

            newFirstName !== (loggedInUser.firstName || "") ||

            newLastName !== (loggedInUser.lastName || "") ||

            newPhone !== (loggedInUser.phone || "") ||

            newDob !== (loggedInUser.dob || "")

        ) {

            personalChanged = true;

        }

        // =========================
        // ACADEMIC INFO
        // =========================

        if (

            newInstitution !== (loggedInUser.institution || "") ||

            newEducation !== (loggedInUser.educationLevel || "") ||

            newCourse !== (loggedInUser.currentCourse || "") ||

            newSkills !== (loggedInUser.skills || "") ||

            newCareerGoal !== (loggedInUser.careerGoal || "")

        ) {

            academicChanged = true;

        }

        // =========================
        // PASSWORD VALIDATION
        // =========================

        if (

            currentPassword.value ||

            newPassword.value ||

            confirmPassword.value

        ) {

            if (

                currentPassword.value !== oldPassword

            ) {

                showToast(
                    "Current password is incorrect.",
                    "error"
                );

                return;

            }

            if (

                newPassword.value.length < 6

            ) {

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

            passwordChanged = true;

        }

        // =========================
        // UPDATE CURRENT USER
        // =========================

        loggedInUser.username =
            newUsername;

        loggedInUser.email =
            newEmail;

        loggedInUser.firstName =
            newFirstName;

        loggedInUser.lastName =
            newLastName;

        loggedInUser.phone =
            newPhone;

        loggedInUser.dob =
            newDob;

        loggedInUser.institution =
            newInstitution;

        loggedInUser.educationLevel =
            newEducation;

        loggedInUser.currentCourse =
            newCourse;

        loggedInUser.skills =
            newSkills;

        loggedInUser.careerGoal =
            newCareerGoal;

        if (passwordChanged) {

            loggedInUser.password =
                newPassword.value;

        }
                // =========================
        // UPDATE USERS ARRAY
        // =========================

        const userIndex = users.findIndex(user =>
            user.id === loggedInUser.id
        );

        if (userIndex !== -1) {

            users[userIndex] = {

                ...users[userIndex],

                ...loggedInUser

            };

        }

        // =========================
        // SAVE TO LOCAL STORAGE
        // =========================

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(loggedInUser)
        );

        // =========================
        // UPDATE PROFILE CARD
        // =========================

        profileName.textContent =
            loggedInUser.username;

        profileEmail.textContent =
            loggedInUser.email;

        // =========================
        // CLEAR PASSWORD FIELDS
        // =========================

        currentPassword.value = "";

        newPassword.value = "";

        confirmPassword.value = "";

        // =========================
        // SMART TOASTS
        // =========================

        if (

            usernameChanged &&
            passwordChanged

        ) {

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

        else if (

            personalChanged &&
            academicChanged

        ) {

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

    // =========================
    // CANCEL / RESET
    // =========================

    cancelBtn.addEventListener("click", () => {

        loadUserData();

        currentPassword.value = "";

        newPassword.value = "";

        confirmPassword.value = "";

        showToast(
            "Changes discarded."
        );

    });

});