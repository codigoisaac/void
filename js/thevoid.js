const logo = document.querySelector("#the-logo");
const all = [...document.querySelector("#home").children];

logo.onmouseover = () => {
  all.forEach((element) => {
    if (all.indexOf(element) != 0) {
      element.style.opacity = "0";
    }
  });
};
logo.onmouseout = () => {
  all.forEach((element) => {
    if (all.indexOf(element) != 0) {
      element.style.opacity = "1";
    }
  });
};
