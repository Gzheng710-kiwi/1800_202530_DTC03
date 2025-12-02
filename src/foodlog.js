import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { getGroups } from "./groupFunctions.js";
import { successPopup, errorPopup } from "./popup.js";

const listEl = document.getElementById("food-list");
const searchEl = document.getElementById("food-search");
const viewModeEl = document.getElementById("view-mode");
const groupDropdown = document.createElement("select");

groupDropdown.id = "group-dropdown";
groupDropdown.className =
  "hidden shrink-0 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400 ml-2";
groupDropdown.innerHTML = `<option value="">My Food Log</option>`;
viewModeEl.insertAdjacentElement("afterend", groupDropdown);

let items = [];
let personalItems = [];
let groupItems = [];
let currentView = "individual";

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

  const sourceAttr = it.source || "personal";
  const groupAttr = it.groupId || "";

  return `
  <input
    type="checkbox"
    class="js-checkbox hidden h-5 w-5 accent-green-600 cursor-pointer"
    data-docid="${it.id}"
    data-source="${sourceAttr}"
    data-groupid="${groupAttr}"
    aria-label="Select food item"
  />
  <div class="min-w-0">
    <span class="inline-flex items-center h-8 rounded-full border border-neutral-300 px-4 font-medium whitespace-nowrap">
      ${it.name || "(unnamed)"}
    </span>
  </div>

  <span class="justify-self-end shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-sm text-black">
    ${qty}
  </span>
  <span class="${expiryClasses} justify-self-end shrink-0 inline-flex items-center h-8 rounded-full border px-4 text-sm whitespace-nowrap">
    ${expStr}
  </span>
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
      "grid grid-cols-[2.25rem_minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3";

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
    box.classList.toggle("hidden", !editMode);
    box.checked = false; // reset checks when entering edit mode
  });

  // Show/Hide Select All
  const selectAll = document.getElementById("select-all");
  selectAll.classList.toggle("hidden", !editMode);
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
  } else if (allBoxes.length > 0) {
    selectAll.checked = true;
  }
});

deleteBtn.addEventListener("click", async () => {
  if (!editMode) return;

  const checked = document.querySelectorAll(".js-checkbox:checked");
  if (checked.length === 0) return;

  const user = auth.currentUser;
  if (!user) return;

  for (const box of checked) {
    const docId = box.dataset.docid;
    const source = box.dataset.source; // "personal" or "group"
    const groupId = box.dataset.groupid;

    // 🔹 SAME delete logic for both, but separate collections
    if (source === "group" && groupId) {
      await deleteDoc(doc(db, "groups", groupId, "foodlog", docId));
    } else {
      await deleteDoc(doc(db, "users", user.uid, "foodlog", docId));
    }
  }
  if (currentView === "group") {
    await loadGroupItemsForUser(user);
  } else {
  }
  editMode = false;
  const selectAll = document.getElementById("select-all");
  selectAll.classList.add("hidden");
  selectAll.checked = false;

  deleteBtn.classList.add("hidden");
  editBtn.classList.remove("hidden");

  successPopup("Deleted selected items");
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

async function loadGroupItemsForUser(user) {
  try {
    const groups = await getGroups(user.uid);
    const entries = Object.entries(groups || {});

    if (!entries.length) {
      groupItems = [];
      items = [];
      applyFilter();
      return;
    }

    const all = [];

    for (const [groupId, groupData] of entries) {
      const qRef = query(
        collection(db, "groups", groupId, "foodlog"),
        orderBy("expDate")
      );

      const snap = await getDocs(qRef);
      snap.forEach((d) => {
        all.push({
          id: d.id,
          source: "group",
          groupId,
          groupName: groupData?.name || "Group",
          ...d.data(),
        });
      });
    }

    groupItems = all;
    items = groupItems;
    applyFilter();
  } catch (err) {
    console.error("Error loading group food:", err);
    errorPopup("Could not load group food log.");
  }
}

if (viewModeEl) {
  viewModeEl.addEventListener("change", async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (viewModeEl.value === "group") {
      await loadUserGroups(user.uid);
    } else {
      groupDropdown.classList.add("hidden");
      items = personalItems;
      applyFilter();
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    items = [];
    personalItems = [];
    groupItems = [];
    render(items);
    return;
  }

  currentView = viewModeEl?.value || "individual";

  const qRef = query(
    collection(db, "users", user.uid, "foodlog"),
    orderBy("expDate")
  );

  onSnapshot(
    qRef,
    (snap) => {
      personalItems = snap.docs.map((d) => ({
        id: d.id,
        source: "personal",
        ...d.data(),
      }));

      if (currentView === "individual") {
        items = personalItems;
        applyFilter();
      }
    },
    (err) => {
      console.error("Snapshot error:", err);
      errorPopup("Could not load your food log.");
    }
  );
  if (currentView === "group") {
    loadGroupItemsForUser(user);
  }
});

async function loadUserGroups(uid) {
  try {
    const groups = await getGroups(uid);

    groupDropdown.innerHTML = `<option value="">Select a group</option>`;

    Object.entries(groups).forEach(([groupId, groupData]) => {
      const option = document.createElement("option");
      option.value = groupId;
      option.textContent = groupData.name;
      groupDropdown.appendChild(option);
    });
    groupDropdown.classList.remove("hidden");
  } catch (error) {
    console.error("Error loading groups:", error);
    errorPopup("Error loading groups");
  }
}
