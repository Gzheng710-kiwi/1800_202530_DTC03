import { getFirestore, doc, collection, addDoc } from "firebase/firestore";

// --- Initialize Firebase ---
import { doc, collection, setDoc } from "firebase/firestore";
import { db, auth } from "./config.js";


// --- Function to Save Food ---
async function createFoodCollection()
{
    
}

// --- Initialize UI on DOMContentLoaded ---
document.addEventListener("DOMContentLoaded", createFoodCollection);