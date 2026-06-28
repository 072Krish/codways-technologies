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

    // Modal Variables

    const editModal = document.getElementById("editModal");
    const editTaskName = document.getElementById("editTaskName");
    const editTaskStatus = document.getElementById("editTaskStatus");
    const saveChanges = document.getElementById("saveChanges");
    const closeEdit = document.getElementById("closeEdit");

    let currentTaskId = null;

    // ================= PAGINATION =================

    let currentPage = 1;
    const tasksPerPage = 10;

    function loadMyTasks() {

        const container = document.getElementById("tasksContainer");

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        container.innerHTML = "";

        if (tasks.length === 0) {

            container.innerHTML = `
            <div class="no-task">
                No Tasks Available
            </div>
        `;
            return;
        }

        // ================= PAGINATION =================

        const start = (currentPage - 1) * tasksPerPage;
        const end = start + tasksPerPage;

        const pageTasks = tasks.slice(start, end);

        pageTasks.forEach(task => {

            const card = document.createElement("div");

            card.className = "task-card";

            card.innerHTML = `

        <div class="task-info">

            <div class="task-badges">

                <span class="priority-badge ${task.priority}">
                    ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                <span class="status-badge ${task.category}">
                    ${task.category == "pending"
                    ? "Pending"
                    : task.category == "progress"
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

        renderPagination(tasks.length);

    }

    loadMyTasks();

    function renderPagination(totalTasks) {

        const pagination = document.getElementById("pagination");

        if (!pagination) return;

        pagination.innerHTML = "";

        const totalPages = Math.ceil(totalTasks / tasksPerPage);

        if (totalPages <= 1) return;

        // First
        const firstBtn = document.createElement("button");
        firstBtn.className = "page-btn";
        firstBtn.innerHTML = '<i class="fas fa-angle-double-left"></i>';
        firstBtn.disabled = currentPage === 1;

        firstBtn.addEventListener("click", () => {
            currentPage = 1;
            loadMyTasks();
        });

        pagination.appendChild(firstBtn);

        // Previous
        const prevBtn = document.createElement("button");
        prevBtn.className = "page-btn";
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;

        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                loadMyTasks();
            }
        });

        pagination.appendChild(prevBtn);

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        // First Page
        if (startPage > 1) {
            const first = document.createElement("button");
            first.className = "page-btn";
            first.textContent = "1";
            first.onclick = () => {
                currentPage = 1;
                loadMyTasks();
            };
            pagination.appendChild(first);
        }

        // Left Dots
        if (startPage > 2) {
            const dots = document.createElement("span");
            dots.className = "page-btn dots";
            dots.textContent = "...";
            pagination.appendChild(dots);
        }

        // Visible Pages
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.className = "page-btn";
            if (i === currentPage) {
                button.classList.add("active");
            }
            button.textContent = i;
            button.onclick = () => {
                currentPage = i;
                loadMyTasks();
            };
            pagination.appendChild(button);
        }

        // Right Dots
        if (endPage < totalPages - 1) {
            const dots = document.createElement("span");
            dots.className = "page-btn dots";
            dots.textContent = "...";
            pagination.appendChild(dots);
        }

        // Last Page
        if (endPage < totalPages) {
            const last = document.createElement("button");
            last.className = "page-btn";
            last.textContent = totalPages;
            last.onclick = () => {
                currentPage = totalPages;
                loadMyTasks();
            };
            pagination.appendChild(last);
        }

        // ================= NEXT =================
        const nextBtn = document.createElement("button");
        nextBtn.className = "page-btn";
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadMyTasks();
            }
        });
        pagination.appendChild(nextBtn);

        // ================= LAST =================
        const lastBtn = document.createElement("button");
        lastBtn.className = "page-btn";
        lastBtn.innerHTML = '<i class="fas fa-angle-double-right"></i>';
        lastBtn.disabled = currentPage === totalPages;
        lastBtn.addEventListener("click", () => {
            currentPage = totalPages;
            loadMyTasks();
        });
        pagination.appendChild(lastBtn);
    }
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

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to recover this task!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6"
            }).then((result) => {

                if (result.isConfirmed) {

                    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

                    tasks = tasks.filter(task => task.id !== id);

                    localStorage.setItem("tasks", JSON.stringify(tasks));

                    loadMyTasks();

                    Swal.fire(
                        "Deleted!",
                        "Your task has been deleted successfully.",
                        "success"
                    );
                }

            });
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

// ================= FILTER DRAWER =================

const openFilter = document.getElementById("openFilter");
const closeFilter = document.getElementById("closeFilter");
const drawer = document.getElementById("filterDrawer");
const overlay = document.getElementById("filterOverlay");

const taskSearch = document.getElementById("taskSearch");
const sortType = document.getElementById("sortType");

const applyBtn = document.querySelector(".apply-btn");
const drawerResetBtn = document.querySelector(".reset-btn");
const headerResetBtn = document.getElementById("resetFilters");

const noResults = document.getElementById("noResults");
const container = document.getElementById("tasksContainer");


// ================= DRAWER =================

openFilter.addEventListener("click", () => {
    drawer.classList.add("active");
    overlay.classList.add("active");
});

function closeDrawer() {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
}

closeFilter.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

// ================= APPLY FILTER =================

function applyFilters() {
    const searchValue = taskSearch.value.trim().toLowerCase();
    const priority = document.querySelector('input[name="priority"]:checked').value;
    const status = document.querySelector('input[name="status"]:checked').value;
    const sort = sortType.value;
    let cards = Array.from(document.querySelectorAll(".task-card"));
    let visibleCount = 0;

    cards.forEach(card => {

        const title = card.querySelector(".task-title").innerText.toLowerCase();
        const priorityText = card.querySelector(".priority-badge").innerText.trim();
        const statusText = card.querySelector(".status-badge").innerText.trim();
        let show = true;

        if (searchValue && !title.includes(searchValue)) {
            show = false;
        }

        if (priority && priorityText !== priority) {
            show = false;
        }

        if (status && statusText !== status) {
            show = false;
        }

        card.style.display = show ? "flex" : "none";
        if (show) {
            visibleCount++;
        }
    });

    // ================= SORT =================

    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };

    cards.sort((a, b) => {
        const nameA =
            a.querySelector(".task-title").innerText.toLowerCase();

        const nameB =
            b.querySelector(".task-title").innerText.toLowerCase();

        const pA =
            a.querySelector(".priority-badge").innerText.trim();

        const pB =
            b.querySelector(".priority-badge").innerText.trim();

        switch (sort) {

            case "az": return nameA.localeCompare(nameB);
            case "za": return nameB.localeCompare(nameA);
            case "high": return priorityOrder[pA] - priorityOrder[pB];
            case "low": return priorityOrder[pB] - priorityOrder[pA];
            default:
                return 0;
        }
    });

    cards.forEach(card => {
        container.appendChild(card);
    });

    // ================= NO RESULT =================

    if (noResults) {
        noResults.style.display = visibleCount === 0 ? "block" : "none";
    }

    // ================= HEADER RESET =================

    const activeFilter =
        searchValue ||
        priority ||
        status ||
        sort;
    headerResetBtn.style.display = activeFilter ? "flex" : "none";
}


// ================= APPLY =================

applyBtn.addEventListener("click", () => {
    applyFilters();
    closeDrawer();
});

// ================= RESET FILTERS =================

function resetFilters() {
    taskSearch.value = "";

    // Priority Reset (All)
    document.querySelector(
        'input[name="priority"][value=""]'
    ).checked = true;

    // Status Reset (All)
    document.querySelector(
        'input[name="status"][value=""]'
    ).checked = true;

    // Sort Reset
    sortType.value = "";

    // Apply Again
    applyFilters();

    // Header Reset Hide
    headerResetBtn.style.display = "none";

    // Close Drawer
    closeDrawer();
}

drawerResetBtn.addEventListener("click", () => {
    resetFilters();
});

// ================= HEADER RESET =================
headerResetBtn.addEventListener("click", () => {
    resetFilters();
});

// ================= LIVE EVENTS =================

// Search
taskSearch.addEventListener("keyup", applyFilters);

// Sort
sortType.addEventListener("change", applyFilters);

// Priority
document.querySelectorAll('input[name="priority"]').forEach(radio => {

    radio.addEventListener("change", applyFilters);
});

// Status
document.querySelectorAll('input[name="status"]').forEach(radio => {

    radio.addEventListener("change", applyFilters);
});

headerResetBtn.style.display = "none";