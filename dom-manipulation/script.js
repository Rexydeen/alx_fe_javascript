let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categorySelect = document.getElementById("categorySelect");
const categoryFilter = document.getElementById("categoryFilter");

// Convert string to Title Case
function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Populate dropdown with unique categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  
  // Populate main category select
  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // Populate category filter with "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Auto-select previously chosen filter
  const savedCategory = localStorage.getItem('selectedCategory') || "all";
  categoryFilter.value = savedCategory;
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote from selected filter category
function displayRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Show a random quote from the category dropdown
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" - ${filteredQuotes[randomIndex].category}`;
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const categoryInput = document.getElementById("newQuoteCategory").value.trim();
  const category = toTitleCase(categoryInput);

  if (!text || !category) {
    alert("Please fill out both fields.");
    return;
  }

  const exists = quotes.some(q => q.text === text && q.category === category);
  if (exists) {
    alert("This quote already exists.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  categorySelect.value = category;
  showRandomQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added!");
}

// Filter quotes by selected category
function filterQuotes() {
  const category = categoryFilter.value;
  localStorage.setItem("selectedCategory", category);
  displayRandomQuote();
}

// Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        displayRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Restore last quote on page load
window.addEventListener("DOMContentLoaded", () => {
  populateCategories();

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
  } else {
    displayRandomQuote();
  }
});

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);