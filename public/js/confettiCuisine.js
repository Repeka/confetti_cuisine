document.addEventListener("DOMContentLoaded", () => {
  const here = window.location.pathname;
  document.querySelectorAll(".navbar a").forEach((link) => {
    if (link.getAttribute("href") === here) {
      link.style.textDecoration = "underline";
    }
  });
});