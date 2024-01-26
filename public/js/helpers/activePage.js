import { getPath } from "./getUrlPath.js";

export function setActive(nav) {
  const path = getPath();
  if (path === "posts") {
    modifyEl(nav.querySelector(".posts"));
  }
  if (path === "my-posts") {
    modifyEl(nav.querySelector(".my-posts"));
  }
  if (path === "my-profile") {
    modifyEl(nav.querySelector(".profile"));
  }
}

function modifyEl(element) {
  element.classList.add("active");
  element.setAttribute("aria-current", "page");
}
