document.addEventListener("DOMContentLoaded", () => {

// ================= SIDEBAR TOGGLE =================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector(".main-content");
const collapseBtn = document.querySelector(".collapse-btn");

// ================= USER PROFILE =================

if (localStorage.getItem("isLoggedIn") !== "true") {

    window.location.href = "index.html";

}

const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);

if (loggedInUser) {

    const userName = document.getElementById("userName");
    const welcomeTitle = document.getElementById("welcomeTitle");

    if (userName) {
        userName.textContent = loggedInUser.username;
    }

    if (welcomeTitle) {
        welcomeTitle.textContent =
            `Welcome Back, ${loggedInUser.username} 👋`;
    }
}

// Helper function jo dono classes ko ek saath manage karegi
function toggleSidebarState() {
    sidebar.classList.toggle("hidden");
    mainContent.classList.toggle("expanded");
}

// Mobile & Tablet → hidden by default, main content expanded
if (window.innerWidth <= 992) {
    sidebar.classList.add("hidden");
    mainContent.classList.add("expanded");
}

// Hamburger Toggle
if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        toggleSidebarState();
    });
}

// Collapse Button (Sidebar ke andar ka button)
if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
        if (window.innerWidth <= 992) {
            // Mobile & Tablet → Close Sidebar completely
            sidebar.classList.add("hidden");
            mainContent.classList.add("expanded");
        } else {
            // Desktop → Toggle hidden state
            toggleSidebarState();
        }
    });
}

