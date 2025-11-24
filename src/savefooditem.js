// --- Initialize Firebase ---
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebaseConfig.js";
import { getGroups } from "./groupFunctions.js";
import { successPopup, errorPopup } from "./popup";



export async function saveFoodItem(_name, _expDate, _amount, _reminders, _destinationId = "personal", _imageUrl = null)
{
    const user = auth.currentUser;
    if (!user)
    {
        console.error("No user is logged in");
        return;
    }

    let foodRef;
    let location;

    if (_destinationId == "personal")
    {
        foodRef = collection(db, "users", user.uid, "foodlog");
        location = "personal";
    }
    else
    {
        const groups = await getGroups(user.uid);
        if (!groups[_destinationId])
        {
            errorPopup("Invalid group selected");
            return;
        }

        foodRef = collection(db, "groups", _destinationId, "foodlog");
        location = groups[_destinationId].name;
    }

    await addDoc(foodRef, {
        name: _name,
        expDate: _expDate,
        addedDate: serverTimestamp(),
        amount: _amount,
        reminders: _reminders,
        imageUrl: _imageUrl
    });

    successPopup(`Food saved to ${location} successfully`);
}