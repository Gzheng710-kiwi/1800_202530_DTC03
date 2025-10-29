import { saveFoodItem } from "./save-foodlog";

document.getElementById("addfood-submit").addEventListener("click", () => {
  let foodName = document.getElementById("foodName").value;
  let expiry = document.getElementById("expDate").value;
  let addedDate = document.getElementById("dateAdded").value;
  let reminders = document.getElementById("remindersToggle").checked;
  let image = document.getElementById("imageUrl").value || null;

  addFoodItem(foodName, expiry, addedDate, reminders, image);
});
