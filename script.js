document.querySelector("#play-button").addEventListener("click", play);
document.querySelector("#the-logo").addEventListener("click", voidit);

function play() {
  console.log("play");
}

function voidit() {
  console.log("voidit");
}

// Cursor
const cursor = document.querySelector("#cursor");
const cursorSize = cursor.offsetWidth;
const offset = cursorSize / 2;

document.addEventListener("mousemove", (e) => {
  cursor.setAttribute(
    "style",
    "top: " + (e.pageY - offset) + "px; left: " + (e.pageX - offset) + "px;"
  );
});
