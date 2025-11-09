import { onAuthStateChanged } from "firebase/auth";
import { saveFoodItem } from "./savefooditem";
import { auth } from "./firebaseConfig";

const saveButton = document.getElementById("addfood-submit");

function saveButtonEventListener()
{
    saveButton.addEventListener("click", () => {
        let foodName = document.getElementById("addfood-name").value;
        let expDate = document.getElementById("addfood-expDate").value;
        let reminders = document.getElementById("addfood-reminder").checked;
        let amount = document.getElementById("addfood-amount").value;
        // let image = document.getElementById("addfood-image").value;

        // console.log(
        //     "\nName: " + foodName +
        //     "\nExpiry Date: " + expDate +
        //     "\nAmount: " + amount +
        //     "\nReminders: " + reminders
        // );
        // console.log("Saving food...");

        saveFoodItem(foodName, expDate, amount, reminders);
    });
}

function noUser()
{
    //Replace dashboard contents with a message telling the user to log in.
    let dashboard = document.getElementById("addfood-content");
    dashboard.innerHTML = `
        <div class="flex flex-col justify-center items-stretch">
            <h3 class="text-2xl text-center font-semibold">You need have an account in order to add food to your fridge</h3>
            <button onclick="location.href='login.html'" class=" mt-10 p-2 contrast font-bold text-2xl">Log In</button>
        </div>
    `
}

function verifyUser(user)
{
    if (!user)
    {
        noUser();
        return;
    }

    saveButtonEventListener();
}

function setup()
{
    onAuthStateChanged(auth, verifyUser)
}

setup();