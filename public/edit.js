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
