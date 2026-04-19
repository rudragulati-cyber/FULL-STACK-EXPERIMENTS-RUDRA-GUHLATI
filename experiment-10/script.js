const postsEl = document.getElementById("posts");
const userEl = document.getElementById("user");
const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");
const key = "blog-platform-experiment";

function readPosts() {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function writePosts(posts) {
  localStorage.setItem(key, JSON.stringify(posts));
}

function render() {
  const posts = readPosts();
  postsEl.innerHTML = posts.map((post) => `
    <article class="post">
      <h2>${post.title}</h2>
      <p class="meta">By ${post.user} - protected route simulation</p>
      <p>${post.body}</p>
      <div class="comments">
        <strong>${post.comments.length} comments</strong>
        ${post.comments.map((comment) => `<div class="comment">${comment}</div>`).join("")}
        <div class="composer">
          <input placeholder="Add real-time comment" data-comment="${post.id}">
          <button data-add="${post.id}">Add Comment</button>
        </div>
      </div>
    </article>
  `).join("") || '<article class="post"><h2>No posts yet</h2><p>Create a profile and publish the first post.</p></article>';
}

document.getElementById("postBtn").addEventListener("click", () => {
  if (!userEl.value.trim() || !titleEl.value.trim() || !bodyEl.value.trim()) return;
  const posts = readPosts();
  posts.unshift({
    id: crypto.randomUUID(),
    user: userEl.value.trim(),
    title: titleEl.value.trim(),
    body: bodyEl.value.trim(),
    comments: []
  });
  writePosts(posts);
  titleEl.value = "";
  bodyEl.value = "";
  render();
});

postsEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const input = postsEl.querySelector(`[data-comment="${button.dataset.add}"]`);
  const posts = readPosts();
  const post = posts.find((item) => item.id === button.dataset.add);
  if (post && input.value.trim()) post.comments.push(input.value.trim());
  writePosts(posts);
  render();
});

render();
