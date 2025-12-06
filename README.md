# Fridge Tracker

## Overview

Fridge Tracker is a client-side JavaScript web application. It helps users manage the food in their fridges more easily. The app allows users to add food items, track expiry dates, view food logs, check reminders, update profile information and join shared groups to use the app with family members or roommates.

Developed for the COMP 1800 course, this project applies User-Centred Design practices and agile project management, and demonstrates integration with Firebase backend services for managing user data, food items, reminders and shred groups.

---

## Features

- Add food items with quantity and expiry dates
- Display saved reminders, such as "Fresh", "Expiring Soon", and "Expired"
- View food logs and delete food items
- Join or create groups to share a fridge with others
- Update personal profile

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase Authentication, Firebase for hosting
- **Database**: Firestore
- **API**: DiceBear Avatar API(https://www.dicebear.com/styles/big-smile/#big-smile)

---

## Usage

1. Open your browser and visit the hosted link(https://dtc03-e6c5d.web.app) of the app.
2. Log in or sign up using your email and password.
3. Add food items to your fridge by entering the item name and expiry date.
4. Check the Dashboard for a quick overview of your food items and reminders.
5. View expiring and expired items in the Reminders section.
6. Create or join a group to manage a shared fridge with family or roommates.
7. Edit your profile information and customize your avatar on the Profile page.

---

## Project Structure

The following structure represents the intended organization of the project.

```
1800_202030_DTC03/
│
├── public/
│   └── images/
│
├── src/
│   ├── firebase/
│   │   ├── firebaseConfig.js
│   │   └── authentication.js
│   │
│   ├── components/
│   │   ├── app-navbar.js
│   │   └── app-popup.js
│   │
│   ├── features/
│   │   ├── food/
│   │   │   ├── addfood.js
│   │   │   └── foodlog.js
│   │   ├── groups/
│   │   │   ├── group.js
│   │   │   ├── groups.js
│   │   │   └── groupFunctions.js
│   │   ├── reminders/
│   │   │   └── reminder.js
│   │   └── profile/
│   │       └── profile.js
│   │
│   ├── styles/
│   │   └── style.css
│   │
│   └── utils.js
│
├── images/
│
├── index.html
├── login.html
├── profile.html
├── addfood.html
├── foodlog.html
├── group.html
├── groups.html
├── reminder.html
│
├── .env
├── .env_template
├── .gitignore
├── firebase.json
├── .firebaserc
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md


```

---

## Contributors

- **Ge Zheng** - BCIT CST Student, likes web development.
- **Gustavo Rodriguez** - BCIT CST Student who loves playing and making games. Fun fact: Can solve a Rubik's Cube in under a minute.
- **Popal Daudzai** -loves to play sports and drive around the city.

---

## Acknowledgments

- The project logo was designed by Gus.
- Avatar images are generated using the DiceBear API for user profile customization.
- Code snippets were adapted from resources such as [Stack Overflow](https://stackoverflow.com/) and [MDN Web Docs](https://developer.mozilla.org/).
- UI icons used in the project are sourced from publicly available open-source icon sets included in our framework and tools.
- Special thanks to our instructor and classmates for their feedback during usability testing, which helped inform our UI/UX improvements.

---

## Limitations and Future Work

### Limitations

- The app does not currently support uploading real food images.
- Reminder feature can be further improved.
- Editing food items is limited.

### Future Work

- Add support for uploading real food images.
- Enhance the Reminder feature with push notifications.
- Expand food item editing to include additional fields such as quantity, category, and optional photos.

---
