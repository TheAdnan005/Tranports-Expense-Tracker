
flatpickr("input[type='date']", {
    dateFormat: "Y-m-d",
    theme: "dark",
});

const searchIcon = document.querySelector(".search-icon");
const closeIcon = document.querySelector(".close-icon");
const searchBox = document.querySelector(".search");
const addEntryBtn = document.querySelector(".add-entry");
const clearBtn = document.querySelector(".clear");
const entryTable = document.querySelector("#expenseTable tbody");

const datalistVehicle = document.getElementById("vehicle-suggestions");
const datalistCargo = document.getElementById("cargo-list");
const datalistOnAc = document.getElementById("on-ac-list");
const datalistBillTo = document.getElementById("bill-to-list");
const datalistFrom = document.getElementById("from-list");
const datalistTo = document.getElementById("to-list");
const datalistLaden = document.getElementById("laden-list");

function toggleForm() {
    const form = document.getElementById("popupForm");
    const overlay = document.getElementById("overlay");
    const isVisible = form.style.display === "grid";
    form.style.display = isVisible ? "none" : "grid";
    overlay.style.display = isVisible ? "none" : "block";
}

function resetForm() {
    document
        .querySelectorAll("#popupForm input, #popupForm select")
        .forEach((input) => (input.value = ""));
}


function calculateTotal() {
    const rate = Number(document.getElementById("rate").value) || 0;
    const halting = Number(document.getElementById("halting").value) || 0;
    const total = rate + halting;
    document.getElementById("total").value = total;
    const advance = Number(document.getElementById("advance").value) || 0;
    const balance = total - advance;
    document.getElementById("balance").value = balance;
    const billingRate =
        Number(document.getElementById("billing-rate").value) || 0;
    const emptyPickupExp =
        Number(document.getElementById("empty-pickup-exp").value) || 0;
    const haltingTwo = Number(document.getElementById("halting-2").value) || 0;
    const billingAmount = billingRate + emptyPickupExp + haltingTwo;
    document.getElementById("billing-amount").value = billingAmount;
    const tds = billingAmount * 0.01;
    document.getElementById("tds-deducted").value = tds;
    document.getElementById("net-amount").value = billingAmount - tds;
    const businessPromotion =
        Number(document.getElementById("business-promotion").value) || 0;
    const tripExpenses = Number(document.getElementById("expenses").value) || 0;

    document.getElementById("margin").value =
        billingAmount - tripExpenses - businessPromotion;
}

document.getElementById("rate").addEventListener("input", calculateTotal);
document.getElementById("halting").addEventListener("input", calculateTotal);
document.getElementById("advance").addEventListener("input", calculateTotal);
document.getElementById("halting").addEventListener("input", calculateTotal);
document
    .getElementById("billing-rate")
    .addEventListener("input", calculateTotal);
document
    .getElementById("empty-pickup-exp")
    .addEventListener("input", calculateTotal);
document.getElementById("halting-2").addEventListener("input", calculateTotal);
document
    .getElementById("business-promotion")
    .addEventListener("input", calculateTotal);
document.getElementById("expenses").addEventListener("input", calculateTotal);



// edit calculate function 





document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    });
});


addEntryBtn.addEventListener("click", toggleForm);
clearBtn.addEventListener("click", resetForm);
searchIcon.addEventListener("click", () => searchBox.classList.add("active"));
closeIcon.addEventListener("click", () => searchBox.classList.remove("active"));
updateAllSuggestions();
