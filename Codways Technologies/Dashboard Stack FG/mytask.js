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

    // Modal Variables

    const editModal = document.getElementById("editModal");
const editTaskName = document.getElementById("editTaskName");
const editTaskStatus = document.getElementById("editTaskStatus");
const saveChanges = document.getElementById("saveChanges");
const closeEdit = document.getElementById("closeEdit");

let currentTaskId = null;
function loadMyTasks() {

    const container = document.getElementById("tasksContainer");

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    container.innerHTML = "";

    if(tasks.length === 0){

        container.innerHTML = `
            <div class="no-task">
                No Tasks Available
            </div>
        `;
        return;
    }

    tasks.forEach(task => {

        const card = document.createElement("div");

        card.className = "task-card";

        card.innerHTML = `

        <div class="task-info">

            <div class="task-badges">

                <span class="priority-badge ${task.priority}">
                    ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                <span class="status-badge ${task.category}">
                    ${
                        task.category=="pending"
                        ? "Pending"
                        : task.category=="progress"
                        ? "In Progress"
                        : "Completed"
                    }
                </span>

            </div>

            <h3 class="task-title">
                <i class="fa-solid fa-list-check"></i>
                ${task.name}
            </h3>

            <p>
                <i class="fa-regular fa-calendar"></i>
                Date - ${task.date}
            </p>

        </div>

        <div class="task-actions">

            <button class="btn-edit" data-id="${task.id}">
                <i class="fa-regular fa-pen-to-square"></i>
                Edit
            </button>

            <button class="btn-delete" data-id="${task.id}">
                <i class="fa-solid fa-trash"></i>
                Delete
            </button>

        </div>

        `;

        container.appendChild(card);

    });

}

loadMyTasks();

// ================= SAVE CHANGES =================

saveChanges.addEventListener("click", () => {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const task = tasks.find(t => t.id === currentTaskId);

    if (!task) return;

    task.name = editTaskName.value.trim();
    task.category = editTaskStatus.value;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    editModal.style.display = "none";

    loadMyTasks();

});


// ================= CLOSE BUTTON =================

closeEdit.addEventListener("click", () => {

    editModal.style.display = "none";

});


// ================= CLICK OUTSIDE MODAL =================

window.addEventListener("click", (e) => {

    if (e.target === editModal) {

        editModal.style.display = "none";

    }

});

document.addEventListener("click", function (e) {

    // ================= DELETE =================
    if (e.target.closest(".btn-delete")) {

        const id = Number(e.target.closest(".btn-delete").dataset.id);

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks = tasks.filter(task => task.id !== id);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        loadMyTasks();
    }


// ================= EDIT =================
if (e.target.closest(".btn-edit")) {

    currentTaskId = Number(
        e.target.closest(".btn-edit").dataset.id
    );

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const task = tasks.find(task => task.id === currentTaskId);

    if (!task) return;

    editTaskName.value = task.name;
    editTaskStatus.value = task.category;

    editModal.style.display = "flex";
}
});
});

// ================= FILTER & RESET =================

const filterBtn = document.querySelector(".btn-filter");
const resetBtn = document.querySelector(".btn-reset");

const taskSearch = document.getElementById("taskSearch");
const filterType = document.getElementById("filterType");
const filterValue = document.getElementById("filterValue");
const noResults = document.getElementById("noResults");

filterBtn.addEventListener("click", () => {

    const searchText = taskSearch.value.toLowerCase().trim();
    const type = filterType.value;
    const value = filterValue.value;

    const tasks = document.querySelectorAll(".task-card");

    let visibleCount = 0;

    tasks.forEach(task => {

        const title = task.querySelector(".task-title")
            .textContent
            .toLowerCase()
            .trim();

        const priority = task.querySelector(".priority-badge")
            .textContent
            .trim();

        const status = task.querySelector(".status-badge")
            .textContent
            .trim();

        let show = true;

        // Task Name Search
        if (searchText && !title.includes(searchText)) {
            show = false;
        }

        // Priority Filter
        if (type === "priority") {
            if (value === "Low Priority" && priority !== "Low") show = false;
            if (value === "Medium Priority" && priority !== "Medium") show = false;
            if (value === "High Priority" && priority !== "High") show = false;
        }

        // Status Filter
        if (type === "status") {
            if (
                value === "Pending" ||
                value === "In Progress" ||
                value === "Completed"
            ) {
                if (status !== value) show = false;
            }
        }

        if (show) {
            task.style.display = "flex";
            visibleCount++;
        } else {
            task.style.display = "none";
        }

    });

    // No Result Found
    if (visibleCount === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

    // Sorting
    if (type === "sort") {

        const container = document.querySelector(".tasks-container");
        const taskArray = [...document.querySelectorAll(".task-card")];

        taskArray.sort((a, b) => {

            const nameA = a.querySelector(".task-title")
                .textContent
                .trim()
                .toLowerCase();

            const nameB = b.querySelector(".task-title")
                .textContent
                .trim()
                .toLowerCase();

            if (value === "az") {
                return nameA.localeCompare(nameB);
            }

            if (value === "za") {
                return nameB.localeCompare(nameA);
            }

            return 0;
        });

        taskArray.forEach(task => container.appendChild(task));
    }

});

resetBtn.addEventListener("click", () => {

    taskSearch.value = "";
    filterType.value = "";
    filterValue.value = "";

document.querySelectorAll(".task-card").forEach(task => {
    task.style.display = "flex";
});

    noResults.style.display = "none";

});










