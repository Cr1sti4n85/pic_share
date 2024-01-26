import { showAlert } from "./alerts.js";
import { getPath } from "./helpers/getUrlPath.js";
import { getPage } from "./helpers/getPage.js";
import { createFile } from "./helpers/createFileObject.js";

const element = document.querySelector("body");
let page = 0;
let totalPages = 0;
let size = 5;

export function nextAndPrevious(prevNextContainer, cardContainer) {
  prevNextContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("prev-next-container")) return;
    const path = getPath();
    let res;
    try {
      page = getPage(page, e);
      if (totalPages === page) {
        page--;
        return;
      }

      if (path === "posts") {
        res = await fetch(`/api/posts?page=${page}&size=${size}`);
      } else {
        res = await fetch(`/api/posts/my-posts?page=${page}&size=${size}`);
      }
      const data = await res.json();

      totalPages = data.response.totalPages;

      let html = "";
      data.response.posts.forEach((post) => {
        const markup = `
      <div class="card w-50 mb-2 m-auto" data-id="${post.id}">       
        <div class="card-body">
          <h3 class="card-title">${post.titulo}</h3>
          <p class="card-text card-subtitle">${post.user.nombre} ${
          post.user.apellido
        }</p>
          <img src="/uploads/${post.user_id}/${
          post.imagen_url
        }" alt="" class="card-img-top img-fluid">
          <p class="card-text">${post.descripcion}</p>
        </div>
        <div class="card-footer">
          <div class="mb-3">
            <div class="d-flex justify-content-between align-center">
              <label for="comentario" class="mb-0 form-label">Escribe un comentario</label>
              <button class="btn p-0 btn-enviar-comentario">Enviar</button>
            </div>
              <textarea  class="form-control" id="contenido-${
                post.id
              }" rows="2"></textarea>
          </div>
          <div class="d-flex justify-content-between">
            <button class="btn comentarios">${
              post.comments
            } comentarios</button>
              ${
                post.user_id === post.userId || post.rol === "admin"
                  ? `<div>
              <button class="btn btn-editar-post">Editar</button>
              <button class="btn btn-eliminar-post">Eliminar</button>
            </div>`
                  : ""
              }
          </div> 
        </div>
        <div class="container-comments bg-white rounded-lg mt-2"></div>
    </div>`;

        html += markup;
      });
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        card.remove();
      });
      cardContainer
        .querySelector(".btn-create-container")
        .insertAdjacentHTML("afterend", html);
    } catch (error) {
      showAlert(
        element,
        "error",
        "Hubo un problema al obtener las publicaciones"
      );
    }
  });
}

export function deletePost(cardContainer) {
  cardContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-eliminar-post")) {
      const postId = e.target.closest(".card").dataset.id;
      let options = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
        postId,
      };

      try {
        const res = await fetch(`/api/posts/${postId}`, options);
        const data = await res.json();
        if (data.status === "failed" || data.status === "error") throw data;
        showAlert(element, "success", data.msg);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        showAlert(element, "error", error.msg || "Ocurrió un error");
      }
    }
  });
}

export function renderPostToModal(cardContainer) {
  cardContainer.addEventListener("click", async (e) => {
    if (e.target.matches(".btn-editar-post")) {
      const card = e.target.closest(".card");
      const postId = card.dataset.id;
      const imgPath = card.querySelector("img").src;
      const fileEl = document.getElementById("archivo");
      const cardTitle = card.querySelector(".card-title").textContent;
      const cardDescription =
        card.querySelector(".card-description").textContent;
      document.getElementById("titulo").value = cardTitle;
      document.getElementById("descripcion").value = cardDescription.trim();
      document.querySelector(".btn-update").dataset.id = postId;
      const dataTransfer = await createFile(imgPath);
      fileEl.files = dataTransfer.files;
    }
  });
}

export function createOrUpdatePost(modalForm) {
  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (e.submitter.classList.contains("btn-update")) {
      const postId = document.querySelector(".btn-update").dataset.id;
      const updateForm = new FormData(modalForm);
      let options = {
        method: "PUT",
        body: updateForm,
      };
      try {
        const res = await fetch(`/api/posts/${postId}`, options);
        if (!res.ok) throw res;
        showAlert(element, "success", "Publicación actualizada");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        // console.log(error);
        showAlert(element, "error", error.msg || "Ocurrió un error");
      }
    }
    if (e.submitter.classList.contains("btn-post")) {
      const newformData = new FormData(modalForm);
      let options = {
        method: "POST",
        body: newformData,
      };

      try {
        const res = await fetch("/api/posts", options);
        const data = await res.json();
        if (data.status === "failed" || data.status === "error") throw data;
        showAlert(element, "success", data.msg);
        setTimeout(() => {
          location.href = "/posts";
        }, 3000);
      } catch (error) {
        showAlert(element, "error", error.msg || "Ocurrió un error");
      }
    }
  });
}

export function changeUpdtToCreateBtn(btnPost, btnUpdate) {
  //   const btnPost = document.querySelector(".btn-post");
  //   const btnUpdate = document.querySelector(".btn-update");

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-create-post")) {
      btnUpdate.style.display = "none";
      btnPost.style.display = "inline-block";
      document.getElementById("titulo").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("archivo").value = "";
    }
    if (e.target.classList.contains("btn-editar-post")) {
      btnPost.style.display = "none";
      btnUpdate.style.display = "inline-block";
    }
  });
}
