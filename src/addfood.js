import { onAuthStateChanged } from "firebase/auth";
import { saveFoodItem } from "./savefooditem";
import { auth } from "./firebaseConfig";
import { noUser } from "./authentication";
import { showPopup } from "./popup";

const saveButton = document.getElementById("addfood-submit");

function saveButtonEventListener()
{
    saveButton.addEventListener("click", () => {
        let foodName = document.getElementById("addfood-name").value;
        let expDate = document.getElementById("addfood-expDate").value;
        let reminders = document.getElementById("addfood-reminder").checked;
        let amount = document.getElementById("addfood-amount").value;
        // let image = document.getElementById("addfood-image").value;

        amount = parseInt(amount);
        if (isNaN(amount) || amount <= 0)
        {
            alert("Amount must be an integer greater than 0");
            return;
        }

        saveFoodItem(foodName, expDate, amount, reminders);
    });
}

function verifyUser(user)
{
    if (!user)
    {
        noUser("addfood-content");
        return;
    }

    saveButtonEventListener();
}

function setup()
{
    onAuthStateChanged(auth, verifyUser)
}

setup();