export function setupNavbar()
{
    // console.log("navbar setup triggered");

    const navLinks = {
        "logs-button" : "foodlog.html",
        "addfood-button": "addfood.html",
        "dashboard-button": "main.html",
        "reminders-button": "reminder.html",
        "profile-button": "profile.html"
    };

    for (let [id, target] of Object.entries(navLinks))
    {
        const button = document.getElementById(id);
        if (!button) continue;

        button.addEventListener("click", () => 
        {
            location.href = target;
        })
    }
}