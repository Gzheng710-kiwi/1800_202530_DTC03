export function convertToDate(expDate) {
  let expiry;

  if (expDate?.toDate) {
    expiry = expDate.toDate();
  } else if (typeof expDate === "string") {
    const [y, m, d] = expDate.split("-").map(Number);
    expiry = new Date(y, m - 1, d);
  } else {
    expiry = new Date(expDate);
  }

  expiry.setHours(0, 0, 0, 0);
  return expiry;
}

export function calculateDaysLeft(expiry) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
}
