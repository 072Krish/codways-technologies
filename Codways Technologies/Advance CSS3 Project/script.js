const themeToggle =
document.getElementById("themeToggle");

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        themeToggle.innerHTML =
        `<i class="fa-solid fa-sun"></i>`;
    }

    else{

        themeToggle.innerHTML =
        `<i class="fa-solid fa-moon"></i>`;
    }

});

// Mobile Menu Toggle

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });

    }

});