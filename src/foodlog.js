// /src/foodlog-list.js
import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { showPopup } from "./popup.js";

const listEl = document.getElementById("food-list");
const searchEl = document.getElementById("food-search");

let items = []; // local cache for filtering


function asDateString(exp) {
  if (!exp) return "—";
  // Firestore Timestamp
  if (typeof exp?.toDate === "function")
    return exp.toDate().toISOString().slice(0, 10);
  // JS Date
  if (exp instanceof Date && !isNaN(exp)) return exp.toISOString().slice(0, 10);
  // String (assume already formatted)
  return String(exp);
}

function isExpired(exp) {
  try {
    const s = asDateString(exp);
    if (s === "—") return false;
    const today = new Date();
    const d = new Date(s + "T00:00:00");
    // expired if strictly before today
    return d < new Date(today.toISOString().slice(0, 10) + "T00:00:00");
  } catch {
    return false;
  }
}

function rowHTML(index, it) {
  const expStr = asDateString(it.expDate);
  const expired = isExpired(it.expDate);
  const expiryClasses =
    "rounded-full border px-3 py-1 " +
    (expired ? "text-red-600 border-red-300 bg-red-50" : "text-black");

  return `
    <span class="text-center text-black">${index}</span>
    <div class="min-w-0">
      <span class="inline-block max-w-full truncate rounded-full border px-3 py-1 font-medium">
        ${it.name ?? "(unnamed)"}
      </span>
    </div>
    <span class="${expiryClasses} -translate-x-11">${expStr}</span>
    <button
      type="button"
      data-docid="${it.id}"
      class="js-delete justify-self-end inline-flex items-center justify-center size-9 rounded-md border border-neutral-300 hover:bg-neutral-50 active:scale-95 transition"
      aria-label="Delete item"
      title="Delete"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 7l16 0" />
        <path d="M10 11l0 6" />
        <path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
      </svg>
    </button>
  `;
}

function render(list) {
  listEl.innerHTML = "";
  if (!list.length) {
    listEl.innerHTML = `<li class="px-4 py-6 text-neutral-500">No food items yet.</li>`;
    return;
  }
  list.forEach((it, i) => {
    const li = document.createElement("li");
    li.className =
      "grid grid-cols-[2.25rem_1fr_auto_auto] items-center gap-2 px-4 py-3";
    li.innerHTML = rowHTML(i + 1, it);
    listEl.appendChild(li);
  });

  // Delegate delete clicks
  listEl.querySelectorAll(".js-delete").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const docId = e.currentTarget.getAttribute("data-docid");
      showPopup("Food Deleted successfully");
      if (!docId) return;
      const { uid } = auth.currentUser || {};
      if (!uid) return;
      try {
        await deleteDoc(doc(db, "users", uid, "foodlog", docId));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Could not delete item.");
      }
    });
  });
}

function applyFilter() {
  const q = (searchEl?.value || "").trim().toLowerCase();
  if (!q) return render(items);
  const filtered = items.filter(
    (it) =>
      (it.name ?? "").toLowerCase().includes(q) ||
      asDateString(it.expDate).toLowerCase().includes(q)
  );
  render(filtered);
}

if (searchEl) {
  searchEl.addEventListener("input", applyFilter);
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    items = [];
    render(items);
    return;
  }

  // Live query for this user's foodlog, soonest expiry first
  const qRef = query(
    collection(db, "users", user.uid, "foodlog"),
    orderBy("expDate") // expDate can be Timestamp/Date/string; Firestore orders fine if types are consistent
  );

  onSnapshot(
    qRef,
    (snap) => {
      items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      applyFilter(); // respects current search text
    },
    (err) => {
      console.error("Snapshot error:", err);
      alert("Could not load your food log.");
    }
  );
});
