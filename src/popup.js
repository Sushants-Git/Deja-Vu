let tagsEl = document.getElementById("tags");
const tagsInputWrapper = document.getElementById("tags-input-wrapper");
const createdTagsWrapper = document.getElementById("created-tags-wrapper");
const describeEl = document.getElementById("describe");
const markItButtonEl = document.getElementById("mark-it");
const goToBookmark = document.getElementById("bookmark");

let tagsArray = [];
let bookmarks = [];

// await chrome.storage.local.clear(() => {
//   console.log("cleared");
// });

tagsEl.addEventListener("keydown", function (event) {
  if (event.key === " " && tagsEl.value.trim() !== "") {
    addTag(tagsEl.value);
    createdTagsWrapper.style.marginBottom = "10px";
  }
});

createdTagsWrapper.addEventListener("click", function (event) {
  const id = event.target.dataset.id;
  deleteTag(id);
});

// goToBookmark.addEventListener("click", function () {
//   var newURL = "http://stackoverflow.com/";
//   chrome.tabs.create({ url: newURL });
// });

markItButtonEl.addEventListener("click", async function () {
  await getCurrentTab().then(async (tab) => {
    const url = tab.url;
    const title = tab.title;
    const strTagsArray = tagsArray.map((obj) => obj.value);
    const describe = describeEl.value.trim();
    const favIconUrl = tab.favIconUrl;

    let value = {
      id: generateCustomUUID(),
      url,
      title,
      strTagsArray,
      describe,
      favIconUrl,
    };

    bookmarks.push(value);

    bookmarks = bookmarks.map((bookmark) => ({
      ...bookmark,
      strTagsArray: JSON.stringify(bookmark.strTagsArray),
    }));

    await chrome.storage.local
      .set({ bookmarks: JSON.stringify(bookmarks) })
      .then(() => {
        // console.log("Value is set");
      });

    // await chrome.storage.local.get(["bookmarks"]).then((result) => {
    //   console.log("Value currently is " + result.bookmarks);
    // });

    tagsArray = [];
    describeEl.value = "";
    renderTags();

    loadBookmarks();
  });
});

loadBookmarks();

async function loadBookmarks() {
  await chrome.storage.local.get(["bookmarks"]).then((result) => {
    if (!result.bookmarks) return;
    let temp = JSON.parse(result.bookmarks);
    if (temp) {
      temp = temp.map((bookmark) => ({
        ...bookmark,
        strTagsArray: JSON.parse(bookmark.strTagsArray),
      }));
      bookmarks = temp;
    }
    console.log(temp);
  });
}

// console.log(JSON.stringify(bookmarks));

function deleteTag(id) {
  const temp = [];
  for (let i = 0; i < tagsArray.length; i++) {
    if (tagsArray[i].id !== id) {
      temp.push(tagsArray[i]);
    }
  }
  tagsArray = temp;
  renderTags();
}

function addTag(tag) {
  tagsArray.push({ id: generateCustomUUID(), value: tag.trim() });
  renderTags();
}

function renderTags() {
  if (tagsArray.length === 0) {
    createdTagsWrapper.style.marginBottom = "0px";
  }
  createdTagsWrapper.innerHTML = tagsArray
    .map((tag) => `<span class="tag" data-id=${tag.id}>${tag.value}</span>`)
    .join("");
  tagsEl.value = "";
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function generateCustomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
