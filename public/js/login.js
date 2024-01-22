import { showAlert } from "./alerts.js";
const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const elemento = document.querySelector("header");

  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  };
  try {
    const res = await fetch("/api/auth/login", options);
    const data = await res.json();
    if (data.status === "failed" || data.status === "error") throw data;
    showAlert(elemento, "success", data.msg);
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    window.setTimeout(() => {
      location.assign("/posts");
    }, 2000);
  } catch (error) {
    showAlert(elemento, "error", error.msg);
  }
});
