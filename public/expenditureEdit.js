// Initialize date pickers with Flatpickr
flatpickr("input[type='date']", {
  dateFormat: "Y-m-d",
  theme: "dark",
});

// DOM element selections
const searchIcon = document.querySelector(".search-icon");
const closeIcon = document.querySelector(".close-icon");
const searchBox = document.querySelector(".search");
const searchInput = document.querySelector(".search");
const tableBody = document.querySelector("tbody");
const addExpenseBtn = document.querySelector(".add-expense");
const clearBtn = document.querySelector(".clear");

// Toggle the popup form visibility
//   function toggleForm() {
//     const form = document.getElementById("popupForm");
//     const overlay = document.getElementById("overlay");
//     const isVisible = form.style.display === "grid";
//     form.style.display = isVisible ? "none" : "grid";
//     overlay.style.display = isVisible ? "none" : "block";
//   }

function clearForm() {
  document
    .querySelectorAll("#popupForm input, #popupForm select")
    .forEach((input) => (input.value = ""));
}

function calculateTotals() {
  console.log("enterd calucalte totals ");

  const startReading =
    Number(document.getElementById("edit-start-reading").value) || 0;
  const closingReading =
    Number(document.getElementById("edit-closing-reading").value) || 0;
  const totalKms = startReading - closingReading;
  document.getElementById("edit-total-kms").value = totalKms;

  const dieselQuantity =
    Number(document.getElementById("edit-diesel-quantity").value) || 0;
  if (dieselQuantity > 0 && totalKms > 0) {
    const kmsPerLiter = totalKms / dieselQuantity;
    document.getElementById("edit-kms-per-liter").value =
      kmsPerLiter.toFixed(2);
  }
  const dieselAmount =
    Number(document.getElementById("edit-diesel-amount").value) || 0;
  const tollGateExpense =
    Number(document.getElementById("edit-toll-gate-expense").value) || 0;
  const otherExpenses =
    Number(document.getElementById("edit-other-expenses").value) || 0;
  const bpExpenses =
    Number(document.getElementById("edit-bp-expenses").value) || 0;
  const taxesAmount =
    Number(document.getElementById("edit-taxes-amount").value) || 0;
  const driverSalary =
    Number(document.getElementById("edit-driver-salary").value) || 0;
  const haltingCharges =
    Number(document.getElementById("edit-halting-charges").value) || 0;

  // Calculate total expenses
  const totalExpenses =
    dieselAmount +
    tollGateExpense +
    otherExpenses +
    bpExpenses +
    taxesAmount +
    driverSalary +
    haltingCharges;
  document.getElementById("edit-total-expenses").value = totalExpenses;

  // Revenue calculations
  const movementRate =
    Number(document.getElementById("edit-movement-rate").value) || 0;
  const invoiceAmount =
    Number(document.getElementById("edit-invoice-amount").value) || 0;
  const advancePaid =
    Number(document.getElementById("edit-advance-paid").value) || 0;

  document.getElementById("edit-invoice-amount").value =
    totalExpenses + haltingCharges + movementRate;
  // Calculate balance to receive
  const balanceToReceive = invoiceAmount - advancePaid;
  document.getElementById("edit-balance-to-receive").value = balanceToReceive;

  // Calculate net margin
  const netMargin = invoiceAmount - totalExpenses;
  document.getElementById("edit-net-margin").value = netMargin;
}

// Setup event listeners for calculation fields
function setupCalculationListeners() {
  console.log("enterd set up cacl  totals ");
  // Mileage calculation fields
  document
    .getElementById("edit-start-reading")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("edit-closing-reading")
    .addEventListener("input", calculateTotals);

  // Fuel calculation fields
  document
    .getElementById("edit-diesel-quantity")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("edit-diesel-amount")
    .addEventListener("input", calculateTotals);

  // Expense fields
  document
    .getElementById("edit-toll-gate-expense")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("edit-other-expenses")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("edit-bp-expenses")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("edit-taxes-amount")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("edit-driver-salary")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("edit-halting-charges")
    .addEventListener("input", calculateTotals);

  // Revenue fields
  document
    .getElementById("edit-movement-rate")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("edit-invoice-amount")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("edit-advance-paid")
    .addEventListener("input", calculateTotals);
}

function setupAutofill(inputId, hintId, field) {
  const input = document.querySelector(`#${inputId}`);
  const hint = document.querySelector(`#${hintId}`);
  let lastSuggestion = "";
  let isBackspacePressed = false;

  input.addEventListener("input", async (e) => {
    if (isBackspacePressed) {
      isBackspacePressed = false;
      return;
    }

    const query = input.value.trim();
    hint.textContent = "";

    if (query.length < 1) {
      hint.textContent = "";
      return;
    }

    try {
      const response = await fetch(`/expSearch?q=${query}&field=${field}`);
      const suggestions = await response.json();

      if (suggestions.length > 0) {
        const fullSuggestion = suggestions[0];
        const queryLower = query.toLowerCase();
        const suggestionLower = fullSuggestion.toLowerCase();

        const matchIndex = suggestionLower.indexOf(queryLower);

        if (matchIndex !== -1) {
          lastSuggestion = fullSuggestion;
          const beforeMatch = fullSuggestion.slice(0, matchIndex);
          const matchedPart = fullSuggestion.slice(
            matchIndex,
            matchIndex + query.length
          );
          const remaining = fullSuggestion.slice(matchIndex + query.length);

          hint.textContent = beforeMatch + matchedPart + remaining;
        } else {
          hint.textContent = "";
        }
      } else {
        hint.textContent = "";
      }
    } catch (error) {
      console.error(`Error fetching suggestions for ${inputId}:`, error);
      hint.textContent = "";
    }
  });

  input.addEventListener("keydown", (e) => {
    if ((e.key === "Tab" || e.key === "ArrowRight") && hint.textContent) {
      e.preventDefault();
      input.value = lastSuggestion;
      hint.textContent = "";
    }

    if (e.key === "Escape" || e.key === "Backspace") {
      hint.textContent = "";
      lastSuggestion = "";

      if (e.key === "Backspace") {
        isBackspacePressed = true;
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !hint.contains(e.target)) {
      hint.textContent = "";
    }
  });

  input.addEventListener("click", () => {
    hint.textContent = "";
    lastSuggestion = "";
  });

  input.addEventListener("scroll", () => {
    hint.style.transform = `translateX(-${input.scrollLeft}px)`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".caps").forEach((input) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  });

  setupCalculationListeners();
  setupAutofill("edit-customer", "edit-customer-hint", "customer");
  setupAutofill("edit-from", "edit-from-hint", "from");
  setupAutofill("edit-to", "edit-to-hint", "to");
  setupAutofill("edit-back-to", "edit-back-to-hint", "backTo");
  setupAutofill("edit-driver-name", "edit-driver-name-hint", "driverName");
  setupAutofill(
    "edit-vehicle-number",
    "edit-vehicle-number-hint",
    "vehicleNumber"
  );
});
