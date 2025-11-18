import { collection, getDocs, query, limit, orderBy, where } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { noUser } from './authentication'


/**
 * Fetch foods sorted by date (latest first)
 * @param {string} uid
 * @param {int} maxResults The total amount of results you want to return
 * @returns A string array with the specified amount of results
*/
async function getFoodsSortedbyDate(uid, maxResults)
{
    //Get the food collection
    const foodRef = collection(db, "users", uid, "foodlog")
    
    //Get back elements sorted by date
    let q;
    if (!maxResults)
    {
        q = query(foodRef, orderBy("addedDate"));
    }
    else
    {
        q = query(foodRef, orderBy("addedDate"), limit(maxResults));
    }
    
    const allFoods = await getDocs(q);
    console.log(allFoods);
    
    //Add food names to a Set
    let _foodSet = new Set();
    for (let doc of allFoods.docs)
    {
        let _data = doc.data();
        let _foodName = _data.name?.trim();
        if (_foodName)
        {
            _foodSet.add(_foodName);
        }
    }
    return _foodSet;
}

async function getRemindersSortedbyDate(uid, maxResults)
{
    //Get the food collection
    const foodRef = collection(db, "users", uid, "foodlog")
    
    //Get back elements sorted by date
    let q;
    if (!maxResults)
    {
        q = query(foodRef, orderBy("addedDate"));
    }
    else
    {
        q = query(foodRef, where("reminders", "==", true), limit(maxResults));
    }
    
    const allFoods = await getDocs(q);
    console.log(allFoods);
    
    //Add food names to a Set
    let _foodSet = new Set();
    for (let doc of allFoods.docs)
    {
        let _data = doc.data();
        let _foodName = _data.name?.trim();
        if (_foodName)
        {
            _foodSet.add(_foodName);
        }
    }
    return _foodSet;
}
                
async function recentsToHtml(div, allFoods)
{
    let _foodDiv = "";
    for (let food of allFoods)
    {
        //Append a div with the food name and an 'Add' button
        _foodDiv += `
        <div class="flex flex-row border-b py-4">
        <h5 class="flex-1 p-1">${food}</h5>
        <button class="py-1 px-2 rounded-lg">Add</button>
        </div>
        `;
    }
    div.innerHTML = _foodDiv;
}
                
async function remindersToHtml(div, allFoods)
{
    let _foodDiv = "";
    for (let food of allFoods)
    {
        //Append a div with the food name and an 'Add' button
        _foodDiv += `
        <div class="flex flex-row border-b py-4">
        <h5 class="flex-1 p-1">${food}</h5>
        </div>
        `;
    }
    div.innerHTML = _foodDiv;
}

async function displayRecentFoods(user)
{
    const recentsDiv = document.getElementById("dashboard-recents");

    let recentFoods = await getFoodsSortedbyDate(user.uid, 5);
    recentsToHtml(recentsDiv, recentFoods);
}

async function displayReminderFoods(user)
{
    const remindersDiv = document.getElementById("dashboard-reminders")

    let reminderFoods = await getRemindersSortedbyDate(user.uid, 5);
    remindersToHtml(remindersDiv, reminderFoods);
}

function setup()
{
    //Firestore stuff
    onAuthStateChanged(auth, (user) => {
        if (!user)
        {
            noUser("dashboard-content", false);
            return;
        }

        displayRecentFoods(user);
        displayReminderFoods(user);
    })

    //Reminder stuff
    const reminderOverlay = document.getElementById("reminder-overlay");
    const reminderButton = document.getElementById("dashboard-reminderbutton");

    reminderButton.addEventListener("click", () => {
        reminderOverlay.classList.toggle("hidden");
        reminderOverlay.classList.toggle("flex");
    })
}

setup();