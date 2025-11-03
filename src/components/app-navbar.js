import { setupNavbar } from "../navbar";

class AppNavbar extends HTMLElement 
{
    constructor() 
    {
        super();
        this.renderNavbar();
    }

    connectedCallback()
    {
        this.setupEventListeners();
    }

    setupEventListeners()
    {
        console.log("Setting up navbar listeners...");
        setupNavbar();
    }

    renderNavbar() 
    {
        this.innerHTML = `
            <link href="/styles/style.css" rel="stylesheet">
            <nav class="fixed bottom-0 left-0 w-full bg-[--secondary-bg-color] border-t-2 border-[--text-color]">
                <div class="flex justify-around items-center h-32 gap-[2vw]">
                    <div class="flex flex-col flex-1 w-[15vw] max-w-[125px] h-2/3 items-center justify-center">
                        <button id="dashboard-button" 
                        class="btn-primary flex p-0 m-0 rounded-lg border-2 border-[--text-color] h-full max-w-full aspect-square text-[0px] items-center justify-center">
                            <!-- Dashboard 1 -->
                            <svg class="h-3/4"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <rect x="2" y="2" width="9" height="11" rx="2"></rect><rect x="13" y="2" width="9" height="7" rx="2"></rect>
                                    <rect x="2" y="15" width="9" height="7" rx="2"></rect><rect x="13" y="11" width="9" height="11" rx="2"></rect>
                                </g>
                            </svg>
                            <!-- https://www.svgrepo.com/svg/459911/dashboard -->
                        </button>
                        <h6 class="text-sm text-nowrap font-semibold">Dashboard</h6>
                    </div>
                    <div class="flex flex-col flex-1 w-[15vw] max-w-[125px] h-2/3 items-center justify-center">
                        <button id="logs-button" 
                        class="btn-primary flex p-0 m-0 rounded-lg border-2 border-[--text-color] h-full max-w-full aspect-square text-[0px] items-center justify-center">
                            <!-- Logs-2 -->
                            <svg class="h-full"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M256 73.825c-100.608 0-182.18 81.562-182.18 182.17a182.18 182.18 0 0 0 364.36 0c0-100.608-81.572-182.17-182.18-182.17zM183.517 322.15a12.586 12.586 0 1 1 12.585-12.586 12.579 12.579 0 0 1-12.585 12.586zm0-53.56a12.586 12.586 0 1 1 12.585-12.596 12.581 12.581 0 0 1-12.585 12.596zm0-53.57a12.586 12.586 0 1 1 12.585-12.586 12.58 12.58 0 0 1-12.585 12.586zM341.069 321.36H223.084a12.6 12.6 0 0 1 0-25.198H341.07a12.6 12.6 0 1 1 0 25.198zm0-53.156H223.084a12.604 12.604 0 0 1 0-25.207H341.07a12.604 12.604 0 1 1 0 25.207zm0-53.156H223.084a12.6 12.6 0 0 1 0-25.199H341.07a12.6 12.6 0 1 1 0 25.199z" data-name="List"/>
                            </svg>
                            <!-- https://www.reshot.com/free-svg-icons/item/list-35TUZY4V6M/ -->
                        </button>
                        <h6 class="text-sm text-nowrap font-semibold">Logs</h6>
                    </div>
                    <div class="flex flex-col flex-1 basis-4 w-[15vw] max-w-[125px] h-4/5 items-center justify-center -translate-y-7">
                        <button id="addfood-button" class="btn-primary flex p-0 m-0 rounded-full border-2 border-[--text-color] h-full max-w-full aspect-square text-[0px] items-center justify-center">
                            <!-- AddFood-2 -->
                            <svg class="h-full p-1"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4,11H13v3a1,1,0,0,1-2,0V13H8a1,1,0,0,1,0-2h3V8a1,1,0,0,1,2,0v3h3a1,1,0,0,1,0,2Z"/>
                            </svg>
                            <!-- https://www.reshot.com/free-svg-icons/item/add-circle-TW5BZV2EF3/ -->
                        </button>
                        <h6 class="text-sm text-nowrap font-semibold">Add Food</h6>
                    </div>
                    <div class="flex flex-col flex-1 w-[15vw] max-w-[125px] h-2/3 items-center justify-center">
                        <button id="reminders-button" 
                        class="btn-primary flex p-0 m-0 rounded-lg border-2 border-[--text-color] h-full max-w-full aspect-square text-[0px] items-center justify-center">
                            <!-- Reminders-2 -->
                            <svg class="h-full" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M256 73.825c-100.613 0-182.18 81.562-182.18 182.17a182.18 182.18 0 0 0 364.36 0c0-100.608-81.572-182.17-182.18-182.17zm0 282.92a23.683 23.683 0 0 1-23.682-23.678h47.36A23.68 23.68 0 0 1 256 356.745zm80.015-47.425c0 8.753-7.092 9.334-15.841 9.334H191.822c-8.749 0-15.837-.58-15.837-9.334v-1.512a15.814 15.814 0 0 1 9.009-14.247l5.03-43.418a66.01 66.01 0 0 1 52.41-64.591v-16.857a13.572 13.572 0 0 1 27.146 0v16.857a66.01 66.01 0 0 1 52.404 64.591l5.032 43.427a15.793 15.793 0 0 1 9.009 14.238v1.512z" data-name="Notification"/>
                            </svg>
                            <!-- https://www.reshot.com/free-svg-icons/item/notification-MGH4E57DQJ/ -->
                        </button>
                        <h6 class="text-sm text-nowrap font-semibold">Reminders</h6>
                    </div>
                    <div class="flex flex-col flex-1 w-[15vw] max-w-[125px] h-2/3 items-center justify-center">
                        <button id="profile-button" 
                        class="btn-primary flex p-0 m-0 rounded-lg border-2 border-[--text-color] h-full max-w-full aspect-square text-[0px] items-center justify-center">
                            <!-- Profile-2 -->
                            <svg class="h-full"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M256 73.825a182.175 182.175 0 1 0 182.18 182.18A182.177 182.177 0 0 0 256 73.825zm0 71.833a55.05 55.05 0 1 1-55.054 55.046A55.046 55.046 0 0 1 256 145.658zm.52 208.723h-80.852c0-54.255 29.522-73.573 48.885-90.906a65.68 65.68 0 0 0 62.885 0c19.363 17.333 48.885 36.651 48.885 90.906z" data-name="Profile"/>
                            </svg>
                        </button>
                        <h6 class="text-sm text-nowrap font-semibold">Profile</h6>
                        <!-- https://www.reshot.com/free-svg-icons/item/profile-QX6KDSLJC5/ -->
                    </div>
                </div>
            </nav>
        `;
    }
}

customElements.define("app-navbar", AppNavbar);
