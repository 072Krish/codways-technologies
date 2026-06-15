// =========================
// CURRENT DATE & TIME
// =========================

function updateTodayDateTime(){

    const now = new Date();

    const options = {
        day:"numeric",
        month:"long",
        year:"numeric"
    };

    const currentDate = now.toLocaleDateString("en-IN", options);

    const currentTime = now.toLocaleTimeString("en-IN", {
        hour:"2-digit",
        minute:"2-digit"
    });

    // TODAY SECTION UPDATE

    document.getElementById("todayDate").textContent =
    `${currentDate}  ${currentTime}`;

}

// RUN FIRST TIME

updateTodayDateTime();

// UPDATE EVERY SECOND

setInterval(updateTodayDateTime,1000);


// =========================
// DROPDOWN FUNCTIONALITY
// =========================

const selectedItem = document.getElementById("selectedItem");

const dropdownList = document.getElementById("dropdownList");

const selectedText = document.getElementById("selectedText");

const reportDate = document.getElementById("reportDate");

const items = document.querySelectorAll(".dropdown-item");


// OPEN / CLOSE

selectedItem.addEventListener("click", function(){

    dropdownList.classList.toggle("show");

});


// SELECT MONTH

items.forEach(function(item){

    item.addEventListener("click", function(){

        // UPDATE DROPDOWN TEXT

        selectedText.textContent = item.textContent;

        // UPDATE REPORT BAR MONTH

        reportDate.textContent = item.textContent;

        // REMOVE OLD ACTIVE

        items.forEach(function(el){

            el.classList.remove("active");

        });

        // ADD ACTIVE

        item.classList.add("active");

        // CLOSE DROPDOWN

        dropdownList.classList.remove("show");

    });

});


// OUTSIDE CLICK CLOSE

document.addEventListener("click", function(e){

    const dropdownBox = document.querySelector(".dropdown-box");

    if(!dropdownBox.contains(e.target)){

        dropdownList.classList.remove("show");

    }

});