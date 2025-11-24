import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

export async function getGroups(uid) {
    try {
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