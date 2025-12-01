import { onAuthStateChanged } from "firebase/auth";
import { saveFoodItem } from "./savefooditem";
import { auth } from "./firebaseConfig";
import { noUser } from "./authentication";
import { errorPopup } from "./popup";
import { getGroups } from "./groupFunctions";

const destinationSelect = document.getElementById("addfood-destination");
const saveButton = document.getElementById("addfood-submit");

async function loadUserGroups(uid) {
    try {
        const groups = await getGroups(uid);
        
        Object.entries(groups).forEach(([groupId, groupData]) => {
            const option = document.createElement("option");
            option.value = groupId;
            option.textContent = `Group: ${groupData.name}`;
            destinationSelect.appendChild(option);
        });
        
    }
    catch (error)
    {
        console.error("Error loading groups:", error);
        errorPopup("Error loading groups");
    }
}

function saveButtonEventListener()
{
    saveButton.addEventListener("click", async () => {
        let foodName = document.getElementById("addfood-name").value;
        // let image = document.getElementById("addfood-image").value;
        let expDate = document.getElementById("addfood-expDate").value;
        let reminders = document.getElementById("addfood-reminder").checked;
        let amount = document.getElementById("addfood-amount").value;
        let destinationId = destinationSelect.value;

        if (!foodName.trim())
        {
            errorPopup("Please enter a food name");
            return;
        }

        if (!expDate)
        {
            errorPopup("Please add an expiration date");
            return;
        }


        amount = parseInt(amount);
        if (isNaN(amount) || amount <= 0)
        {
            errorPopup("Amount must be an integer greater than 0");
            return;
        }

        await saveFoodItem(foodName, expDate, amount, reminders, destinationId);
        // Wait 1 second
        // setTimeout(() => {
        //     location.href = "./foodlog.html"
        // }, 1000);
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
    loadUserGroups(user.uid);
}

function setup()
{
    onAuthStateChanged(auth, verifyUser)
}

setup();