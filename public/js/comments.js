import { showAlert } from "./alerts.js";
const element = document.querySelector("body");
let page = 0;
export function readComments(cardContainer) {
  cardContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("comentarios")) {
      const card = e.target.closest(".card");
      // const containerComments = e.target.closest(".container-comments");
      const containerComments = card.querySelector(".container-comments");
      const postId = card.dataset.id;
      try {
        let html = ``;
        const res = await fetch(`/api/posts/${postId}/comments`);
        const data = await res.json();

        if (data.status === "failed" || data.status === "error") throw data;
        if (data.comments.length === 0) return;
        data.comments.forEach((comment) => {
          const markup = `
            <div class="d-flex comment-container" data-id="${comment.id}">
                <div class="flex-shrink-0 ">
                  ${
                    comment.user.img_perfil === "perfil-default.png"
                      ? `<img src="/uploads/${comment.user.img_perfil}" alt="user-pic" class="media_img" width="64" height="64">`
                      : `<img src="/uploads/${comment.user_id}/${comment.user.img_perfil}" alt="user-pic" class="media_img" width="64" height="64">`
                  }
    
                </div>
                <div class="flex-grow-1 ms-2">
                    <h5>${comment.user.nombre} ${comment.user.apellido}</h5>
                    <p class="contenido mb-0" >${comment.contenido}</p>
                      ${
                        data.id === comment.user_id || data.rol === "admin"
                          ? `<button class="btn p-0 btn-comment-edit me-2">Editar</button>
                             <button class="btn p-0 btn-comment-delete">Eliminar</button>`
                          : ""
                      }
                </div>
    
            </div>
            <hr>
    
            `;
          html += markup;
        });
        // html += "</div>";
        containerComments.insertAdjacentHTML("beforeend", html);
        page++;
      } catch (error) {
        console.log(error);
        showAlert(element, "error", error.msg || "Ocurrió un error");
      }
    }
  });
}

export function sendComment(cardContainer) {
  cardContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-enviar-comentario")) {
      const postId = e.target.closest(".card").dataset.id;
      const card = e.target.closest(".card");
      let contenido = document.getElementById(`contenido-${postId}`).value;

      try {
        let options = {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            contenido,
          }),
        };

        const res = await fetch(`/api/posts/${postId}/comments`, options);
        const data = await res.json();
        if (data.status === "failed" || data.status === "error") throw data;
        const commentAmount =
          card.querySelector(".comentarios").textContent.charAt(0) * 1 + 1;
        card.querySelector(
          ".comentarios"
        ).textContent = `${commentAmount} comentarios`;
        document.getElementById(`contenido-${postId}`).value = "";
        showAlert(element, "success", data.msg);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.log(error);
        showAlert(element, "error", error.msg || "Ocurrió un error");
      }
    }
  });
}

export function getAndUpdateComment(cardContainer) {
  cardContainer.addEventListener("click", async (e) => {
    const card = e.target.closest(".card");
    //mostrar el contenido original en el cuadro de texto al hacer click en editar
    if (e.target.classList.contains("btn-comment-edit")) {
      let commentContainer = e.target.closest(".comment-container");
      const cardFooterUpdateBtn = card
        .querySelector(".card-footer")
        .querySelector(".btn-actualizar-comentario");
      cardFooterUpdateBtn.dataset.id = commentContainer.dataset.id;
      let contenidoOriginal =
        commentContainer.querySelector(".contenido").textContent;
      const textArea = card.querySelector("textarea");
      textArea.style.border = "1px solid red";
      textArea.textContent = contenidoOriginal;
      textArea.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    //actualizar el comentario en la BD
    if (e.target.classList.contains("btn-actualizar-comentario")) {
      const id = e.target.getAttribute("data-id");
      const contenido = card.querySelector("textarea").value;
      let options = {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          contenido,
        }),
      };

      try {
        const res = await fetch(`/api/comments/${id}`, options);
        const data = await res.json();
        if (data.status === "failed" || data.status === "error") throw data;
        showAlert(element, "success", data.msg);
        card.querySelector("textarea").value = "";
        card.querySelector("textarea").style.border = "";
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.log(error);
        showAlert(element, "error", error.msg || "Ocurrió un error");
      }
    }
  });
}

export function deleteComment(cardContainer) {
  cardContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-comment-delete")) {
      const commentContainer = e.target.closest(".comment-container");
      const commentId = commentContainer.dataset.id;
      const card = e.target.closest(".card");

      let options = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
      };
      try {
        const res = await fetch(`/api/comments/${commentId}`, options);
        const data = await res.json();
        if (data.status === "failed" || data.status === "error") throw data;
        const commentAmount =
          card.querySelector(".comentarios").textContent.charAt(0) * 1 - 1;
        card.querySelector(
          ".comentarios"
        ).textContent = `${commentAmount} comentarios`;
        showAlert(element, "success", data.msg);
        const hr = commentContainer.nextElementSibling;
        hr.remove();
        commentContainer.remove();
      } catch (error) {
        console.log(error);
        showAlert(element, "error", error.msg || "Ocurrió un error");
      }
    }
  });
}
