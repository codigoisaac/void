const popup = document.querySelector("#info-btn");

popup.addEventListener("click", openPopup);

function openPopup() {
  if (!popup.classList.contains("open")) {
    popup.classList.add("open");
  } else {
    popup.classList.remove("open");
  }
}
