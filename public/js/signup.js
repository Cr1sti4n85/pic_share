import { showAlert } from "./alerts.js";
const signupForm = document.querySelector("form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;
  const elemento = document.querySelector("section");

  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      nombre,
      apellido,
      email,
      password,
      passwordConfirm,
    }),
  };
  try {
    const res = await fetch("/api/users/signup", options);
    const data = await res.json();
    if (data.status === "failed" || data.status === "error") throw data;
    showAlert(elemento, "success", data.msg);
    window.setTimeout(() => {
      location.assign("/");
    }, 2000);
  } catch (error) {
    showAlert(elemento, "error", error.msg);
  }
});
