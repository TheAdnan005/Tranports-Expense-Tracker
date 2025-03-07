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
      window.location.href = `delete/${itemId}`; // Proceed with deletion
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
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
  };
  searchBox.oninput = () => toggleIcons(!searchBox.value);
});

function setupAutofill(inputId, hintId, field) {

  const input = document.querySelector(`#${inputId}`);
  const hint = document.querySelector(`#${hintId}`);
  hint.classList.add("autofill-hint");
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
      const response = await fetch(`/search?q=${query}&field=${field}`);
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

// Initialize autofill for each field
document.addEventListener("DOMContentLoaded", () => {
  setupAutofill("vehicle-no", "vehicle-no-autofill-hint", "vehicleNo");
  setupAutofill("cargo", "cargo-autofill-hint", "cargo");
  setupAutofill("on-ac", "on-ac-autofill-hint", "onAccount");
  setupAutofill("bill-to", "bill-to-autofill-hint", "billTo");
  setupAutofill("from", "from-autofill-hint", "from");
  setupAutofill("to", "to-autofill-hint", "to");
  setupAutofill(
    "laden-contr-offload",
    "laden-contr-offload-autofill-hint",
    "ladenContainerOffload"
  );
  setupAutofill("transporter", "transporter-autofill-hint", "transporter");

  setupAutofill("edit-vehicle-no", "edit-vehicle-no-hint", "vehicleNo");
  setupAutofill("edit-cargo", "edit-cargo-hint", "cargo");
  setupAutofill("edit-transporter", "edit-transporter-hint", "transporter");
  setupAutofill("edit-from", "edit-from-hint", "from");
  setupAutofill("edit-to", "edit-to-hint", "to");
  setupAutofill(
    "edit-laden-contr-offload",
    "edit-laden-contr-offload-hint",
    "ladenContainerOffload"
  );
});

document.addEventListener("DOMContentLoaded", () => {
  const fields = [
    { id: "edit-vehicle-no", field: "vehicleNo" },
    { id: "edit-cargo", field: "cargo" },
    { id: "edit-transporter", field: "transporter" },
    { id: "edit-from", field: "from" },
    { id: "edit-to", field: "to" },
    { id: "editladen-contr-offload", field: "ladenContainerOffload" },
  ];

  fields.forEach(({ id, field }) => {
    setupAutofill(id, `${id}-hint`, field);
    console.log("sent to process");
  });

  flatpickr(".accent-purple", {
    allowInput: true,
    dateFormat: "Y-m-d",
    defaultDate: null,
  });
});

addEntryBtn.addEventListener("click", toggleForm);
clearBtn.addEventListener("click", resetForm);
searchIcon.addEventListener("click", () => searchBox.classList.add("active"));
closeIcon.addEventListener("click", () => searchBox.classList.remove("active"));
