/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
chrome.runtime.onInstalled.addListener(() => {
  // Parent menu item
  chrome.contextMenus.create({
    id: "parent",
    title: "AfBuddy",
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "child1",
    parentId: "parent",
    title: "Open Settings",
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "child2",
    parentId: "parent",
    title: "Inspiration Quote of the Day",
    contexts: ["all"],
  });
});

function openAfBuddyPopup() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab?.id) {
      chrome.tabs.sendMessage(currentTab.id, { action: "openAfBuddyPopup" });
    }
  });
}

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  switch (info.menuItemId) {
    case "child1":
      openAfBuddyPopup();
      break;
    case "child2":
      const quotes = [
        "No Workflow - No Problem. – Modestas",
        "Pixelated dreams in a JSON soup. – VectorVic",
        "Rendered sunsets, but the server still whispers null. – APIrl",
        "Binary trees, yet leaves still float on Ethernet waves. – BotanicByte",
        "Drop shadows in a world of 404 moonlight. – LunarLana",
        "Where the DOM dances, pixel pixies prance. – MysticMesh",
        "Cascading silhouettes, still seeking the right selector. – StylishStu",
        "A responsive heart beats in media queries. – ViewVera",
        "Methods are many, but the logic remains elusive. – FuncFinn",
        "Flows fluid as flexbox, yet grids gridlock my dreams. – FlexFlynn",
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

      chrome.notifications.create({
        type: "basic",
        iconUrl: require("../../assets/icons/quote.png"),
        title: "Inspiration Quote of the Day",
        message: randomQuote,
      });
      break;
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab?.id) {
        chrome.tabs.sendMessage(currentTab.id, message);
      }
    });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "getdata") {
    try {
      const response = await fetch(request.url);
      const data = await response.text();
      console.log("Data fetched:", data);
      sendResponse({ themeData: data });
    } catch (error) {
      console.log("Error fetching data:", error);
    }
    return true;
  }
  return false;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === "getWeatherData") {
    console.log("Sending weather data:", request);
    sendResponse(request);
  }
});
