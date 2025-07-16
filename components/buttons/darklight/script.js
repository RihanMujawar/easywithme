function toggleMode() {
  document.body.classList.toggle("dark-mode");
  const btn = document.querySelector(".btn-toggle-mode");
  btn.textContent = document.body.classList.contains("dark-mode") ? "☀ Light Mode" : "🌙 Dark Mode";
}