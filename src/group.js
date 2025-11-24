import { doc, getDoc, deleteDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebaseConfig";
import { noUser } from "./authentication";
import { successPopup, errorPopup } from "./popup";
import { betterDateFormat } from "./utils";

// DOM Elements
const groupNameHeader = document.getElementById("group-name");
const groupIDSubtitle = document.getElementById("group-id");
const deleteButton = document.getElementById("delete-group-button");

// Read group ID from URL
const params = new URLSearchParams(window.location.search);
const groupID = params.get("id");

async function loadGroup(user)
{
    const groupRef = doc(db, "groups", groupID);
    const group = await getDoc(groupRef);

    if (!group.exists()) {
        errorPopup("Group not found");
        return;
    }

    const data = group.data();
    
    if (!data.members.includes(user.uid))
    {
        errorPopup("You do not have access to this group.");
        location.href = "groups.html";
        return;
    }
    return data;
}

async function deleteGroup()
{
    const confirmDelete = confirm("Are you sure you want to delete this group? This cannot be undone.");

    if (!confirmDelete)
        return;

    await deleteDoc(doc(db, "groups", groupID));

    alert("Group deleted successfully.");
    window.location.href = "groups.html";
}

async function loadFoodItems()
{
    const groupFoodDiv = document.getElementById("group-fooditems");
    if (!groupFoodDiv)
    {
        errorPopup("Food item collection not found");
        return;
    }

    try
    {
        groupFoodDiv.innerHTML = "";

        const foodRef = collection(db, "groups", groupID, "foodlog")
        
        const foodQuery = query(foodRef, orderBy("addedDate", "desc"));
        const snapshot = await getDocs(foodQuery);

        if (snapshot.empty)
        {
            groupFoodDiv.innerHTML = `
            <p>No food items in this group yet.</p>
            `
            return;
        }

        snapshot.forEach((food) => {
            const foodItem = createFoodElement(food.id, food.data());
            groupFoodDiv.append(foodItem);
        });
    }
    catch (error)
    {
        errorPopup("Error loading food items:\n" + error);
        groupFoodDiv.innerHTML = '<p class="my-2 error rounded-md py-1 px-2">Error loading food items.</p>'
    }
}

function createFoodElement(foodId, foodData)
{
    const expDate = foodData.expDate ? new Date(foodData.expDate).toLocaleDateString() : "-";

    const foodDiv = document.createElement("div");
    foodDiv.classList = "flex flex-row justify-between items-center py-2 px-2 border-b border-[--secondary-border-color]"

    let _expDate = betterDateFormat(foodData.expDate);

    foodDiv.innerHTML = `
    <div class="rounded-full border py-1 px-2 border-[--secondary-border-color]">
        <h4>${foodData.name}</h4>
    </div>
    <div class="flex flex-row gap-4">
        <h2 class="rounded-full border py-1 px-2 border-[--secondary-border-color]">${foodData.amount}</h2>
        <h2 class="rounded-full border py-1 px-2 border-[--secondary-border-color]">${_expDate}</h2>
    </div>
    `

    return foodDiv;

    // <!-- Example -->
    // <div class="flex flex-row justify-between items-center py-2 px-2 border-b border-[--secondary-border-color]">
    // <div class="rounded-full border py-1 px-2 border-[--secondary-border-color]">
    //     <h4>FoodName</h4>
    // </div>
    // <div class="flex flex-row gap-4">
    //     <h2 class="rounded-full border py-1 px-2 border-[--secondary-border-color]">#</h2>
    //     <h2 class="rounded-full border py-1 px-2 border-[--secondary-border-color]">MM-DD-YYYY</h2>
    // </div>
    // </div>
}

function setup()
{
    onAuthStateChanged(auth, async (user) => {
        if (!user)
        {
            noUser("group-content");
            return;
        }
        if (!groupID)
        {
            errorPopup("Group not found");
            throw new Error("Missing groupID");
        }

        deleteButton.addEventListener("click", deleteGroup);

        const data = await loadGroup(user);
        groupNameHeader.textContent = data.name || "Unnamed Group";
        groupIDSubtitle.textContent = `Group ID: ${groupID}`;
        loadFoodItems();
    });
}

setup();