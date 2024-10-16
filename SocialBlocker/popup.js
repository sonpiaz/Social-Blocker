document.addEventListener("DOMContentLoaded", () => {
  const toggleBlock = document.getElementById("toggle-block");
  const statusLabel = document.getElementById("status");

  // Lấy trạng thái ban đầu
  chrome.storage.local.get("blockingEnabled", (data) => {
    const isEnabled = data.blockingEnabled !== false; // Default là true nếu chưa được thiết lập
    toggleBlock.checked = isEnabled;
    statusLabel.textContent = isEnabled ? "Status: Blocking enabled" : "Status: Blocking disabled for 5 minutes";
  });

  // Khi nhấn nút bật/tắt
  toggleBlock.addEventListener("change", () => {
    chrome.storage.local.get("blockingEnabled", (data) => {
      const isEnabled = data.blockingEnabled !== false;
      if (isEnabled) {
        // Tắt chặn trong 5 phút
        chrome.storage.local.set({ blockingEnabled: false });
        chrome.alarms.create("unblockAlarm", { delayInMinutes: 5 });
        statusLabel.textContent = "Status: Blocking disabled for 5 minutes";
        alert("Blocking disabled for 5 minutes.");
      } else {
        // Bật lại chặn
        chrome.storage.local.set({ blockingEnabled: true });
        statusLabel.textContent = "Status: Blocking enabled";
        alert("Blocking enabled.");
      }
    });
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "unblockAlarm") {
    chrome.storage.local.set({ blockingEnabled: true });
    const statusLabel = document.getElementById("status");
    if (statusLabel) {
      statusLabel.textContent = "Status: Blocking enabled";
    }
  }
});
