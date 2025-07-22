// import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js';
import axios from 'https://esm.sh/axios';

const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;

// infinite scroll

window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});
// get posts & completed on the page html
function getPosts(reload = true, page = 1) {
  taggelLoader(true);
  axios.get(`${baseUrl}/posts?limit=5&page${page}`).then((response) => {
    taggelLoader(false);
    const posts = response.data.data;
    lastPage = response.data.meta.last_page;
    if (reload) {
      document.getElementById("posts").innerHTML = "";
    }
    for (let post of posts) {
      let author = post.author;

      const postTitle = "";

      if (post.title !== null) {
        postTitle == post.title;
      }

      // show or hide edit button

      let user = getCurrentUser();
      const isMyPost = user != null && post.author.id == user.id;
      let editAndDeleteButtons = ``;

      const encodedPost = encodeURIComponent(JSON.stringify(post));
      const btnHtml = `<button class="btn btn-primary" style="float: right;" onclick="editPostBtnClicked('${encodedPost}')">Update</button>
      <button class="btn btn-danger delete-button" style="float: right; margin-right: 12px" data-bs-toggle="modal" data-bs-target="#delete-modal" onclick="deletePostBtnClicked('${encodedPost}')">Delete</button>
      `;

      if (isMyPost) {
        editAndDeleteButtons = `${btnHtml}`;
      }

      let content = `
                    <div class="card shadow my-3">
                        <div class="card-header">
                            <span style="cursor: pointer; margin-bottom: 30px;" onclick="userClicked(${author.id})">
                              <img src="${author.profile_image}" alt="" style="width: 40px; height: 40px;" class="rounded-circle border border-3">
                              <b>${author.username}</b>
                            </span>  

                            ${editAndDeleteButtons}
                        </div>
                        <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
                            <img src="${post.image}" class="w-100" alt="">
                            <h6 style="color: rgba(129, 118, 118, 0.571);" class="mt-2">${post.created_at}</h6>
                            <h5>${postTitle}</h5>
                            <p>
                                ${post.body}
                            </p>
                            <hr>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                                <span>(${post.comments_count}) Comments </span>
                                <span id="post-tags-${post.id}">
                                  <button class="btn btn-sm rounded-5" style="background-color: gray; color: white; margine-right: 16px;">
                                    sports
                                  </button>  
                                </span>
                            </div>
                        </div>
                    </div>
    `;

      document.getElementById("posts").innerHTML += content;

      const currentPostTagId = `post-tags-${post.id}`;

      document.getElementById(currentPostTagId).innerHTML = "";

      for (tags of post.tags) {

        let tagContent = `
            <button class="btn btn-sm rounded-5" style="background-color: gray; color: white; margine-right: 16px;">
              ${tags.name}
            </button>
        `;

        document.getElementById(currentPostTagId).innerHTML += tagContent;
      }
    }
  });
}

window.getPosts = getPosts;

function userClicked(userId) {
  window.location = `profile.html?userid=${userId}`;
}

window.userClicked = userClicked;

function postClicked(id) {
  // console.log(id);
  window.location = `./postDitals.html?postId=${id}`;
}

window.postClicked = postClicked;

setupUI();

getPosts();

// rejister bttn
function rejisterBttn() {
  const rejister__username = document.getElementById(
    "rejister-input-username"
  ).value;
  const rejister__name = document.getElementById("rejister-input-name").value;
  const rejister__password = document.getElementById(
    "rejister-input-password"
  ).value;

  const register__userimage = document.getElementById(
    "rejister-input-user-image"
  ).files[0];
  const formData = new FormData();
  formData.append("name", rejister__name);
  formData.append("username", rejister__username);
  formData.append("password", rejister__password);
  formData.append("image", register__userimage);

  const rejiUrl = "https://tarmeezacademy.com/api/v1";
  const url = `${rejiUrl}/register`;

  taggelLoader(true);
  axios
    .post(url, formData)
    .then((data) => {
      taggelLoader(false);

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      const myModalEl = document.getElementById("rejister-modal");

      const modal =
        bootstrap.Modal.getInstance(myModalEl) ||
        new bootstrap.Modal(myModalEl);

      modal.hide();

      ShowAlert("New User Rejistred Successfully", "success");
      setupUI();
    })
    .catch((error) => {
      let errorMasage = error.response.data.message;
      ShowAlert(errorMasage, "danger");
    })
    .finally(() => {
      taggelLoader(false);
    });
}

window.rejisterBttn = rejisterBttn;

// add login bttn
function loginBttn() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const profilImageNavbar = document.getElementById("profil-image-navbar");

  const Params = {
    username: username,
    password: password,
  };
  const url = `${baseUrl}/login`;

  taggelLoader(true);
  axios
    .post(url, Params)
    .then((data) => {
      taggelLoader(false);

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      const myModalEl = document.getElementById("login-modal");

      const modal =
        bootstrap.Modal.getInstance(myModalEl) ||
        new bootstrap.Modal(myModalEl);

      modal.hide();

      ShowAlert("Login Is fuccessfully", "success");
      setupUI();
      getPosts();
    })
    .finally(() => {
      taggelLoader(false);
    });
}

window.loginBttn = loginBttn;

