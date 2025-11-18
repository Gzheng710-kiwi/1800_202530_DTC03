import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebaseConfig";
import { noUser } from "./authentication.js";

// DOM Elements
const groupNameHeader = document.getElementById("group-name");
const deleteButton = document.getElementById("delete-group-button");

// Read group ID from URL
const params = new URLSearchParams(window.location.search);
const groupID = params.get("id");

async function loadGroup(user)
{
    const groupRef = doc(db, "groups", groupID);
    const group = await getDoc(groupRef);

    if (!group.exists()) {
        alert("Group not found");
        return;
    }

    const data = group.data();
    
    if (!data.members.includes(user.uid))
    {
        alert("You do not have access to this group.");
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

function loadFoodItems()
{

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
            alert("No group ID provided in the URL.");
            throw new Error("Missing groupID");
        }

        deleteButton.addEventListener("click", deleteGroup);

        const data = await loadGroup(user);
        groupNameHeader.textContent = data.name || "Unnamed Group";
        loadFoodItems();
    });
}

setup();