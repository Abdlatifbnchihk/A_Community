import axios from "https://esm.sh/axios";
const baseUrl = "https://tarmeezacademy.com/api/v1";
const urlPrams = new URLSearchParams(window.location.search);
const id = urlPrams.get("postId");

getPost();
function getPost() {
  axios.get(`${baseUrl}/posts/${id}`).then((response) => {
    const post = response.data.data;
    const comments = post.comments;

    const author = post.author;
    
    const nameOfPost = `${author.name}`;
    // const nameOfPost = author.name;

    document.getElementById("user-name-span").innerHTML = author.username;
    // document.getElementById('profile-image').innerHTML = author.profile_image
    // document.getElementById('user-name').innerHTML = nameOfPost
    // document.getElementById('image-post').innerHTML = post.image

    const postTitle = "";

    if (post.title !== null) {
      postTitle == post.title;
    }

    let commentsContent = ``;

    for (let comment of comments) {
      commentsContent += `
              <div class="p-3" style="background: rgb(228, 224, 224);">
                <!-- PROFILE PECTURE + USER NAME -->
                <div>
                  <img src="${comment.author.profile_image}" class="rounded-circle" alt="" style="width: 40px; height: 40px;">
                  <b>@${comment.author.username}</b>
                </div>
                <!-- PROFILE PECTURE + USER NAME -->
                <div>
                  ${comment.body}
                </div>
              </div>
          `;
    }

    let postContent = `
          <div class="card shadow my-5">
            <div class="card-header">
              <img
                src="${author.profile_image}"
                alt=""
                style="width: 40px; height: 40px"
                class="rounded-circle border border-3"
              />
              <b>@${nameOfPost}</b>
            </div>
            <div class="card-body" style="cursor: pointer; margin-top: 20px">
              <img src="${post.image}" class="w-100" alt="" />
              <h6 style="color: rgba(129, 118, 118, 0.571)" class="mt-2">
                ${post.created_at}
              </h6>
              <h5>${postTitle}</h5>
              <p> ${post.body}</p>
              <hr />
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                  />
                </svg>
                <span>(${post.comments_count}) Comments </span>
                <span id="post-tags-${post.id}">
                  <button
                    class="btn btn-sm rounded-5"
                    style="
                      background-color: gray;
                      color: white;
                      margine-right: 16px;
                    "
                  >
                    sports
                  </button>
                </span>
                <div id="comments">
                  ${commentsContent}
                </div>

                <div class="input-group mb-2 mt-4"  id="add-comment-div">
                  <input id="comment-input" placeholder="add your comment here.." class="form-control" style:"margin-right: 20px"/>
                  <button
                  id="add-comment" type="button" class="btn btn-primary " onclick="createCommentClick()">Add</button>
                </div>
              </div>
            </div>
          </div>
        `;
    document.getElementById("post").innerHTML = postContent;
  });
}

window.getPost = getPost;

function createCommentClick() {
  const commentBody = document.getElementById("comment-input").value;
  let prams = {
    body: commentBody,
  };

  let token = localStorage.getItem("token");

  let url = `${baseUrl}/posts/${id}/comments`;

  axios
    .post(url, prams, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      ShowAlert("The Comment Has Been Creacted Successfuly", "success");
      getPost();
    })
    .catch((erorr) => {
      const erorrMassage = erorr.response.data.message;
      ShowAlert(erorrMassage, "danger");
    });
}

window.createCommentClick = createCommentClick;

setupUI();
