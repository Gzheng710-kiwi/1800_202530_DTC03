


// --- Function to Save Food ---
/**
 * 
 * @param {string} _name 
 * @param {Date} _expDate 
 * @param {boolean} _reminders 
 * @param {string} imageUrl 
 */

export function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.remove("hidden");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("hidden");
  }, 3500); // hide after 2.5 seconds
}