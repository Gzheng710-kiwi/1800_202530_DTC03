import { auth, db } from "./firebaseConfig.js";
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { successPopup } from "./popup.js";
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
const birthdayInput = document.getElementById("birthday");

const itemsEl = document.getElementById("count-items");
const remindersEl = document.getElementById("count-reminders");
const expiringEl = document.getElementById("count-expiring");
// Avatar dropdown (Big Smile)
const menu = document.getElementById("avatar-menu");
const options = document.querySelectorAll(".avatar-option");

// Avatar Menu: Open on Click
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
        // Firestore WRITE: save avatar seed + URL
        await setDoc(
          doc(db, "users", user.uid),
          { avatarSeed: seed, photoURL: url },
          { merge: true }
        );
        successPopup("Avatar saved!");
      } catch (e) {
        console.error("Avatar save failed:", e);
      }
    }
  });
});

// Remove avatar: revert to default avatar
document
  .getElementById("remove-avatar-btn")
  .addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        avatarEl.src =
          "data:image/svg+xml;utf8,\
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>\
        <circle cx='32' cy='32' r='32' fill='%23f3f4f6'/>\
        <circle cx='32' cy='24' r='10' fill='%23d1d5db'/>\
        <path d='M12 52c4-8 12-12 20-12s16 4 20 12' fill='%23d1d5db'/>\
        </svg>";

        await setDoc(
          doc(db, "users", user.uid),
          { photoURL: "", avatarSeed: "" },
          { merge: true }
        );

        menu.classList.add("hidden");
      } catch (e) {
        console.error("Failed to remove avatar:", e);
      }
    }
  });

// Close dropdown when clicking outside
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

  // Firestore READ: load profile in real-time
  onSnapshot(userRef, (snap) => {
    const data = snap.exists() ? snap.data() : {};

    const displayName = data.name || user.displayName || "User";
    nameEl.textContent = `Hello, ${displayName}! Welcome Back!`;
    nameInput.value = displayName;

    if (data.birthday) {
      birthdayInput.value = data.birthday;
    } else {
      birthdayInput.value = "";
    }

    const defaultAvatar =
      "data:image/svg+xml;utf8,\
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>\
        <circle cx='32' cy='32' r='32' fill='%23f3f4f6'/>\
        <circle cx='32' cy='24' r='10' fill='%23d1d5db'/>\
        <path d='M12 52c4-8 12-12 20-12s16 4 20 12' fill='%23d1d5db'/>\
      </svg>";

    if (data.photoURL) {
      avatarEl.src = data.photoURL;
    } else {
      avatarEl.src = defaultAvatar;
    }

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

  // Form submit: update profile fields
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", user.uid);
      const newName = nameInput.value.trim();
      const newLocation = locationInput.value.trim();
      const newBirthday = birthdayInput.value;

      await setDoc(
        userRef,
        { name: newName, location: newLocation, birthday: newBirthday },
        { merge: true }
      );

      successPopup("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  });

  // Load real-time food statistics
  listenFoodStats(user);
});

/**
 * Load food statistics for the profile page.
 * Counts total items, reminders enabled, and soon-to-expire items.
 *
 * @param {Object} user - The logged-in Firebase user.
 */
function listenFoodStats(user) {
  const foodRef = collection(db, "users", user.uid, "foodlog");

  // Firestore READ: real-time updates for foodlog
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

        // Determine expiry date format
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
// Logout button
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(() => {
      alert("Logout failed. Please try again.");
    });
});

// Cancel button: no changes saved
document.getElementById("cancel-btn").addEventListener("click", () => {
  successPopup("You didn't make any changes.");
  setTimeout(() => {
    window.location.href = "profile.html";
  }, 1500);
});
