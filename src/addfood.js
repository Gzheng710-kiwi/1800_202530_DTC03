import { saveFoodItem } from "./savefooditem";

const saveButton = document.getElementById("addfood-submit")
console.log("Button: " + saveButton.id);
saveButton.addEventListener("click", () => {
  let foodName = document.getElementById("addfood-name").value;
  let expDate = document.getElementById("addfood-expDate").value;
  let reminders = document.getElementById("addfood-reminder").checked;
  // let image = document.getElementById("addfood-image").value;

  console.log(
    "\nName: " + foodName +
    "\nExpiry Date: " + expDate +
    "\nReminders: " + reminders
  )

  console.log("Saving food...");
  saveFoodItem(foodName, expDate, reminders);
});
