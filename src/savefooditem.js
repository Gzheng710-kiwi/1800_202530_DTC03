// --- Initialize Firebase ---
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebaseConfig.js";
import { showPopup } from "./popup"



export async function saveFoodItem(_name, _expDate, _amount, _reminders, _imageUrl = null)
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
        amount: _amount,
        reminders: _reminders,
        imageUrl: _imageUrl
    });

    showPopup("Food saved successfully");
}