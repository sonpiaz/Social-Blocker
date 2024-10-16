chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockingEnabled) {
    updateBlockingRules(changes.blockingEnabled.newValue);
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "unblockAlarm") {
    chrome.storage.local.set({ blockingEnabled: true });
  }
});

function updateBlockingRules(enable) {
  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: enable ? ["block_rules"] : [],
    disableRulesetIds: enable ? [] : ["block_rules"]
  });
}
