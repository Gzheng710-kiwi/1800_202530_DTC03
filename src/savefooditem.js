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

    console.log("Food saved successfully");
}