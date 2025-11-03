import { auth, db } from "./firebaseConfig.js";
import { updateDoc } from "firebase/firestore";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

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

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      if (!id) return;

      if (confirm("Are you sure you want to delete this reminder?")) {
        try {
          const user = auth.currentUser;
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

function loadReminders(user) {
  const today = new Date();
  const q = query(
    collection(db, "users", user.uid, "foodlog"),
    orderBy("expDate")
  );

  onSnapshot(q, (snapshot) => {
    const reminders = [];
    let expiringSoon = 0;
    let expired = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data.expDate || !data.reminders) return;

      const expiry = data.expDate.toDate
        ? data.expDate.toDate()
        : new Date(data.expDate);
      const today = new Date();
      const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

      let status = "";
      let color = "";

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

    document.getElementById("total-food").textContent = reminders.length;
    document.getElementById("expiring-soon").textContent = expiringSoon;
    document.getElementById("expired").textContent = expired;

    renderReminders(reminders);
  });
}

auth.onAuthStateChanged((user) => {
  const container = document.getElementById("reminder-list");

  if (!user) {
    container.innerHTML = `<li class="text-red-600">Please log in to view reminders.</li>`;
    return;
  }

  loadReminders(user);
});
