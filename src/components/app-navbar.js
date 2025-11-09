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
        // console.log("Setting up navbar listeners...");
        setupNavbar();
    }

    renderNavbar() 
    {
        this.innerHTML = `
        <nav class="fixed bottom-0 left-0 w-full bg-[--secondary-bg-color] border-t-2 border-[--text-color]">
            <div class="flex justify-around items-center h-32 gap-[2vw]">
                <!-- DASHBAORD -->
                <div class="flex flex-col flex-1 w-[15vw] max-w-[125px] h-2/3 items-center justify-center">
                    <button id="dashboard-button" 
                    class="btn-primary flex p-0 m-0 rounded-lg border-2 border-[--text-color] h-full max-w-full aspect-square text-[0px] items-center justify-center">
                        <!-- Dashboard 1 -->
                        <svg class="size-11"
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
                <!-- LOGS -->
                <div class="flex flex-col flex-1 w-[15vw] max-w-[125px] h-2/3 items-center justify-center">
                    <button id="logs-button" 
                    class="btn-primary flex p-0 m-0 rounded-lg border-2 border-[--text-color] h-full max-w-full aspect-square text-[0px] items-center justify-center">
                        <!-- Logs-2 -->
                        <svg class="size-14"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 73.825c-100.608 0-182.18 81.562-182.18 182.17a182.18 182.18 0 0 0 364.36 0c0-100.608-81.572-182.17-182.18-182.17zM183.517 322.15a12.586 12.586 0 1 1 12.585-12.586 12.579 12.579 0 0 1-12.585 12.586zm0-53.56a12.586 12.586 0 1 1 12.585-12.596 12.581 12.581 0 0 1-12.585 12.596zm0-53.57a12.586 12.586 0 1 1 12.585-12.586 12.58 12.58 0 0 1-12.585 12.586zM341.069 321.36H223.084a12.6 12.6 0 0 1 0-25.198H341.07a12.6 12.6 0 1 1 0 25.198zm0-53.156H223.084a12.604 12.604 0 0 1 0-25.207H341.07a12.604 12.604 0 1 1 0 25.207zm0-53.156H223.084a12.6 12.6 0 0 1 0-25.199H341.07a12.6 12.6 0 1 1 0 25.199z" data-name="List"/>
                        </svg>
                        <!-- https://www.reshot.com/free-svg-icons/item/list-35TUZY4V6M/ -->
                    </button>
                    <h6 class="text-sm text-nowrap font-semibold">Logs</h6>
                </div>
                <!-- ADD FOOD -->
                <div class="flex flex-col flex-1 basis-4 w-[15vw] max-w-[125px] h-4/5 items-center justify-center -translate-y-7">
                    <button id="addfood-button" class="btn-primary flex p-0 m-0 rounded-full border-2 border-[--text-color] h-full max-w-full aspect-square text-[0px] items-center justify-center">
                        <!-- AddFood-2 -->
                        <svg class="size-20 p-1"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4,11H13v3a1,1,0,0,1-2,0V13H8a1,1,0,0,1,0-2h3V8a1,1,0,0,1,2,0v3h3a1,1,0,0,1,0,2Z"/>
                        </svg>
                        <!-- https://www.reshot.com/free-svg-icons/item/add-circle-TW5BZV2EF3/ -->
                    </button>
                    <h6 class="text-sm text-nowrap font-semibold">Add Food</h6>
                </div>
                <!-- GROUPS -->
                <div class="flex flex-col flex-1 w-[15vw] max-w-[125px] h-2/3 items-center justify-center">
                    <button id="reminders-button" 
                    class="btn-primary flex p-0 m-0 rounded-lg border-2 border-[--text-color] h-full max-w-full aspect-square text-[0px] items-center justify-center">
                        <!-- Groups 2 -->
                        <svg class="size-11" version="1.1" id="svg2" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" sodipodi:docname="group-alt.svg" inkscape:version="0.48.4 r9939" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200px" height="200px" viewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="path10785" inkscape:connector-curvature="0" d="M600,0C268.629,0,0,268.629,0,600s268.629,600,600,600 s600-268.629,600-600S931.371,0,600,0z M598.784,333.625c55.343,0.728,101.183,45.781,116.413,103.191 c5.807,23.424,6.462,47.188,0.608,71.998c-8.827,34.929-26.498,69.048-59.423,90.008l47.986,22.796l114.021,55.205 c11.199,4.8,16.793,14.399,16.793,28.8v110.372c0,22.763,1.808,42.393-26.406,50.418H388.792 c-27.134-0.391-28.258-27.874-27.622-50.418V705.623c0-14.4,6.009-24.415,18.009-30.016l117.591-53.989L542.401,600 c-20.8-13.6-37.202-32.383-49.202-56.383c-14.41-31.684-20.123-72.814-9.612-110.411 C496.875,382.244,538.491,336.458,598.784,333.625L598.784,333.625z M403.191,384.005c17.601,0,33.587,5.215,47.986,15.615 c-3.993,11.198-7.375,23.009-10.183,35.41c-2.799,12.398-4.217,25.38-4.217,38.981c0,20.001,2.796,39.199,8.396,57.6 c5.599,18.399,13.61,35.217,24.013,50.418c-4.801,6.399-11.187,11.993-19.188,16.793l-88.83,40.805 c-12,6.4-21.599,15.376-28.799,26.977c-7.2,11.6-10.79,24.619-10.79,39.02v110.372h-87.576 c-12.705-0.198-21.286-13.002-21.619-26.368V685.221c0-12,4.384-20.013,13.184-24.013L358.777,600 c-34.417-21.156-51.021-59.395-52.773-101.976C306.61,445.562,340.996,388.363,403.191,384.005L403.191,384.005z M796.771,384.005 c55.291,0.874,95.229,55.691,97.227,114.02c-0.304,38.595-15.369,75.863-50.418,100.798l130.813,62.386 c8.8,4.8,13.184,12.812,13.184,24.013v104.407c-0.132,12.392-6.82,25.103-21.58,26.367h-90.008V705.623 c0-14.4-3.59-27.419-10.79-39.02s-16.8-20.576-28.8-26.976c-37.304-17.339-80.146-29.784-108.017-58.814 c20.8-32,31.193-67.601,31.193-106.802c0-24.8-4.384-49.214-13.184-73.214C760.843,391.256,777.949,384.273,796.771,384.005 L796.771,384.005z"></path></g></svg>
                        <!-- https://www.svgrepo.com/svg/391872/group-alt -->
                    </button>
                    <h6 class="text-sm text-nowrap font-semibold">Groups</h6>
                </div>
                <!-- PROFILE -->
                <div class="flex flex-col flex-1 w-[15vw] max-w-[125px] h-2/3 items-center justify-center">
                    <button id="profile-button" 
                    class="btn-primary flex p-0 m-0 rounded-lg border-2 border-[--text-color] h-full max-w-full aspect-square text-[0px] items-center justify-center">
                        <!-- Profile-2 -->
                        <svg class="size-14"
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
