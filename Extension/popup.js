/*popup.js
handles user interactions in the popup, including loading/saving paths,
enabling picker mode, and copying selectors to clipboard. 
Communicates with content.js to manage picker state and update stored paths based on user selections.
*/

//Field keys mapped to user-friendly names for status messages
const FIELDS = {
  review: "review",
  title: "title",
  image: "image",
  description: "description",
};


// when clicking pick button,
// enable picker mode allowing user to click on page element and save its selector
document.querySelectorAll(".pick-btn").forEach((btn) => {

    btn.addEventListener("click", async (e) => {
      
    const type = e.target.getAttribute("data-type");//data type (review, title, image, description) stored in button's data-type attribute
    showStatus(`Choose ${FIELDS[type]}...`, "info");
    
    const [tab] = await chrome.tabs.query({active: true,currentWindow: true,}); 
    chrome.tabs.sendMessage(tab.id,{action: "ENABLE_PICKER",type: type,})//send message to content.js to enable picker mode with the active type
    .catch((err) => console.log("ERROR:", err));//catch error if content script needed 

    setTimeout(() => {
      loadPaths();
      document.querySelectorAll(".pick-btn").
      forEach((b) => b.classList.remove("active"));}
      ,2000);//Load paths again after 2 seconds to reflect any changes (in case user picks something and then clicks pick again without closing popup)

  });
});




// Query the active tab and send a message to content.js to enable picker mode
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const type = e.target.getAttribute("data-type");
    const input = document.getElementById(type);
    const path = input.value;
    if (!path) {
      showStatus(`Please select a ${FIELDS[type]} first`, "info");
      return;
    }
    navigator.clipboard.writeText(path).then(() => {
        showStatus(`✓ ${FIELDS[type]} copied!`, "success");
      })
      .catch(() => {
        showStatus(`Error copying ${FIELDS[type]} `, "info");
      });
  });
});




//Load values from storage into inputs
function loadPaths() {
  chrome.storage.local.get(
    ["review", "title", "image", "description"],
    (data) => {
      Object.keys(FIELDS).forEach((key) => {
        const input = document.getElementById(key);
        if (input && data[key]) {
          input.value = data[key];
        } else if (input) {
          input.value = "";
        }
      });
    },
  );
}

//show status messages in the popup for user feedback when copying or picking elements
function showStatus(message, type = "info") {
  const statusEl = document.getElementById("status");
  statusEl.textContent = message;
  statusEl.className = "status " + type;
}

//Load paths when popup is opened
//Only after that, set up event listeners for copy buttons to allow copying selectors to clipboard
document.addEventListener("DOMContentLoaded", () => {
  loadPaths();
  console.log("DOM fully loaded and parsed");
  });


