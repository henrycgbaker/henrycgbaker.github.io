// Dark Mode Toggle
(function () {
  // Check system preference and stored preference
  function getDarkModePreference() {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      return stored === "true";
    }
    // If no stored preference, check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyDarkMode(isDark) {
    if (isDark) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
    updateToggleButton(isDark);
  }

  function updateToggleButton(isDark) {
    const toggle = document.getElementById("dark-mode-toggle");
    if (toggle) {
      toggle.innerHTML = isDark ? "☀️" : "🌙";
      toggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
    }
  }

  function toggleDarkMode() {
    const isDark = !document.documentElement.classList.contains("dark-mode");
    applyDarkMode(isDark);
  }

  // Initialize on page load
  document.addEventListener("DOMContentLoaded", function () {
    const isDark = getDarkModePreference();
    applyDarkMode(isDark);

    // Add toggle button click handler
    const toggle = document.getElementById("dark-mode-toggle");
    if (toggle) {
      toggle.addEventListener("click", toggleDarkMode);
    }
  });

  // Listen for system preference changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      // Only auto-switch if user hasn't set a preference
      if (localStorage.getItem("darkMode") === null) {
        applyDarkMode(e.matches);
      }
    });
})();
