document.addEventListener("DOMContentLoaded", () => {

    // ================= SIDEBAR TOGGLE =================
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const collapseBtn = document.querySelector(".collapse-btn");

    function toggleSidebarState() {
        if (sidebar && mainContent) {
            sidebar.classList.toggle("hidden");
            mainContent.classList.toggle("expanded");
        }
    }

    if (sidebar && mainContent) {
        if (window.innerWidth <= 992) {
            sidebar.classList.add("hidden");
            mainContent.classList.add("expanded");
        }

        menuToggle?.addEventListener("click", () => {
            toggleSidebarState();
        });

        collapseBtn?.addEventListener("click", () => {
            if (window.innerWidth <= 992) {
                sidebar.classList.add("hidden");
                mainContent.classList.add("expanded");
            } else {
                toggleSidebarState();
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
    }

    // ================= USER PROFILE =================

if (localStorage.getItem("isLoggedIn") !== "true") {

    window.location.href = "index.html";

}

const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);

if (loggedInUser) {

    const userName = document.getElementById("userName");

    if (userName) {

        userName.textContent = loggedInUser.username;

    }

}
    // ================= DARK / LIGHT MODE =================
    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {
        const icon = themeToggle.querySelector("i");

        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
            if (icon) {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            }
        }

        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

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

// ================= CALENDAR & TASKS LOGIC =================
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentDate = new Date(); 
const todayDate = new Date(); 
let currentView = 'month';  

function formatDateString(year, month, day) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day} ${months[month]} ${year}`;
}

// 1. MASTER RENDER CONTROLLER (Views handle karega)
function updateCalendarView() {
    if (currentView === "month") {
        renderCalendar();
    } else if (currentView === "week") {
        renderWeeklyCalendar();
    } else if (currentView === "day") {
        renderDailyCalendar();
    }
}

// 2. VIEW BUTTONS EVENT LISTENERS (CLICK CONTROLLER FIXED)

const dayBtn = document.getElementById("dayViewBtn") || document.querySelector(".view-btn:nth-child(1)");
const weekBtn = document.getElementById("weekViewBtn") || document.querySelector(".view-btn:nth-child(2)");
const monthBtn = document.getElementById("monthViewBtn") || document.querySelector(".view-btn:nth-child(3)");

if (dayBtn) {
    dayBtn.addEventListener("click", () => {
        currentView = 'day';
        currentDate = new Date(todayDate); // FIXED: Reset to original live day
        updateViewActiveStatus();
        if (typeof renderCalendar === "function") renderCalendar();
        else if (typeof renderDailyCalendar === "function") renderDailyCalendar();
    });
}

if (weekBtn) {
    weekBtn.addEventListener("click", () => {
        currentView = 'week';
        currentDate = new Date(todayDate); // FIXED: Reset to original live week
        updateViewActiveStatus();
        if (typeof renderCalendar === "function") renderCalendar();
        else if (typeof renderWeeklyCalendar === "function") renderWeeklyCalendar();
    });
}

if (monthBtn) {
    monthBtn.addEventListener("click", () => {
        currentView = 'month';
        currentDate = new Date(todayDate); // FIXED: Reset to original live month
        updateViewActiveStatus();
        if (typeof renderCalendar === "function") renderCalendar();
        else if (typeof renderMonthlyCalendar === "function") renderMonthlyCalendar();
    });
}

function updateViewActiveStatus() {
    document.querySelectorAll(".view-btn").forEach(btn => btn.classList.remove("active"));
    if (currentView === 'day' && dayBtn) dayBtn.classList.add("active");
    if (currentView === 'week' && weekBtn) weekBtn.classList.add("active");
    if (currentView === 'month' && monthBtn) monthBtn.classList.add("active");
}

// 2. MONTHLY VIEW (Aapka original function)
function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    if (!grid) return;

    grid.className = "calendar-grid month-view"; // View class forced
    grid.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById("monthYear").innerText = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Previous Month's Days
    for (let i = firstDay - 1; i >= 0; i--) {
        const prevDate = prevMonthDays - i;
        grid.innerHTML += `
            <div class="day other-month">
                <div class="day-number">${prevDate}</div>
            </div>
        `;
    }

    // Current Month's Days
    for (let d = 1; d <= totalDays; d++) {
        const cellDate = new Date(year, month, d);

        const dayTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            return (
                taskDate.getDate() === cellDate.getDate() &&
                taskDate.getMonth() === cellDate.getMonth() &&
                taskDate.getFullYear() === cellDate.getFullYear()
            );
        });

        let html = "";
        dayTasks.forEach((task, index) => {
            if (index < 2) {
                html += `
                    <div class="task-badge status-${task.category}">
                        ${task.name}
                    </div>
                `;
            }
        });

        if (dayTasks.length > 2) {
            const remainingCount = dayTasks.length - 2;
            html += `<div class="more-tasks-badge">+${remainingCount} more</div>`;
        }

        const formattedDateAttr = formatDateString(year, month, d);

        grid.innerHTML += `
            <div class="day" data-date="${formattedDateAttr}" data-tasks='${JSON.stringify(dayTasks)}'>
                <div class="day-number">${d}</div>
                ${html}
            </div>
        `;
    }

    // Next Month's Days
    const totalCells = firstDay + totalDays;
    const nextMonthDays = (7 - (totalCells % 7)) % 7;

    for (let i = 1; i <= nextMonthDays; i++) {
        grid.innerHTML += `
            <div class="day other-month">
                <div class="day-number">${i}</div>
            </div>
        `;
    }
}

// ================= 3. WEEKLY VIEW RENDERING (+MORE BADGE ADDED) =================
function renderWeeklyCalendar() {
    const grid = document.getElementById("calendarGrid");
    if (!grid) return;

    grid.className = "calendar-grid week-view"; 
    grid.innerHTML = "";

    const startOfWeek = new Date(currentDate);
    const currentDayOfWeek = startOfWeek.getDay();
    
    // Grid alignment set to Sunday
    startOfWeek.setDate(startOfWeek.getDate() - currentDayOfWeek);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleString("default", { month: "short" });
    const endMonth = endOfWeek.toLocaleString("default", { month: "short" });
    const yearStr = endOfWeek.getFullYear();
    
// FIXED: Format ko har condition me standard aur constant banane ke liye updated logic
    document.getElementById("monthYear").innerText = `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${yearStr}`;

    for (let i = 0; i < 7; i++) {
        const cellDate = new Date(startOfWeek);
        cellDate.setDate(startOfWeek.getDate() + i);

        const dayTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            return (
                taskDate.getDate() === cellDate.getDate() &&
                taskDate.getMonth() === cellDate.getMonth() &&
                taskDate.getFullYear() === cellDate.getFullYear()
            );
        });

        let html = "";
        
        // FIX: Sirf pehle 2 tasks render honge text badge ke sath
        dayTasks.forEach((task, index) => {
            if (index < 2) {
                html += `
                    <div class="task-badge status-${task.category}">
                        ${task.name}
                    </div>
                `;
            }
        });

        // FIX: Agar 2 se zyada tasks hain, toh dynamic counter badge (+more) append hoga
        if (dayTasks.length > 2) {
            const remainingCount = dayTasks.length - 2;
            html += `
                <div class="more-tasks-badge">
                    +${remainingCount} more
                </div>
            `;
        }

        const formattedDateAttr = formatDateString(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());

        grid.innerHTML += `
            <div class="day week-day-cell" data-date="${formattedDateAttr}" data-tasks='${JSON.stringify(dayTasks)}'>
                <div class="day-number">${cellDate.getDate()}</div>
                <div class="weekly-tasks-wrapper">
                    ${html || '<div class="no-tasks-badge-week">No Tasks</div>'}
                </div>
            </div>
        `;
    }
}

// ================= 4. DAILY VIEW RENDERING (POPUP CARD STYLE MATCH - NO LINE) =================
function renderDailyCalendar() {
    const grid = document.getElementById("calendarGrid");
    if (!grid) return;

    grid.className = "calendar-grid day-view";
    grid.innerHTML = "";

    // Set header date text
    document.getElementById("monthYear").innerText = currentDate.toLocaleString("default", {
        weekday: "long", month: "long", day: "numeric", year: "numeric"
    });

    const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return (
            taskDate.getDate() === currentDate.getDate() &&
            taskDate.getMonth() === currentDate.getMonth() &&
            taskDate.getFullYear() === currentDate.getFullYear()
        );
    });

    let html = "";
    if (dayTasks.length === 0) {
        html = `
            <div class="empty-day-view-container">
                <h3 class="single-line-schedule-text">No schedules for today. Enjoy your free day!</h3>
            </div>
        `;
    } else {
        dayTasks.forEach((task) => {
            // Proper Status Format Setup
            let statusText = "Pending";
            if (task.category === "inpg" || task.category === "progress" || task.category === "In Progress") {
                statusText = "In Progress";
            } else if (task.category === "completed" || task.category === "Completed") {
                statusText = "Completed";
            }

            // LINE DIVIDER LOGIC COMPLETELY REMOVED FROM HERE

            // EXACT POPUP CARD DESIGN MATCH (Ek ke niche ek standard layout)
            html += `
                <div class="popup-task daily-card-match">
                    <div class="popup-title">
                        <div class="task-heading">
                            <h4>${task.name}</h4>
                        </div>
                        <span class="status-text status-${task.category}">
                            ${statusText}
                        </span>
                    </div>
                </div>
            `;
        });
    }

    const formattedDateAttr = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    // Cards Wrapper Container
    grid.innerHTML = `
        <div class="daily-view-container daily-cards-list focused-day" data-date="${formattedDateAttr}" data-tasks='${JSON.stringify(dayTasks)}'>
            ${html}
        </div>
    `;
}

function renderUpcoming() {
    const timeline = document.getElementById("upcomingTimeline");
    if (!timeline) return;

    timeline.innerHTML = "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = tasks.filter(task => {
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        const diff = (taskDate - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 3;
    });

    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

    upcoming.forEach(task => {
        timeline.innerHTML += `
            <div class="timeline-item">
                <div class="timeline-date">${task.date}</div>
                <div class="timeline-title">${task.name}</div>
                <div class="task-badge task-${task.priority}">${task.priority}</div>
            </div>
        `;
    });
}

// Initial Run
updateCalendarView();
renderUpcoming();

// Navigation adjustments for views
document.getElementById("prevMonth")?.addEventListener("click", () => {
    if (currentView === "month") currentDate.setMonth(currentDate.getMonth() - 1);
    else if (currentView === "week") currentDate.setDate(currentDate.getDate() - 7);
    else if (currentView === "day") currentDate.setDate(currentDate.getDate() - 1);
    updateCalendarView();
});

document.getElementById("nextMonth")?.addEventListener("click", () => {
    if (currentView === "month") currentDate.setMonth(currentDate.getMonth() + 1);
    else if (currentView === "week") currentDate.setDate(currentDate.getDate() + 7);
    else if (currentView === "day") currentDate.setDate(currentDate.getDate() + 1);
    updateCalendarView();
});

// ================= CALENDAR TABS VIEW SWITCHER TRIGGER =================
document.querySelectorAll(".view-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        document.querySelector(".view-btn.active")?.classList.remove("active");
        e.target.classList.add("active");
        
        currentView = e.target.dataset.view;
        updateCalendarView(); // View selector handler update
    });
});

// ================= POPUP OPEN LOGIC =================
document.addEventListener("click", e => {
    const day = e.target.closest(".day, .daily-view-container");
    if (!day || day.classList.contains("other-month")) return;

    const popup = document.getElementById("taskPopup");
    const popupTasks = document.getElementById("popupTasks");
    const popupDateTitle = document.querySelector(".popup-top h3");

    const dayTasks = JSON.parse(day.dataset.tasks || "[]");
    const clickedDate = day.dataset.date;

    if (popupDateTitle && clickedDate) {
        popupDateTitle.innerText = clickedDate;
    }

    popupTasks.innerHTML = "";

    if (dayTasks.length === 0) {
        popupTasks.innerHTML = `
            <div class="no-tasks">
                <i class="fa-regular fa-calendar-xmark"></i>
                <h3>No Tasks Available</h3>
                <p>You don't have any tasks for this day.</p>
            </div>
        `;
    } else {
        dayTasks.forEach(task => {
            let statusText = task.category === "inpg" || task.category === "progress" ? "In Progress" : task.category;
            popupTasks.innerHTML += `
                <div class="popup-task">
                    <div class="popup-title">
                        <div class="task-heading">
                            <h4>${task.name}</h4>
                        </div>
                        <span class="status-text status-${task.category}">
                            ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}
                        </span>
                    </div>
                </div>
            `;
        });
    }
    popup.classList.add("show");
});

// ================= CLOSE POPUP LOGIC =================
document.getElementById("closePopup")?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("taskPopup").classList.remove("show");
});

const taskPopup = document.getElementById("taskPopup");
if (taskPopup) {
    taskPopup.addEventListener("click", (e) => {
        if (e.target === taskPopup) {
            taskPopup.classList.remove("show");
        }
    });
}

document.querySelector(".popup-box")?.addEventListener("click", (e) => {
    e.stopPropagation();
});

