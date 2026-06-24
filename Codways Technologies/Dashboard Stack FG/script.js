document.addEventListener("DOMContentLoaded", () => {

// ================= SIDEBAR TOGGLE =================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector(".main-content");
const collapseBtn = document.querySelector(".collapse-btn");

// Mobile & Tablet → hidden by default
if (window.innerWidth <= 992) {
    sidebar.classList.add("hidden");
}

// Hamburger Toggle
if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("hidden");

    });

}

// Collapse Button
if (collapseBtn) {

    collapseBtn.addEventListener("click", () => {

        if (window.innerWidth <= 992) {

            // Mobile & Tablet → Close Sidebar
            sidebar.classList.add("hidden");

        } else {

            // Desktop → Collapse Sidebar
            sidebar.classList.toggle("collapsed");

        }

    });

}

// Resize Handle
window.addEventListener("resize", () => {

    if (window.innerWidth > 992) {

        sidebar.classList.remove("hidden");

    } else {

        sidebar.classList.add("hidden");

        // Mobile par collapsed mode remove
        sidebar.classList.remove("collapsed");

    }

});

    // ================= MODAL =================

    const modal = document.getElementById("taskModal");
    const openBtn = document.getElementById("openTaskModal");
    const saveBtn = document.getElementById("saveTask");
    const closeBtn = document.getElementById("closeModal");

    openBtn.addEventListener("click", () => {
        modal.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // ================= DATE FORMAT =================

    function formatDate(inputDate) {

        if (!inputDate) return "";

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const d = new Date(inputDate);

        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    // ================= COUNTS =================

    function updateCounts() {

        document.getElementById("pendingCount").textContent =
            document.querySelectorAll("#pendingTasks .task-card").length;

        document.getElementById("progressCount").textContent =
            document.querySelectorAll("#progressTasks .task-card").length;

        document.getElementById("completedCount").textContent =
            document.querySelectorAll("#completedTasks .task-card").length;
    }

    // ================= RECENT ACTIVITY =================

    function addActivity(message) {

        const activityList = document.getElementById("activityList");

        if (!activityList) return;

        const activity = document.createElement("div");

        activity.classList.add("activity-item");

        activity.innerHTML = `
            <div class="activity-icon green-bg">
                ✓
            </div>

            <div class="activity-content">
                <h4>${message}</h4>
                <span>Just now</span>
            </div>
        `;

        activityList.prepend(activity);
    }

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

    // ================= INITIAL COUNTS =================

    updateCounts();

    // ================= SAVE TASK =================

    saveBtn.addEventListener("click", () => {

        let name = document.getElementById("taskName").value.trim();
        let date = document.getElementById("taskDate").value;
        let label = document.getElementById("taskLabel").value;
        let category = document.getElementById("taskCategory").value;

        if (name === "") {
            alert("Please enter task name");
            return;
        }

        let isCompleted = (category === "completed");

        let html =
            `<div class="task-card ${isCompleted ? "completed" : ""}">
                <h4>${name}</h4>

                <div class="task-footer">

                    <span class="priority ${label}">
                        ${label.charAt(0).toUpperCase() + label.slice(1)}
                    </span>

                    <span class="date">
                        ${formatDate(date)}
                    </span>

                </div>
            </div>`;

        if (category === "pending") {

            document
                .getElementById("pendingTasks")
                .insertAdjacentHTML("beforeend", html);

        } else if (category === "progress") {

            document
                .getElementById("progressTasks")
                .insertAdjacentHTML("beforeend", html);

        } else {

            document
                .getElementById("completedTasks")
                .insertAdjacentHTML("beforeend", html);
        }

        // ================= RECENT ACTIVITY MESSAGE =================

        let activityMessage = "";

        if (category === "pending") {
            activityMessage = `Task "${name}" added`;
        }
        else if (category === "progress") {
            activityMessage = `Task "${name}" in progress`;
        }
        else if (category === "completed") {
            activityMessage = `Task "${name}" completed`;
        }

        addActivity(activityMessage);

        // ================= RESET FORM =================

        document.getElementById("taskName").value = "";
        document.getElementById("taskDate").value = "";
        document.getElementById("taskLabel").value = "high";
        document.getElementById("taskCategory").value = "pending";

        // ================= RECENT ACTIVITY =================

        function addActivity(message) {

            const activityList = document.getElementById("activityList");

            if (!activityList) return;

            const activity = document.createElement("div");

            activity.classList.add("activity-item");

            activity.innerHTML = `
        <div class="activity-icon green-bg">
            ✓
        </div>

        <div class="activity-content">
            <h4>${message}</h4>
            <span>Just now</span>
        </div>
    `;

            // New activity top par
            activityList.prepend(activity);

            // Maximum 3 activities hi rakho
            const activities = activityList.querySelectorAll(".activity-item");

            while (activities.length > 3) {
                activities[activities.length - 1].remove();
                break;
            }
        }

        // ================= CLOSE MODAL =================

        modal.classList.remove("active");

        // ================= UPDATE COUNTERS =================

        updateCounts();
    });

}); 

// =========================
// LOGOUT
// =========================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", () => {

    localStorage.removeItem("isLoggedIn");

    window.location.href = "index.html";

});

// =========================
// AUTO LOGOUT
// =========================

// 5 Minutes
const AUTO_LOGOUT_TIME = 5 * 60 * 1000;

let logoutTimer;

function logoutUser() {

    localStorage.removeItem("isLoggedIn");

    alert("Session expired due to inactivity");

    window.location.href = "index.html";

}

function resetLogoutTimer() {

    clearTimeout(logoutTimer);

    logoutTimer = setTimeout(
        logoutUser,
        AUTO_LOGOUT_TIME
    );

}

// User Activity Detection

[
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
    "touchstart"
].forEach(event => {

    document.addEventListener(
        event,
        resetLogoutTimer
    );

});

// Start Timer
resetLogoutTimer();




