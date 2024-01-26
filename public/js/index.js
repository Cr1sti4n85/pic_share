import { signup } from "./signup.js";
import { login } from "./login.js";
import { updateInfo, updatePassword } from "./profile.js";
import {
  nextAndPrevious,
  deletePost,
  renderPostToModal,
  changeUpdtToCreateBtn,
  createOrUpdatePost,
} from "./post.js";
import {
  readComments,
  sendComment,
  getAndUpdateComment,
  deleteComment,
} from "./comments.js";

const signupForm = document.querySelector(".signup-form");
const loginForm = document.querySelector(".login-form");
const btnComentarios = document.querySelector(".comentarios");
const modalForm = document.querySelector("#modal");
const infoForm = document.querySelector(".info-general");
const passwordForm = document.querySelector(".info-password");
// const element = document.querySelector("body");
const prevNextContainer = document.querySelector(".prev-next-container");
const cardContainer = document.querySelector(".card-container");
const btnPost = document.querySelector(".btn-post");
const btnUpdate = document.querySelector(".btn-update");

if (infoForm) {
  updateInfo(infoForm);
}

if (passwordForm) {
  updatePassword(passwordForm);
}

if (signupForm) {
  signup(signupForm);
}

if (loginForm) {
  login(loginForm);
}

if (cardContainer) {
  sendComment(cardContainer);
  getAndUpdateComment(cardContainer);
  deleteComment(cardContainer);
  deletePost(cardContainer);
  renderPostToModal(cardContainer);
}

if (btnComentarios) {
  readComments(cardContainer);
}

if (prevNextContainer) {
  nextAndPrevious(prevNextContainer, cardContainer);
}

if (btnPost) {
  changeUpdtToCreateBtn(btnPost, btnUpdate);
}
if (modalForm) {
  createOrUpdatePost(modalForm);
}
