// Initialize date pickers with Flatpickr
flatpickr("input[type='date']", {
    dateFormat: "Y-m-d",
    theme: "dark",
  });
  
  // DOM element selections
  const searchIcon = document.querySelector(".search-icon");
  const closeIcon = document.querySelector(".close-icon");
  const searchBox = document.querySelector(".search");
  const searchInput = document.querySelector('.search');
  const tableBody = document.querySelector('tbody');
  const addExpenseBtn = document.querySelector(".add-expense");
  const clearBtn = document.querySelector(".clear");
  
  // Store original table rows for search reset
  let originalRows = Array.from(tableBody.querySelectorAll('tr'));
  
  // Toggle the popup form visibility
  function toggleForm() {
    const form = document.getElementById("popupForm");
    const overlay = document.getElementById("overlay");
    const isVisible = form.style.display === "grid";
    form.style.display = isVisible ? "none" : "grid";
    overlay.style.display = isVisible ? "none" : "block";
  }
  
  // Clear all form inputs
  function clearForm() {
    document
      .querySelectorAll("#popupForm input, #popupForm select")
      .forEach((input) => (input.value = ""));
  }
  
  // Calculate all dependent fields
  function calculateTotals() {
    // Mileage calculations
    const startReading = Number(document.getElementById("start-reading").value) || 0;
    const closingReading = Number(document.getElementById("closing-reading").value) || 0;
    const totalKms = startReading-closingReading;
    document.getElementById("total-kms").value = totalKms;
  
    // Fuel efficiency calculation
    const dieselQuantity = Number(document.getElementById("diesel-quantity").value) || 0;
    if (dieselQuantity > 0 && totalKms > 0) {
      const kmsPerLiter = totalKms / dieselQuantity;
      document.getElementById("kms-per-liter").value = kmsPerLiter.toFixed(2);
    }
  
    // Expenses calculations
    const dieselAmount = Number(document.getElementById("diesel-amount").value) || 0;
    const tollGateExpense = Number(document.getElementById("toll-gate-expense").value) || 0;
    const otherExpenses = Number(document.getElementById("other-expenses").value) || 0;
    const bpExpenses = Number(document.getElementById("bp-expenses").value) || 0;
    const taxesAmount = Number(document.getElementById("taxes-amount").value) || 0;
    const driverSalary = Number(document.getElementById("driver-salary").value) || 0;
    const haltingCharges = Number(document.getElementById("halting-charges").value) || 0;
  
    // Calculate total expenses
    const totalExpenses = dieselAmount + tollGateExpense + otherExpenses + 
                          bpExpenses + taxesAmount + driverSalary + haltingCharges;
    document.getElementById("total-expenses").value = totalExpenses;
    
    // Revenue calculations
    const movementRate = Number(document.getElementById("movement-rate").value) || 0;
    const invoiceAmount = Number(document.getElementById("invoice-amount").value) || 0;
    const advancePaid = Number(document.getElementById("advance-paid").value) || 0;
    
    document.getElementById("invoice-amount").value = totalExpenses+haltingCharges+movementRate
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
    document.getElementById("start-reading").addEventListener("input", calculateTotals);
    document.getElementById("closing-reading").addEventListener("input", calculateTotals);
    
    // Fuel calculation fields
    document.getElementById("diesel-quantity").addEventListener("input", calculateTotals);
    document.getElementById("diesel-amount").addEventListener("input", calculateTotals);
    
    // Expense fields
    document.getElementById("toll-gate-expense").addEventListener("input", calculateTotals);
    document.getElementById("other-expenses").addEventListener("input", calculateTotals);
    document.getElementById("bp-expenses").addEventListener("input", calculateTotals);
    document.getElementById("taxes-amount").addEventListener("input", calculateTotals);
    document.getElementById("driver-salary").addEventListener("input", calculateTotals);
    document.getElementById("halting-charges").addEventListener("input", calculateTotals);
    
    // Revenue fields
    document.getElementById("movement-rate").addEventListener("input", calculateTotals);
    document.getElementById("invoice-amount").addEventListener("input", calculateTotals);
    document.getElementById("advance-paid").addEventListener("input", calculateTotals);
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
  
  // Setup autofill functionality for input fields
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
  
  // Search function that checks all columns
  function performSearch(searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    const filterType = document.getElementById("filters").value;
    
    tableBody.querySelectorAll('tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      let match = false;
      
      if (filterType && filterType !== "") {
        // Filter by specific column based on selected filter
        let columnIndex = -1;
        switch(filterType) {
          case "contrNo": columnIndex = 2; break; // Container No column
          case "customer": columnIndex = 4; break; // Customer column
          case "from": columnIndex = 5; break; // From column
          case "to": columnIndex = 6; break; // To column
          case "driverName": columnIndex = 27; break; // Driver Name column
        }
        
        if (columnIndex >= 0 && columnIndex < cells.length) {
          const cell = cells[columnIndex];
          const cellText = cell.textContent.toLowerCase();
          match = cellText.includes(searchLower);
        }
      } else {
        // Check all columns if no filter selected
        cells.forEach(cell => {
          const cellText = cell.textContent.toLowerCase();
          if (cellText.includes(searchLower)) {
            match = true;
          }
        });
      }
      
      // Show/hide row based on match
      row.style.display = match ? '' : 'none';
    });
  }
  
  // Debounce function for search
  const debounceSearch = (func, delay = 200) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };
  
  // Initialize all event listeners on DOM load
  document.addEventListener("DOMContentLoaded", () => {
    // Convert input to uppercase for specified fields
    document.querySelectorAll(".caps").forEach((input) => {
      input.addEventListener("input", function () {
        this.value = this.value.toUpperCase();
      });
    });
  
    // Search box toggle functionality
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
      tableBody.querySelectorAll('tr').forEach(row => {
        row.style.display = '';
      });
    };
    
    searchBox.oninput = () => toggleIcons(!searchBox.value);
  
    // Add filter change listener
    document.getElementById("filters").addEventListener('change', () => {
      if (searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
      }
    });
  
    // Add search input listener
    searchInput.addEventListener('input', debounceSearch((e) => {
      performSearch(e.target.value.trim());
    }));
  
    // Setup autofill for relevant fields
    setupAutofill("customer", "customer-autofill-hint", "customer");
    setupAutofill("from", "from-autofill-hint", "from");
    setupAutofill("to", "to-autofill-hint", "to");
    setupAutofill("back-to", "back-to-autofill-hint", "backTo");
  
    // Setup calculation listeners
    setupCalculationListeners();
  });

  // Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select all date inputs properly
    const dateInputs = document.querySelectorAll("input[type='date']");
    
    // Initialize flatpickr on each date input
    dateInputs.forEach(function(input) {
      flatpickr(input, {
        dateFormat: "d-m-Y", // Format as DD-MM-YYYY
        altFormat: "d-m-Y",
        altInput: true,      // Creates a second, formatted input
        theme: "dark",
        // Format the date when changed
        onChange: function(selectedDates, dateStr, instance) {
          // You can add additional logic here if needed
          console.log("Selected date:", dateStr);
        }
      });
    });
  });