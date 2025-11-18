import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { noUser } from './authentication'

const app = initializeApp();
const db = getFirestore(app);
const auth = getAuth(app);

const createBtn = document.getElementById("groups-createbutton");
const joinBtn = document.getElementById("groups-joinbutton");
const groupsList = document.getElementById("groups-list");

async function loadUserGroups(uid) {
    groupsList.innerHTML = "";

    const qGroups = query(
        collection(db, "groups"),
        where("members", "array-contains", uid)
    );

    const results = await getDocs(qGroups);

    results.forEach(docSnap => {
        const div = document.createElement("div");
        div.className =
            "p-4 border rounded-lg shadow-sm flex justify-between items-center";

        div.innerHTML = `
            <h3 class="text-xl font-medium">Group: ${docSnap.id}</h3>
            <button class="secondary rounded-md py-2 px-4" onclick="window.location='group-skeleton.html?id=${docSnap.id}'">Go to group</button>
        `;

        groupsList.appendChild(div);
    });
}

function createGroup(user)
{
    // CREATE GROUP
    createBtn.addEventListener("click", async () => {
        const docRef = await addDoc(collection(db, "groups"), {
            members: [user.uid],
            createdAt: Date.now()
        });

        window.location.href = `group-skeleton.html?id=${docRef.id}`;
    });
}

function joinGroup(user)
{
    joinBtn.addEventListener("click", async () => {
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

        window.location.href = `group-skeleton.html?id=${code}`;
    });
}

function setup()
{
    onAuthStateChanged(auth, async (user) => {
        if (!user)
        {
            noUser();
            return;
        }

        loadUserGroups(user.uid);

        createBtn.addEventListener("click", (user) => {
            createGroup(user);
        });

        createGroup(user);
        joinGroup(user);
    });
}

setup();
