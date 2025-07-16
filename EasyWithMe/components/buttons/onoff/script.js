function toggleSwitch(btn) {
  btn.classList.toggle("on");
  btn.textContent = btn.classList.contains("on") ? "ON" : "OFF";
}