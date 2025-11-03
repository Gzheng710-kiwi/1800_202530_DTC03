import { auth, db } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- Element references ---
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

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";

avatarEl.addEventListener("click", () => fileInput.click());

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

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storage = getStorage();
      const avatarRef = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(avatarRef, file);
      const photoURL = await getDownloadURL(avatarRef);

      await setDoc(userRef, { photoURL }, { merge: true });
      avatarEl.src = photoURL;
      alert("Avatar updated successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please check Firebase Storage rules.");
    }
  };

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

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  });

  listenFoodStats(user);
});

// --- UPDATED FUNCTION: listenFoodStats ---
// Matches the logic in reminder.js
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
