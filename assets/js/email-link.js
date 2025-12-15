// Ensure email links work properly
document.addEventListener("DOMContentLoaded", function () {
  // Find all mailto links and ensure they're clickable
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

  emailLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Allow default mailto behavior
      const href = this.getAttribute("href");
      if (href) {
        // This should trigger the system's default email handler
        window.location.href = href;
      }
    });
  });
});
