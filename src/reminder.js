import { auth, db } from "./firebaseConfig.js";
import { updateDoc } from "firebase/firestore";
import { convertToDate, calculateDaysLeft } from "./calculateDate.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";

// Holds all reminder objects currently loaded from Firestore
// Used as the base list for filtering
let allReminders = [];
// Tracks which filter is active: "all", "soon", or "expired"
let currentFilter = "all";

/**
 * Render reminder items into the HTML list.
 * It creates the DOM elements for each reminder and attaches delete handlers.
 *
 * @param {Array} reminders - List of reminder objects to display.
 */
function renderReminders(reminders) {
  const container = document.getElementById("reminder-list");
  if (!reminders.length) {
    container.innerHTML = `<li class="text-gray-500">No reminders yet.</li>`;
    return;
  }
  container.innerHTML = reminders
    .map(
      (r) => `
      <li class="p-4 bg-[--bg-color] border border-[--secondary-bg-color] rounded-lg flex justify-between items-center">
        <div>
          <p class="font-medium text-[--text-color]">${r.name}</p>
          <p class="text-sm text-[--secondary-text-color]">
            Expires ${
              r.daysLeft < 0 ? "already expired" : `in ${r.daysLeft} day(s)`
            } (${r.expiryDate})
          </p>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs font-semibold ${r.color}">${r.status}</span>
          <button
            class="delete-btn p-2 rounded-md bg-[--secondary-bg-color] hover:bg-red-100 transition"
            data-id="${r.id}"
            title="Delete reminder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="2" stroke="black" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6 7h12M9 7V4h6v3m-7 4v9m4-9v9m4-9v9M5 7h14v13a2 2 0 01-2 2H7a2 2 0 01-2-2V7z"/>
            </svg>
          </button>
        </div>
      </li>`
    )
    .join("");

  // Attach delete event listeners
  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      if (!id) return;

      if (confirm("Are you sure you want to delete this reminder?")) {
        try {
          const user = auth.currentUser;

          // Database WRITE:
          // Instead of deleting the document, mark reminder as disabled
          await updateDoc(doc(db, "users", user.uid, "foodlog", id), {
            reminders: false,
          });
          console.log("Reminder disabled:", id);
        } catch (err) {
          console.error("Delete failed:", err);
          alert("Could not delete this reminder.");
        }
      }
    });
  });
}

/**
 * Load reminders from Firestore in real-time.
 * Converts dates, calculates days left, determines status,
 * and updates the UI summary and reminder list.
 *
 * @param {Object} user - The logged-in Firebase user.
 */
function loadReminders(user) {
  const today = new Date();

  // Database QUERY:
  // Listen to all foodlog items for this user, ordered by expiry date
  const q = query(
    collection(db, "users", user.uid, "foodlog"),
    orderBy("expDate")
  );

  // Real-time listener for this query
  onSnapshot(q, (snapshot) => {
    const reminders = [];
    let expiringSoon = 0;
    let expired = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Skip items without expiry date or without reminder turned on
      if (!data.expDate || !data.reminders) return;
      const expiry = convertToDate(data.expDate);
      const daysLeft = calculateDaysLeft(expiry);
      let status = "";
      let color = "";

      // Determine item freshness status
      if (daysLeft < 0) {
        status = "Expired";
        color = "text-red-600";
        expired++;
      } else if (daysLeft <= 3) {
        status = "Soon";
        color = "text-yellow-600";
        expiringSoon++;
      } else {
        status = "Fresh";
        color = "text-[--highlight-text-color]";
      }

      reminders.push({
        id: docSnap.id,
        name: data.name || "(unnamed)",
        expiryDate: expiry.toLocaleDateString(),
        daysLeft,
        status,
        color,
      });
    });

    document.getElementById("expiring-soon").textContent = expiringSoon;
    document.getElementById("expired").textContent = expired;

    // Save full list for filters and render to page
    allReminders = reminders;
    renderReminders(allReminders);
  });
}

// Watch authentication state
auth.onAuthStateChanged((user) => {
  const container = document.getElementById("reminder-list");

  if (!user) {
    container.innerHTML = `<li class="text-red-600">Please log in to view reminders.</li>`;
    return;
  }

  // User is logged in: start real-time listener
  loadReminders(user);

  document.getElementById("filter-soon").addEventListener("click", () => {
    filterReminders("soon");
  });
  document.getElementById("filter-expired").addEventListener("click", () => {
    filterReminders("expired");
  });
});

/**
 * Filter reminders based on type: "all", "soon", or "expired".
 * Also highlights the selected filter card.
 *
 * @param {string} type - The filter type selected by the user.
 */
function filterReminders(type) {
  if (currentFilter === type) {
    // Clicking the same filter again: reset to show all reminders
    currentFilter = "all";
    renderReminders(allReminders);
    highlightCard("all");
    return;
  }

  currentFilter = type;

  let filtered = allReminders;

  if (type === "soon") {
    filtered = allReminders.filter((r) => r.status === "Soon");
  } else if (type === "expired") {
    filtered = allReminders.filter((r) => r.status === "Expired");
  }

  renderReminders(filtered);
  highlightCard(type);
}
// Make highlight color when click on the card
function highlightCard(active) {
  const soon = document.getElementById("filter-soon");
  const expired = document.getElementById("filter-expired");

  // Clear previous highlight styles.
  soon.classList.remove("bg-yellow-100");
  expired.classList.remove("bg-red-100");
  if (active === "all") {
    return;
  }
  if (active === "soon") {
    soon.classList.add("bg-yellow-100");
  } else if (active === "expired") {
    expired.classList.add("bg-red-100");
  }
}
