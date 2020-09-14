const infoBtn = document.querySelector("#info-btn"), // to click
  popup = document.querySelector("#popup"), // to be opened/closed
  home = document.querySelector("#home"), // to insert 'open class'
  hidable = document.querySelectorAll(".below-popup"); // to be hided/shown

infoBtn.addEventListener("click", handlePopup);
let isPopupOpen = true;

function handlePopup() {
  isPopupOpen = !isPopupOpen;
  if (!isPopupOpen) {
    home.classList.remove("popup");
    hidable.forEach((element) => {
      // element.style.opacity = "0";
      // element.style.display = "none";
      element.classList.remove("hiden");
    });
    // popup.style.display = "flex";
    popup.classList.add("hiden");
  } else {
    home.classList.add("popup");
    hidable.forEach((element) => {
      // element.style.opacity = "1";
      // element.style.display = "flex";
      element.classList.add("hiden");
    });
    // popup.style.display = "none";
    popup.classList.remove("hiden");
  }
}
