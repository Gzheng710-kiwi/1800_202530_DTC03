import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        main: resolve(__dirname, "main.html"),
        profile: resolve(__dirname, "profile.html"),
        foodlog: resolve(__dirname, "foodlog.html"),
        addfood: resolve(__dirname, "addfood.html"),
        groups: resolve(__dirname, "groups.html"),
        main: resolve(__dirname, "main.html"),
        reminder: resolve(__dirname, "reminder.html"),
      },
    },
  },
});
