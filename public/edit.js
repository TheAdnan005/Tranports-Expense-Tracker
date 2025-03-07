document.addEventListener("DOMContentLoaded", function () {
  flatpickr("input[type='date']", {
    dateFormat: "Y-m-d",
    theme: "dark",
  });
});

function calculateEditTotal() {
  const rate = Number(document.getElementById("edit-rate").value) || 0;
  const halting = Number(document.getElementById("edit-halting").value) || 0;
  const total = rate + halting;
  document.getElementById("edit-total").value = total;

  const advance = Number(document.getElementById("edit-advance").value) || 0;
  const balance = total - advance;
  document.getElementById("edit-balance").value = balance;

  const billingRate =
    Number(document.getElementById("edit-billing-rate").value) || 0;
  const emptyPickupExp =
    Number(document.getElementById("edit-empty-pickup-exp").value) || 0;
  const haltingTwo =
    Number(document.getElementById("edit-halting-2").value) || 0;
  const billingAmount = billingRate + emptyPickupExp + haltingTwo;
  document.getElementById("edit-billing-amount").value = billingAmount;

  const tdsInput = document.getElementById("edit-tds-deducted");
  if (!tdsInput.dataset.manualChange) {
    tdsInput.value = (billingAmount * 0.01).toFixed(2);
  }

  const businessPromotion =
    Number(document.getElementById("edit-business-promotion").value) || 0;
  const tripExpenses =
    Number(document.getElementById("edit-expenses").value) || 0;

  document.getElementById("edit-margin").value =
    billingAmount - tripExpenses - businessPromotion;
}

document
  .getElementById("edit-tds-deducted")
  .addEventListener("input", function () {
    this.dataset.manualChange = "true";
  });

document
  .getElementById("edit-rate")
  .addEventListener("input", calculateEditTotal);
document
  .getElementById("edit-halting")
  .addEventListener("input", calculateEditTotal);
document
  .getElementById("edit-advance")
  .addEventListener("input", calculateEditTotal);
document
  .getElementById("edit-billing-rate")
  .addEventListener("input", calculateEditTotal);
document
  .getElementById("edit-empty-pickup-exp")
  .addEventListener("input", calculateEditTotal);
document
  .getElementById("edit-halting-2")
  .addEventListener("input", calculateEditTotal);

document
  .getElementById("edit-business-promotion")
  .addEventListener("input", calculateEditTotal);
document
  .getElementById("edit-expenses")
  .addEventListener("input", calculateEditTotal);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#edit-form input").forEach((input) => {
    input.addEventListener("input", function () {
      if (this.classList.contains("caps")) {
        this.value = this.value.toUpperCase();
      }
    });
  });
});

// Function to set up autofill for edit form fields
function setupEditAutofill(inputId, hintId, field) {
  const input = document.querySelector(`#${inputId}`);
  if (!input) {
    console.error(`Input element #${inputId} not found`);
    return;
  }
  
  const hint = document.querySelector(`#${hintId}`);
  if (!hint) {
    console.error(`Hint element #${hintId} not found`);
    return;
  }
  
  hint.classList.add("edit-autofill-hint");
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

// Initialize autofill for edit form fields
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing edit form autofill...");
  setupEditAutofill("edit-vehicle-no", "edit-vehicle-no-hint", "vehicleNo");
  setupEditAutofill("edit-on-ac", "edit-on-ac-hint", "onAccount");
  setupEditAutofill("edit-bill-to", "edit-bill-to-hint", "billTo");
  setupEditAutofill("edit-cargo", "edit-cargo-hint", "cargo");
  setupEditAutofill("edit-from", "edit-from-hint", "from");
  setupEditAutofill("edit-to", "edit-to-hint", "to");
  setupEditAutofill(
    "edit-laden-contr-offload",
    "edit-laden-contr-offload-hint",
    "ladenContainerOffload"
  );
  setupEditAutofill("edit-transporter", "edit-transporter-hint", "transporter");
  
  console.log("Edit form autofill initialization complete");
});
