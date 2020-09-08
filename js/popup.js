const infoBtn = document.querySelector("#info-btn"), // to click
  popup = document.querySelector("#popup"), // to be opened/closed
  home = document.querySelector("#home"), // to insert 'open class'
  hidable = document.querySelectorAll(".below-popup"); // to be hided/shown

infoBtn.addEventListener("click", openPopup);

function openPopup() {
  if (!home.classList.contains("popup")) {
    home.classList.add("popup");
    hidable.forEach((element) => {
      element.style.opacity = "0";
      element.style.display = "none";
    });
    popup.style.display = "flex";
  } else {
    home.classList.remove("popup");
    hidable.forEach((element) => {
      element.style.opacity = "1";
      element.style.display = "flex";
    });
    popup.style.display = "none";
  }
}
