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
let originalRows = Array.from(tableBody.querySelectorAll("tr"));
function toggleForm() {
  const form = document.getElementById("popupForm");
  const overlay = document.getElementById("overlay");
  const isVisible = form.style.display === "grid";
  form.style.display = isVisible ? "none" : "grid";
  overlay.style.display = isVisible ? "none" : "block";
}
function clearForm() {
  document
    .querySelectorAll("#popupForm input, #popupForm select")
    .forEach((input) => (input.value = ""));
}

function calculateTotals() {
  const startReading =
    Number(document.getElementById("start-reading").value) || 0;
  const closingReading =
    Number(document.getElementById("closing-reading").value) || 0;
  const totalKms = startReading - closingReading;
  document.getElementById("total-kms").value = totalKms;

  // Fuel efficiency calculation
  const dieselQuantity =
    Number(document.getElementById("diesel-quantity").value) || 0;
  if (dieselQuantity > 0 && totalKms > 0) {
    const kmsPerLiter = totalKms / dieselQuantity;
    document.getElementById("kms-per-liter").value = kmsPerLiter.toFixed(2);
  }

  // Expenses calculations
  const dieselAmount =
    Number(document.getElementById("diesel-amount").value) || 0;
  const tollGateExpense =
    Number(document.getElementById("toll-gate-expense").value) || 0;
  const otherExpenses =
    Number(document.getElementById("other-expenses").value) || 0;
  const bpExpenses = Number(document.getElementById("bp-expenses").value) || 0;
  const taxesAmount =
    Number(document.getElementById("taxes-amount").value) || 0;
  const driverSalary =
    Number(document.getElementById("driver-salary").value) || 0;
  const haltingCharges =
    Number(document.getElementById("halting-charges").value) || 0;

  // Calculate total expenses
  const totalExpenses =
    dieselAmount +
    tollGateExpense +
    otherExpenses +
    bpExpenses +
    taxesAmount +
    driverSalary +
    haltingCharges;
  document.getElementById("total-expenses").value = totalExpenses;

  // Revenue calculations
  const movementRate =
    Number(document.getElementById("movement-rate").value) || 0;
  const invoiceAmount =
    Number(document.getElementById("invoice-amount").value) || 0;
  const advancePaid =
    Number(document.getElementById("advance-paid").value) || 0;

  document.getElementById("invoice-amount").value =
    totalExpenses + haltingCharges + movementRate;
  // Calculate balance to receive
  const balanceToReceive = invoiceAmount - advancePaid;
  document.getElementById("balance-to-receive").value = balanceToReceive;

  // Calculate net margin
  const netMargin = invoiceAmount - totalExpenses;
  document.getElementById("net-margin").value = netMargin;
}

// Setup event listeners for calculation fields
function setupCalculationListeners() {
  // Mileage calculation fields
  document
    .getElementById("start-reading")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("closing-reading")
    .addEventListener("input", calculateTotals);

  // Fuel calculation fields
  document
    .getElementById("diesel-quantity")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("diesel-amount")
    .addEventListener("input", calculateTotals);

  // Expense fields
  document
    .getElementById("toll-gate-expense")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("other-expenses")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("bp-expenses")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("taxes-amount")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("driver-salary")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("halting-charges")
    .addEventListener("input", calculateTotals);

  // Revenue fields
  document
    .getElementById("movement-rate")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("invoice-amount")
    .addEventListener("input", calculateTotals);
  document
    .getElementById("advance-paid")
    .addEventListener("input", calculateTotals);
}

// Delete confirmation using SweetAlert
function confirmDelete(event, itemId) {
  event.preventDefault(); // Prevent direct navigation

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b46c1",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = `Expdelete/${itemId}`; // Proceed with deletion
    }
  });
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

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// References to DOM elements (ensure these selectors match your HTML)
const vehicleNumbers = document.querySelectorAll(
  ".vehicle-numbers .nav-button"
);
let activeVehicleFilter = "2356";
let activeSearchFilter = "";

// Combined filtering function: both filters must match for a row to be shown.
function performSearch(searchTerm) {
  console.log(
    "Filtering with vehicle:",
    activeVehicleFilter,
    "and search:",
    searchTerm
  );
  const searchLower = searchTerm.toLowerCase();

  tableBody.querySelectorAll("tr").forEach((row) => {
    // Check for vehicle filter match: each row must include the active vehicle number.
    let matchesVehicle = false;
    row.querySelectorAll("td").forEach((cell) => {
      if (cell.textContent.includes(activeVehicleFilter)) {
        matchesVehicle = true;
      }
    });

    // Check for search filter match (if any search text is provided)
    let matchesSearch = true;
    if (searchLower) {
      matchesSearch = false;
      row.querySelectorAll("td").forEach((cell) => {
        if (cell.textContent.toLowerCase().includes(searchLower)) {
          matchesSearch = true;
        }
      });
    }

    // Show row only if it matches both filters.
    row.style.display = matchesVehicle && matchesSearch ? "" : "none";
  });
}

// Vehicle button filtering:
vehicleNumbers.forEach((button) => {
  button.addEventListener("click", function () {
    // If the clicked button is already active…
    if (this.classList.contains("active-nav")) {
      // ...and it's not the default ("2356"), revert to default filter.
      if (this.id !== "2356") {
        vehicleNumbers.forEach((btn) => btn.classList.remove("active-nav"));
        const defaultBtn = document.querySelector(
          '.vehicle-numbers .nav-button[id="2356"]'
        );
        if (defaultBtn) {
          defaultBtn.classList.add("active-nav");
        }
        activeVehicleFilter = "2356";
        performSearch(activeSearchFilter);
      } else {
        performSearch(activeSearchFilter);
      }
    } else {
      vehicleNumbers.forEach((btn) => btn.classList.remove("active-nav"));
      this.classList.add("active-nav");
      activeVehicleFilter = this.id;
      performSearch(activeSearchFilter);
    }
  });
});

const debounceSearch = (func, delay = 200) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), delay);
  };
};

// Search input filtering: applies its filter on top of the current vehicle filter.
searchInput.addEventListener(
  "input",
  debounceSearch((e) => {
    activeSearchFilter = e.target.value.trim();
    performSearch(activeSearchFilter);
  })
);

// Run the initial filtering so only vehicle "2356" rows are shown.
performSearch("");

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// Initialize all event listeners on DOM load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".caps").forEach((input) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  });
  const toggleIcons = (showSearch) => {
    searchIcon.style.display = showSearch ? "block" : "none";
    closeIcon.style.display = showSearch ? "none" : "block";
  };

  searchIcon.onclick = () => {
    searchBox.classList.add("active");
    searchBox.focus();
    toggleIcons(false);
  };

  closeIcon.onclick = () => {
    searchBox.classList.remove("active");
    searchBox.value = "";
    toggleIcons(true);
    // Reset search results
    tableBody.querySelectorAll("tr").forEach((row) => {
      row.style.display = "";
    });
  };

  searchBox.oninput = () => toggleIcons(!searchBox.value);

  // Setup autofill for relevant fields
  setupAutofill("customer", "customer-autofill-hint", "customer");
  setupAutofill("from", "from-autofill-hint", "from");
  setupAutofill("to", "to-autofill-hint", "to");
  setupAutofill("back-to", "back-to-autofill-hint", "backTo");
  setupAutofill("driver-name", "driver-name-autofill-hint", "driverName");
  setupAutofill(
    "vehicle-number",
    "vehicle-number-autofill-hint",
    "vehicleNumber"
  );
  setupCalculationListeners();
});