// Resize Handle
window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
        // Desktop par aate hi sidebar wapas dikhne lage aur content margin le le
        sidebar.classList.remove("hidden");
        mainContent.classList.remove("expanded");
    } else {
        // Mobile par aate hi sidebar hide ho jaye aur content full page ho jaye
        sidebar.classList.add("hidden");
        mainContent.classList.add("expanded");
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
        const pending = document.querySelectorAll("#pendingTasks .task-card").length;
        const progress = document.querySelectorAll("#progressTasks .task-card").length;
        const completed = document.querySelectorAll("#completedTasks .task-card").length;
        const total = pending + progress + completed;
        const highPriority = document.querySelectorAll(".task-card .priority.high").length;
        const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

        const pendingCount = document.getElementById("pendingCount");
        const progressCount = document.getElementById("progressCount");
        const completedCount = document.getElementById("completedCount");

        if (pendingCount) pendingCount.textContent = pending;
        if (progressCount) progressCount.textContent = progress;
        if (completedCount) completedCount.textContent = completed;

        document.getElementById("totalTasksCount").textContent = total;
        document.getElementById("completedTasksCount").textContent = completed;
        document.getElementById("pendingTasksCount").textContent = pending;
        document.getElementById("progressTasksCount").textContent = progress;
        document.getElementById("priorityTasksCount").textContent = highPriority;
        document.getElementById("productivityCount").textContent = productivity + "%";

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const todayStr = new Date().toDateString();

        const todayTasks = tasks.filter(task => {
            if (!task.createdAt) return false;
            return new Date(task.createdAt).toDateString() === todayStr;
        });

        const todayTotal = todayTasks.length;
        const todayCompleted = todayTasks.filter(task => task.category === "completed").length;
        const todayProgressPercent = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

        const progressCardCircle = document.querySelector(".progress-card .progress-circle span");
        if (progressCardCircle) {
            progressCardCircle.textContent = todayProgressPercent + "%";
            const deg = (todayProgressPercent / 100) * 360;
            progressCardCircle.parentElement.style.background = `conic-gradient(#6d4aff ${deg}deg, #ece8ff 0deg)`;
        }

        const dailyCircleSpan = document.querySelector(".circle-purple span");
        if (dailyCircleSpan) {
            dailyCircleSpan.textContent = todayProgressPercent + "%";
            const deg = (todayProgressPercent / 100) * 360;
            dailyCircleSpan.parentElement.style.background = `conic-gradient(#6d4aff ${deg}deg, #ece8ff 0deg)`;
        }

        const now = new Date();
        const oneDayMs = 24 * 60 * 60 * 1000;

        const weeklyTasks = tasks.filter(task => {
            if (!task.createdAt) return false;
            return (now - new Date(task.createdAt)) <= (7 * oneDayMs);
        });
        const weeklyTotal = weeklyTasks.length;
        const weeklyCompleted = weeklyTasks.filter(task => task.category === "completed").length;
        const weeklyPercent = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

        const weeklyCircleSpan = document.querySelector(".circle-green span");
        if (weeklyCircleSpan) {
            weeklyCircleSpan.textContent = weeklyPercent + "%";
            const deg = (weeklyPercent / 100) * 360;
            weeklyCircleSpan.parentElement.style.background = `conic-gradient(#22c55e ${deg}deg, #e8faef 0deg)`;
        }

        const monthlyTasks = tasks.filter(task => {
            if (!task.createdAt) return false;
            return (now - new Date(task.createdAt)) <= (30 * oneDayMs);
        });
        const monthlyTotal = monthlyTasks.length;
        const monthlyCompleted = monthlyTasks.filter(task => task.category === "completed").length;
        const monthlyPercent = monthlyTotal > 0 ? Math.round((monthlyCompleted / monthlyTotal) * 100) : 0;

        const monthlyCircleSpan = document.querySelector(".circle-orange span");
        if (monthlyCircleSpan) {
            monthlyCircleSpan.textContent = monthlyPercent + "%";
            const deg = (monthlyPercent / 100) * 360;
            monthlyCircleSpan.parentElement.style.background = `conic-gradient(#f59e0b ${deg}deg, #fff4dc 0deg)`;
        }

        const overviewText = document.querySelector(".overview-text");
        if (overviewText) {
            overviewText.textContent = `You have completed ${todayCompleted} out of ${todayTotal} tasks added today.`;
        }
    }

    function loadTasks() {

        const tasks = JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

        tasks.forEach(task => {

const html = `
<div class="task-card ${task.category === "completed" ? "completed" : ""}">

    <h4>${task.name}</h4>

    <div class="task-footer">

        <span class="priority ${task.priority}">
            ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        <span class="date">
            ${task.date}
        </span>

    </div>

</div>
`;
            let container;

            if (task.category === "pending") {

                container =
                    document.getElementById("pendingTasks");

            } else if (task.category === "progress") {

                container =
                    document.getElementById("progressTasks");

            } else {

                container =
                    document.getElementById("completedTasks");

            }

            // Duplicate Check
            const alreadyExists =
                [...container.querySelectorAll(".task-card h2")]
                    .some(
                        title =>
                            title.textContent.trim() ===
                            task.name.trim()
                    );

            // Sirf naya task add hoga
            if (!alreadyExists) {

                container.insertAdjacentHTML(
                    "beforeend",
                    html
                );

            }

        });

    }

    function limitTaskDisplay() {

        const lists = [
            document.getElementById("pendingTasks"),
            document.getElementById("progressTasks"),
            document.getElementById("completedTasks")
        ];

        lists.forEach(list => {

            if (!list) return;

            const tasks = list.querySelectorAll(".task-card");

            tasks.forEach((task, index) => {

                if (index < 3) {
                    task.style.display = "block";
                } else {
                    task.style.display = "none";
                }

            });

        });

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

    loadTasks();
    updateCounts();
    limitTaskDisplay();


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
        const taskId = Date.now();

let html = `
<div class="task-card ${category === "completed" ? "completed" : ""}">

    <h4>${name}</h4>

    <div class="task-footer">

        <span class="priority ${label}">
            ${label.charAt(0).toUpperCase() + label.slice(1)}
        </span>

        <span class="date">
            ${formatDate(date)}
        </span>

    </div>

</div>
`;

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

        // ================= SAVE TO LOCAL STORAGE =================

        const tasks = JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

        tasks.push({
            id: taskId,
            name,
            date: formatDate(date),
            priority: label,
            category,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

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
        limitTaskDisplay();
    });

    document.addEventListener("click", (e) => {

    // ================= DELETE TASK =================
    if (e.target.closest(".delete-btn")) {

        const btn = e.target.closest(".delete-btn");
        const id = Number(btn.dataset.id);

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks = tasks.filter(task => task.id !== id);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        btn.closest(".task-card").remove();

        if (typeof updateCounts === "function") updateCounts();
        if (typeof limitTaskDisplay === "function") limitTaskDisplay();

    }

// ================= EDIT TASK =================
if (e.target.closest(".edit-btn")) {

    const btn = e.target.closest(".edit-btn");
    const id = Number(btn.dataset.id);

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    // Edit Task Name
    const newName = prompt("Edit Task Name", task.name);

    if (newName === null || newName.trim() === "") return;

    // Edit Status
    const newStatus = prompt(
        "Enter Status (pending / progress / completed)",
        task.category
    );

    if (
        newStatus === null ||
        !["pending", "progress", "completed"].includes(newStatus.toLowerCase())
    ) {
        alert("Invalid Status");
        return;
    }

    task.name = newName.trim();
    task.category = newStatus.toLowerCase();

    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Page Reload so task moves to correct column
    location.reload();
}

});
});


// =========================
// LOGOUT
// =========================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", () => {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");

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
    localStorage.removeItem("loggedInUser");

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