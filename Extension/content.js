/*content.js

handles user interactions in the content script, 
including enabling picker mode and generating CSS selectors.
Communicates with popup.js to manage picker state and update stored paths based on user selections.

*/

let pickerActive = false;  // Is picker mode active?
let activeType = null;     // Current data type (title, image, etc.)
let highlightedElement = null;  // Currently highlighted element
let originalStyles = new Map();  // Stores original element styles

// Listen for messages to enable picker mode from popup, storing the active type in local storage
// and changing cursor
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'ENABLE_PICKER') {
    pickerActive = true;
    activeType = request.type;
    document.body.style.cursor = 'crosshair';
    document.body.style.userSelect = 'none';
  }
});

// Highlight elements on hover when picker is active
document.addEventListener('mouseover', (e) => {
  if (!pickerActive) return;
  e.preventDefault();
  highlightElement(e.target);
}, true);

// Remove highlight on mouse leave
document.addEventListener('mouseout', (e) => {
  if (!pickerActive) return;
  removeHighlight();
}, true);


/* Handle clicks to select elements and save selectors
When user clicks an element in picker mode, generate a CSS selector for that element,
save it to local storage under the active type, and exit picker mode. 
*/

document.addEventListener('click', (e) => {
  if (!pickerActive) return;
  e.preventDefault();
  e.stopPropagation();
  const selector = getOptimalSelector(e.target);
  let data = {};
  data[activeType] = selector;
  chrome.storage.local.set(data, () => {
    pickerActive = false;
    activeType = null;
    removeHighlight();
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  });
}, true);



// Generate optimal CSS selector for an element
function getOptimalSelector(el) {
  if (el.id && el.id.trim()) {
    return `#${el.id}`;
  }

  if (el.classList.length > 0) {
    const classes = Array.from(el.classList).join('.');
    return `${el.tagName.toLowerCase()}.${classes}`;
  }
}

// Highlight an element with red styling
function highlightElement(el) {
  if (highlightedElement) {
    if (originalStyles.has(highlightedElement)) {
      const original = originalStyles.get(highlightedElement);
      Object.assign(highlightedElement.style, original);
      originalStyles.delete(highlightedElement);
    }
  }

  originalStyles.set(el, {
    outline: el.style.outline,
    outlineOffset: el.style.outlineOffset,
    backgroundColor: el.style.backgroundColor,
    boxShadow: el.style.boxShadow
  });

  el.style.outline = '3px solid rgb(234, 67, 53)';
  el.style.outlineOffset = '-3px';
  el.style.backgroundColor = 'rgba(234, 67, 53, 0.15)';
  el.style.boxShadow = 'inset 0 0 10px rgba(234, 67, 53, 0.3)';

  highlightedElement = el;
}

// Remove highlight and restore original styles
function removeHighlight() {
  if (highlightedElement && originalStyles.has(highlightedElement)) {
    const original = originalStyles.get(highlightedElement);
    Object.assign(highlightedElement.style, original);
    originalStyles.delete(highlightedElement);
    highlightedElement = null;
  }
}

