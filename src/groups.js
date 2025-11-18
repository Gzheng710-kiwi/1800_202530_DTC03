import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { noUser } from './authentication'
import { db, auth } from "./firebaseConfig";

const createBtn = document.getElementById("groups-createbutton");
const joinBtn = document.getElementById("groups-joinbutton");
const groupsList = document.getElementById("groups-list");

async function loadUserGroups(uid)
{
    groupsList.innerHTML = "";

    const qGroups = query(
        collection(db, "groups"),
        where("members", "array-contains", uid)
    );


    const results = await getDocs(qGroups);

    results.forEach(group => {
        const div = document.createElement("div");
        div.className =
            "p-4 border rounded-lg shadow-sm flex justify-between items-center";

        div.innerHTML = `
            <h3 class="text-xl font-medium">${group.data().name}</h3>
            <button class="secondary rounded-md py-2 px-4" onclick="window.location='group.html?id=${group.id}'">Go to group</button>
        `;

        groupsList.appendChild(div);
    });
}

async function createGroup(user)
{
    let groupName = window.prompt("Enter group name:");
    if (!groupName) return;

    const docRef = await addDoc(collection(db, "groups"), {
        members: [user.uid],
        name: groupName,
        createdAt: Date.now()
    });

    window.location.href = `group.html?id=${docRef.id}`;
}

async function joinGroup(user)
{
    const code = prompt("Enter group code:");
    if (!code) return;

    const groupRef = doc(db, "groups", code);
    const snap = await getDoc(groupRef);

    if (!snap.exists()) {
        alert("Invalid group code entered.");
        return;
    }

    await updateDoc(groupRef, {
        members: arrayUnion(user.uid)
    });

    window.location.href = `group.html?id=${code}`;
}

function setup()
{
    onAuthStateChanged(auth, async (user) => {
        if (!user)
        {
            noUser("groups-content");
            return;
        }

        loadUserGroups(user.uid);

        createBtn.addEventListener("click", () => {
            createGroup(user);
        });

        joinBtn.addEventListener("click", () => {
            joinGroup(user);
        });
    });
}

setup();
