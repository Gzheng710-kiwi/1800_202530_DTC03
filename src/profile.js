import { auth, db } from "./firebaseConfig.js";
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { showPopup } from "./popup.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Element references
const avatarEl = document.getElementById("profile-avatar");
const nameEl = document.querySelector("h2");
const emailDisplay = document.getElementById("profile-email");
const locationDisplay = document.getElementById("profile-location");
const sinceDisplay = document.getElementById("profile-since");

const form = document.getElementById("edit-profile-form");
const nameInput = document.getElementById("edit-name");
const emailInput = document.getElementById("edit-email");
const locationInput = document.getElementById("edit-location");

const itemsEl = document.getElementById("count-items");
const remindersEl = document.getElementById("count-reminders");
const expiringEl = document.getElementById("count-expiring");
// Avatar dropdown (Big Smile)
const menu = document.getElementById("avatar-menu");
const options = document.querySelectorAll(".avatar-option");

avatarEl.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("hidden");
});

options.forEach((opt) => {
  opt.addEventListener("click", async () => {
    const seed = opt.dataset.seed;
    const url = `https://api.dicebear.com/7.x/big-smile/svg?seed=${seed}`;
    avatarEl.src = url;
    menu.classList.add("hidden");

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(
          doc(db, "users", user.uid),
          { avatarSeed: seed, photoURL: url },
          { merge: true }
        );
      } catch (e) {
        console.error("Avatar save failed:", e);
      }
    }
  });
});

document.addEventListener("click", (e) => {
  if (!avatarEl.contains(e.target) && !menu.contains(e.target))
    menu.classList.add("hidden");
});

// Main user data & stats
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    nameEl.textContent = "Please log in to view profile";
    return;
  }

  const userRef = doc(db, "users", user.uid);

  onSnapshot(userRef, (snap) => {
    const data = snap.exists() ? snap.data() : {};

    const displayName = data.name || user.displayName || "User";
    nameEl.textContent = `Hello, ${displayName}! Welcome Back!`;
    nameInput.value = displayName;

    if (data.photoURL) avatarEl.src = data.photoURL;

    if (emailDisplay) emailDisplay.textContent = user.email;
    if (emailInput) emailInput.value = user.email;

    if (locationDisplay)
      locationDisplay.textContent = data.location || "Not set";
    if (locationInput) locationInput.value = data.location || "";
  });

  if (sinceDisplay && user.metadata?.creationTime) {
    const creationDate = new Date(user.metadata.creationTime);
    sinceDisplay.textContent = creationDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", user.uid);
      const newName = nameInput.value.trim();
      const newLocation = locationInput.value.trim();

      await setDoc(
        userRef,
        { name: newName, location: newLocation },
        { merge: true }
      );

      showPopup("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  });

  listenFoodStats(user);
});

// Food stats
function listenFoodStats(user) {
  const foodRef = collection(db, "users", user.uid, "foodlog");

  onSnapshot(foodRef, (snapshot) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let itemCount = 0;
    let reminderCount = 0;
    let expiringSoonCount = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      itemCount++;

      if (data.reminders) {
        reminderCount++;

        let expiry;
        if (data.expDate?.toDate) {
          expiry = data.expDate.toDate();
        } else if (typeof data.expDate === "string") {
          const [y, m, d] = data.expDate.split("-").map(Number);
          expiry = new Date(y, m - 1, d);
        } else if (data.expDate) {
          expiry = new Date(data.expDate);
        }

        if (expiry) {
          expiry.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 3) expiringSoonCount++;
        }
      }
    });

    if (itemsEl) itemsEl.textContent = itemCount;
    if (remindersEl) remindersEl.textContent = reminderCount;
    if (expiringEl) expiringEl.textContent = expiringSoonCount;
  });
}
// Log Out
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(() => {
      alert("Logout failed. Please try again.");
    });
});
