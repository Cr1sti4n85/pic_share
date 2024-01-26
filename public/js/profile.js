import { showAlert } from "./alerts.js";

// const infoForm = document.querySelector(".info-general");
// const passwordForm = document.querySelector(".info-password");
const elemento = document.querySelector("section");

export const updateInfo = (infoForm) => {
  infoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;

    let options = {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        nombre,
        apellido,
        email,
      }),
    };

    try {
      const res = await fetch("/api/users/my-profile", options);
      const data = await res.json();
      if (data.status === "failed" || data.status === "error") throw data;

      showAlert(elemento, "success", data.msg);
    } catch (error) {
      showAlert(elemento, "error", error.msg);
    }
  });
};

export const updatePassword = (passwordForm) => {
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    let options = {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        password,
        passwordConfirm,
      }),
    };

    try {
      const res = await fetch("/api/users/password", options);
      const data = await res.json();

      if (data.status === "failed" || data.status === "error") throw data;

      showAlert(elemento, "success", data.msg);
    } catch (error) {
      showAlert(elemento, "error", error.msg);
    }
  });
};
