const ENABLED_KEY = "byebyeshorts_enabled";
const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

function updateUI(isEnabled) {
  toggle.checked = isEnabled;
  status.textContent = isEnabled ? "Shorts are hidden" : "Shorts are visible";
  status.className = isEnabled ? "status active" : "status";
}

chrome.storage.local.get(ENABLED_KEY, (result) => {
  updateUI(result[ENABLED_KEY] !== false);
});

toggle.addEventListener("change", () => {
  const isEnabled = toggle.checked;
  chrome.storage.local.set({ [ENABLED_KEY]: isEnabled });
  updateUI(isEnabled);
});
