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

  let qty = "—";
  if (it.amount) {
    qty = it.amount;
  } else if (it.qty) {
    qty = it.qty;
  } else if (it.quantity) {
    qty = it.quantity;
  }

  const expiryClasses =
    "rounded-full border px-3 py-1 " +
    (expired ? "text-red-600 border-red-300 bg-red-50" : "text-black");

  return `
    <input
      type="checkbox"
      class="js-checkbox invisible h-5 w-5 accent-green-600 cursor-pointer"
      data-docid="${it.id}"
      aria-label="Select food item"
    />
    <div class="min-w-0">
      <span class="inline-block max-w-full truncate rounded-full border px-3 py-1 font-medium">
        ${it.name || "(unnamed)"}
      </span>
    </div>
    <span class="rounded-full justify-end border px-3 py-1 text-black">${qty}</span> 
    <span class="${expiryClasses}  text-right">${expStr}</span>
  `;
}

window.selectAllCheckBoxes = function (source) {
  const checkboxes = document.querySelectorAll(".js-checkbox");
  checkboxes.forEach(function (box) {
    box.checked = source.checked;
  });
};

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
}
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
let editMode = false;

editBtn.addEventListener("click", () => {
  editMode = !editMode;

  const boxes = document.querySelectorAll(".js-checkbox");

  // Show or hide checkboxes
  boxes.forEach((box) => {
    box.classList.toggle("invisible", !editMode);
    box.checked = false; // reset checks when entering edit mode
  });

  // Show/Hide Select All
  const selectAll = document.getElementById("select-all");
  selectAll.classList.toggle("invisible", !editMode);
  selectAll.checked = false;

  if (editMode) {
    editBtn.classList.remove("hidden"); // keep edit shown
    deleteBtn.classList.add("hidden"); // hide delete
    deleteBtn.disabled = true;
  } else {
    // Leaving edit mode → reset everything
    editBtn.classList.remove("hidden");
    deleteBtn.classList.add("hidden");
  }
});

// When selecting any checkbox enable delete button
document.addEventListener("change", () => {
  if (!editMode) return;

  const anyChecked = document.querySelector(".js-checkbox:checked");
  const allBoxes = document.querySelectorAll(".js-checkbox");
  const allChecked = Array.from(allBoxes).every((box) => box.checked);
  const selectAll = document.getElementById("select-all");

  if (anyChecked) {
    deleteBtn.classList.remove("hidden");
    deleteBtn.disabled = false;
    editBtn.classList.add("hidden");
  } else {
    deleteBtn.classList.add("hidden");
    deleteBtn.disabled = true;
    editBtn.classList.remove("hidden");
  }

  if (!allChecked) {
    selectAll.checked = false;
  }
  else if (allBoxes.length > 0) {
    selectAll.checked = true;
  }
});


deleteBtn.addEventListener("click", async () => {
  if (!editMode) return;

  const checked = document.querySelectorAll(".js-checkbox:checked");
  if (checked.length === 0) return;

  const { uid } = auth.currentUser;
  if (!uid) return;

  for (const box of checked) {
    const docId = box.dataset.docid;
    await deleteDoc(doc(db, "users", uid, "foodlog", docId));
  }

  // Turn off edit mode after deleting
  editMode = false;

  document.getElementById("select-all").classList.add("invisible");
  document.getElementById("select-all").checked = false;

  deleteBtn.classList.add("hidden");
  editBtn.classList.remove("hidden");

  showPopup("Deleted selected items");
});

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
