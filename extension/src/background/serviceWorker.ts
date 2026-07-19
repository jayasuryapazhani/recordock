chrome.runtime.onInstalled.addListener(() => {
  console.info("Recordock extension installed.");

  void chrome.action.setBadgeText({
    text: "",
  });
});

chrome.runtime.onStartup.addListener(() => {
  console.info("Recordock service worker started.");
});

export {};