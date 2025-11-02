class AppPopup extends HTMLElement 
{
    constructor() 
    {
        super();
        this.renderPopup();
    }

    connectedCallback()
    {
        this.addEventListeners();
    }

    renderPopup()
    {
        this.innerHTML = `
            //html here
        `;
    }
}

customElements.define("popup", AppPopup);