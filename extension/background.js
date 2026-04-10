chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "send-to-localmind",
    title: "Send to LocalMind",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "send-to-localmind" && info.selectionText) {
    const textBlob = new Blob([info.selectionText], { type: "text/plain" });
    const formData = new FormData();
    formData.append("file", textBlob, "clipped_snippet.txt");

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      
      // Auto-trigger the generator blindly for the new clipped snippet
      if(result.id) {
         fetch(`http://localhost:8000/generate/${result.id}`, { method: "POST" });
      }
    } catch (e) {
      console.error("LocalMind Backend is unreachable.");
    }
  }
});
