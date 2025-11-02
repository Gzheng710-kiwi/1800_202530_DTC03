import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const recentsDiv = document.getElementById("recents");

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

async function foodToHtml(allFoods)
{
    let _foodDiv;
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
    recentsDiv.innerHTML = _foodDiv;
}

function noUser()
{
    //Replace dashboard contents with a message telling the user to log in.
    let dashboard = document.getElementById("dashboard-content");
    dashboard.innerHTML = `
        <div class="flex flex-col justify-center items-stretch">
            <h3 class="text-2xl text-center font-semibold">You need have an account in order to view your dashboard</h3>
            <button onclick="location.href='login.html'" class=" mt-10 p-2 contrast font-bold text-2xl">Log In</button>
        </div>
    `
}

async function displayRecentFoods(user)
{
    if (!user)
    {
        noUser();
        return;
    }

    let recentFoods = await getFoodsSortedbyDate(user.uid, 5);
    foodToHtml(recentFoods);
}

function setup()
{
    onAuthStateChanged(auth, displayRecentFoods)
}

setup();