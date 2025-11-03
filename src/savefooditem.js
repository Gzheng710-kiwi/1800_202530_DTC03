// --- Initialize Firebase ---
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebaseConfig.js";


// --- Function to Save Food ---
/**
 * 
 * @param {string} _name 
 * @param {Date} _expDate 
 * @param {boolean} _reminders 
 * @param {string} imageUrl 
 */
function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.remove("hidden");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("hidden");
  }, 3500); // hide after 2.5 seconds
}

export async function saveFoodItem(_name, _expDate, _reminders, _imageUrl = null)
{
    const user = auth.currentUser;
    if (!user)
    {
        console.error("No user is logged in");
        return;
    }

    const foodRef = collection(db, "users", user.uid, "foodlog");

    await addDoc(foodRef, {
        name: _name,
        expDate: _expDate,
        addedDate: serverTimestamp(),
        reminders: _reminders,
        imageUrl: _imageUrl
    });

    showPopup("Food saved successfully");
}