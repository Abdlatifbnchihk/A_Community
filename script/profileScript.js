// import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js';
import axios from 'https://esm.sh/axios';


setupUI();
getUser();
getPosts;

function getCurrentUserId() {
  const urlPrams = new URLSearchParams(window.location.search);
  const id = urlPrams.get("userid");
  return id
}

// get user
function getUser() {
  // const currentId = getCurrentUser();
  // const id = currentId.id;
  const id = getCurrentUserId();
  axios.get(`${baseUrl}/users/${id}`).then((response) => {
    let user = response.data.data;
    
    document.getElementById("main-info-email").innerHTML = user.email;
    document.getElementById("main-info-name").innerHTML = user.name;
    document.getElementById("main-info-username").innerHTML = user.username;

    // POSTS && COMMENT COUNT
    document.getElementById("posts-count").innerHTML = user.posts_count;
    document.getElementById("comments-count").innerHTML = user.comments_count;
    document.getElementById("header-image").src = user.profile_image;
    document.getElementById("main-info-title").innerHTML = user.username;
  });
}

function getPosts() {
  const id = getCurrentUserId();
  axios.get(`${baseUrl}/users/${id}/posts`).then((response) => {
    const post = response.data.data;
    document.getElementById("user-posts").innerHTML = "";
    for (post of posts) {
      const author = post.author;

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
      <button class="btn btn-danger" style="float: right; margin-right: 12px" data-bs-toggle="modal" data-bs-target="#delete-modal" onclick="deletePostBtnClicked('${encodedPost}')">Delete</button>
      `;

      if (isMyPost) {
        editAndDeleteButtons = `${btnHtml}`;
      }

      let content = `
                    <div class="card shadow my-3">
                        <div class="card-header">
                            <img src="${author.profile_image}" alt="" style="width: 40px; height: 40px;" class="rounded-circle border border-3">
                            <b>${author.username}</b>

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

      document.getElementById("user-posts").innerHTML += content;

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