function profileClicked() {
  const user = getCurrentUser();
  const userId = user.id;
  window.location = `profile.html?userid=${userId}`;
}

window.profileClicked = profileClicked

// logout bttn
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setupUI();
  ShowAlert("Loged out Is Successfully");
  getPosts();
}

window.logout = logout;

// add new post button
function creatNewPostBttn() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const title__new__post = document.getElementById("new-post-title").value;
  const body__new__post = document.getElementById("new-post-body").value;
  const image__new__post = document.getElementById("new-post-image").files[0];

  const formData = new FormData();
  formData.append("title", title__new__post);
  formData.append("body", body__new__post);
  formData.append("image", image__new__post);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const newPostUrl = "https://tarmeezacademy.com/api/v1";
  let url = ``;

  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }

  taggelLoader(true);
  axios
    .post(url, formData, { headers: headers })
    .then((res) => {
      taggelLoader(false);
      const myModalEl = document.getElementById("addNew-post-Modal");

      const modal =
        bootstrap.Modal.getInstance(myModalEl) ||
        new bootstrap.Modal(myModalEl);

      modal.hide();

      getPosts();
      ShowAlert("The new post has been created");
    })
    .catch((error) => {
      let errorMasage = error.response.data.message;
      ShowAlert(errorMasage, "danger");
    })
    .finally(() => {
      taggelLoader(false);
    });
}

window.creatNewPostBttn= creatNewPostBttn;

// Update Post
function editPostBtnClicked(postObject) {
  const post = JSON.parse(decodeURIComponent(postObject));

  document.getElementById("post-modal-submit-btn").innerHTML = "Update";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("new-post-title").value = post.title;
  document.getElementById("new-post-body").value = post.body;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  let postModal = new bootstrap.Modal(
    document.getElementById("addNew-post-Modal"),
    {}
  );
  postModal.toggle();
}

window.editPostBtnClicked = editPostBtnClicked;

function addBttnClicked() {
  document.getElementById("post-modal-submit-btn").innerHTML = "Add";
  document.getElementById("post-id-input").value = "";
  document.getElementById("new-post-title").value = "";
  document.getElementById("new-post-body").value = "";
  document.getElementById("post-modal-title").innerHTML = "Add New Post";
  let postModal = new bootstrap.Modal(
    document.getElementById("addNew-post-Modal"),
    {}
  );
  postModal.toggle();
}

window.addBttnClicked = addBttnClicked

// Delete Post

function deletePostBtnClicked(postId) {
  const post = JSON.parse(decodeURIComponent(postId));
  document.getElementById("delete-post-id-title").value = post.id;
}

window.deletePostBtnClicked = deletePostBtnClicked

// Confirm Post Delete

function confirmPostDalete() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };

  const postId = document.getElementById("delete-post-id-title").value;

  const url = `${baseUrl}/posts/${postId}`;

  taggelLoader(true);
  axios
    .delete(url, { headers: headers })
    .then((data) => {
      taggelLoader(false);
      const myModalEl = document.getElementById("delete-modal");
      const modal =
        bootstrap.Modal.getInstance(myModalEl) ||
        new bootstrap.Modal(myModalEl);

      modal.hide();

      ShowAlert("The Post Has Been Deleted fuccessfully", "success");
      getPosts();
    })
    .catch((error) => {
      let errorMasage = error.response.data.message;
      ShowAlert(errorMasage, "danger");
    })
    .finally(() => {
      taggelLoader(false);
    });
}

window.confirmPostDalete = confirmPostDalete

function ShowAlert(customMasage, type = "success") {
  const alertPlaceholder = document.getElementById("success-alert");
  const appendAlert = (message, type) => {
    // add this line becouse setupUI() function is not working but not it's working
    if (!alertPlaceholder) {
      console.error("alertPlaceholder not found in DOM!");
      return;
    }
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(customMasage, type);

  // todo: hide alert

  // hide the alert
  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance("#success-alert");
    alert.close();
  }, 2000);
}

window.ShowAlert = ShowAlert;

function setupUI() {
  const token = localStorage.getItem("token");

  const login__div = document.getElementById("login-div");
  const logout__div = document.getElementById("logout-div");

  // add new comment
  const commentBody = document.getElementById("comment-input");
  // add new post bttn
  const add__new__post__bttn = document.getElementById("add-new-post-bttn");

  if (token == null) {
    if (add__new__post__bttn != null) {
      add__new__post__bttn.style.setProperty("display", "none", "important");
    }
    // commentBody.style.setProperty("display", "none")
    login__div.style.setProperty("display", "flex", "important");
    logout__div.style.setProperty("display", "none", "important");
  } else {
    if (add__new__post__bttn != null) {
      add__new__post__bttn.style.setProperty("display", "flex", "important");
    }
    // commentBody.style.setProperty("display", "flex")
    login__div.style.setProperty("display", "none", "important");
    logout__div.style.setProperty("display", "flex", "important");

    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;

    document.getElementById("rejister-input-user-image").src = user.profile_image;
  }
}

window.setupUI = setupUI

function getCurrentUser() {
  let user = null;

  const storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }

  return user;
}

window.getCurrentUser = getCurrentUser;

function taggelLoader(show = true) {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.visibility = show ? "visible" : "hidden";
  }
}

window.taggelLoader = taggelLoader;
