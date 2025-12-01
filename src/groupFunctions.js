import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import { errorPopup } from "./popup.js";

export async function getGroups(uid) {
    try
    {
        const qGroups = query(
            collection(db, "groups"),
            where("members", "array-contains", uid)
        );

        const results = await getDocs(qGroups);
        const groups = {};
        
        results.forEach(group => {
            groups[group.id] = group.data();
        });
        
        return groups;
    }
    catch (e)
    {
        console.error("Error getting groups:", e);
        throw e;
    }
}

export async function getGroupMembers(groupid)
{
    try
    {
        const groupDoc = doc(db, "groups", groupid)
        const qGroup = await getDoc(groupDoc);

        const data = qGroup.data();
        console.log(data);
        return data.members || [];
    }
    catch (e)
    {
        console.error("Error getting group members", e);
        return ["..."];
    }
}

export async function getUserFromId(uid)
{
    try
    {
        const userDoc = doc(db, "users", uid);
        const qUser = await getDoc(userDoc);
        return qUser.data();
    }
    catch(e)
    {
        console.error("Error getting user:", e);
        return;
    }
}