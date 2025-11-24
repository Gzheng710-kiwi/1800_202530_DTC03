export function alertPopup(message, duration = 2500, transition = 500)
{
  createAlertPopup(message, duration, transition, "default");
}

export function successPopup(message, duration = 2500, transition = 500)
{
  createAlertPopup(message, duration, transition, "success");
}

export function errorPopup(message, duration = 2500, transition = 500)
{
  createAlertPopup(message, duration, transition, "error");
}


function createAlertPopup(message, duration = 2500, transition = 500, type = "default")
{
  const existingPopup = document.getElementById("popup");
  if (existingPopup)
  {
    existingPopup.remove();
  }

  const popupDiv = document.createElement("div");
  popupDiv.classList = `flex absolute top-2 left-1/4 w-1/2 z-10 duration-${transition} -translate-y-10`;
  popupDiv.classList.add("opacity-0");
  popupDiv.id = "popup";
  
  const popup = document.createElement("div")
  popup.classList = "flex flex-1 mx-12 justify-center text-xl font-semibold py-2 my-2 rounded-lg border border-[--primary-border-color] shadow-md"
  popup.textContent = message;
  
  switch (type)
  {
    case "success":
      popup.classList.add("success");
      break;
    case "error":
      popup.classList.add("error");
      break;
    default:
      popup.classList.add("popup");
      break;
  }
  popupDiv.appendChild(popup);
  document.body.appendChild(popupDiv);
  
  //Appear
  setTimeout(() => {
    show(popupDiv);
    popupDiv.classList.remove("-translate-y-10");

  }, 10);
  
  //Dissappear
  setTimeout(() => {
    hide(popupDiv);
    popupDiv.classList.add("-translate-y-10");
    
    setTimeout(() => {
      popupDiv.remove();
    }, transition + 100)
  }, duration);

}

function show(popupDiv)
{
  popupDiv.classList.remove("opacity-0");
  popupDiv.classList.add("opacity-100");
}

function hide(popupDiv)
{
  popupDiv.classList.remove("opacity-100");
  popupDiv.classList.add("opacity-0");
}