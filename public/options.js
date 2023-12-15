// console.log("New updated version Runnign");

loadBookmarks();

let bookmarks = [];
let tagsArray = [];
let choosenBookmarks = bookmarks;
let choosenBookmarksListObj = null;
let counter = 0;
let editToggle = false;

let describeEl = document.getElementById("options-describe");
let tagsEl = document.getElementById("options-tags");
const optionsCreatedTagsWrapper = document.getElementById(
  "options-created-tags-wrapper"
);

async function loadBookmarks() {
  await chrome.storage.local.get(["bookmarks"]).then((result) => {
    if (!result.bookmarks) {
      tableWrapper.innerHTML = `<div class="no-bookmark-message"><span>No Bookmarks Yet</span></div>`;
      return;
    }
    let temp = JSON.parse(result.bookmarks);
    if (temp) {
      temp = temp.map((bookmark) => ({
        ...bookmark,
        strTagsArray: JSON.parse(bookmark.strTagsArray),
      }));
      bookmarks = temp;
      choosenBookmarks = bookmarks;
    }
    renderTable();
    // console.log(temp);
  });
}

describeEl.addEventListener("keyup", function (event) {
  if (describeEl.value.trim() !== "") {
    tagsEl.disabled = true;
  } else if (describeEl.value.trim() === "") {
    tagsEl.disabled = false;
  }
});

tagsEl.addEventListener("keyup", function (event) {
  if (tagsEl.value.trim() !== "" || tagsArray.length !== 0) {
    describeEl.disabled = true;
  } else if (tagsEl.value.trim() === "") {
    describeEl.disabled = false;
  }

  if (event.key === " " && tagsEl.value.trim() !== "") {
    addTag(tagsEl.value);
    // console.log("Works");
  }
});

optionsCreatedTagsWrapper.addEventListener("click", function (event) {
  const id = event.target.dataset.id;
  deleteTag(id);
});

function addTag(tag) {
  optionsCreatedTagsWrapper.style.marginTop = "10px";
  tagsArray.push({ id: generateCustomUUID(), value: tag.trim() });
  renderTags();
}

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

function renderTags() {
  if (tagsArray.length === 0) {
    optionsCreatedTagsWrapper.style.marginTop = "0px";
    describeEl.disabled = false;
  }
  optionsCreatedTagsWrapper.innerHTML = tagsArray
    .map((tag) => `<span class="tag" data-id=${tag.id}>${tag.value}</span>`)
    .join("");
  tagsEl.value = "";
}

function generateCustomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

document.getElementById("search-button").addEventListener("click", function () {
  if (
    describeEl.value.trim() === "" &&
    tagsEl.value.trim() === "" &&
    tagsArray.length === 0
  ) {
    return;
  }
  if (describeEl.value.trim() === "" || tagsArray.length !== 0) {
    searchByTags();
  } else {
    ask(describeEl.value);
  }
});

document.getElementById("edit-button").addEventListener("click", function () {
  editToggle = !editToggle;
  if (editToggle) {
    document.getElementById("edit-message-wrapper").style.display = "block";
    document.getElementById("bookmark-table-content").style.cursor = "pointer";
  } else {
    document.getElementById("edit-message-wrapper").style.display = "none";
    document.getElementById("bookmark-table-content").style.cursor = "auto";
  }
  renderTable();
});

document
  .getElementById("bookmark-table-content")
  .addEventListener("click", function (event) {
    if (editToggle) {
      deleteBookmark(event.target.parentElement.dataset.id);
    }
  });

async function deleteBookmark(id) {
  // console.log(id);
  let temp = [];
  choosenBookmarks.map((bookmark) => {
    // console.log(bookmark.id);
    if (bookmark.id !== id) {
      temp.push(bookmark);
    }
  });
  choosenBookmarks = temp;

  let setter = choosenBookmarks.map((choosenBookmark) => ({
    ...choosenBookmark,
    strTagsArray: JSON.stringify(choosenBookmark.strTagsArray),
  }));

  await chrome.storage.local
    .set({ bookmarks: JSON.stringify(setter) })
    .then(() => {
      // console.log("Value is set");
    });

  // await chrome.storage.local.get(["bookmarks"]).then((result) => {
  //   console.log("Value currently is " + result.bookmarks);
  // });

  renderTable();
}

const threeDotSVG = `<svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
<circle cx="15" cy="15" r="15">
    <animate attributeName="r" from="15" to="15"
             begin="0s" dur="0.8s"
             values="15;9;15" calcMode="linear"
             repeatCount="indefinite" />
    <animate attributeName="fill-opacity" from="1" to="1"
             begin="0s" dur="0.8s"
             values="1;.5;1" calcMode="linear"
             repeatCount="indefinite" />
</circle>
<circle cx="60" cy="15" r="9" fill-opacity="0.3">
    <animate attributeName="r" from="9" to="9"
             begin="0s" dur="0.8s"
             values="9;15;9" calcMode="linear"
             repeatCount="indefinite" />
    <animate attributeName="fill-opacity" from="0.5" to="0.5"
             begin="0s" dur="0.8s"
             values=".5;1;.5" calcMode="linear"
             repeatCount="indefinite" />
</circle>
<circle cx="105" cy="15" r="15">
    <animate attributeName="r" from="15" to="15"
             begin="0s" dur="0.8s"
             values="15;9;15" calcMode="linear"
             repeatCount="indefinite" />
    <animate attributeName="fill-opacity" from="1" to="1"
             begin="0s" dur="0.8s"
             values="1;.5;1" calcMode="linear"
             repeatCount="indefinite" />
</circle>
</svg>`;

function ask(question) {
  tableWrapper.innerHTML = `
  <div class="loading-bookmark-message">${threeDotSVG}</div>
  <div class="loading-message">If the search is taking longer than usual, it's likely due to the model downloading.</div>
  <div class="loading-message">Nothing to worry about the model is small and just needs to be loaded once.</div>`;
  choosenBookmarksListObj = new ChoosenBookmarksList();
  bookmarks.map(async (bookmark, index) => {
    await compareTwoMessages({
      action: "classify",
      sentence1: question,
      sentence2: bookmark.describe + " " + bookmark.title,
      details: {
        ...bookmark,
      },
    });
  });
}

async function compareTwoMessages(message) {
  await chrome.runtime.sendMessage(message, async (response) => {
    // console.log(message);
    // console.log(response);
    counter++;
    choosenBookmarksListObj.addToList(message, response);
    if (counter === bookmarks.length) {
      renderList();
      counter = 0;
    }
  });
}

let tableWrapper = document.getElementById("bookmark-table-content");

function searchByTags() {
  if (tagsEl.value.trim() !== "") {
    addTag(tagsEl.value);
  }
  let temp = [];
  bookmarks.map((bookmark) =>
    bookmark.strTagsArray.map((tag) => {
      if (tagsArray.some((ele) => ele.value === tag)) {
        temp.push(bookmark);
        return;
      }
    })
  );
  choosenBookmarks = temp;
  if (temp.length === 0) {
    choosenBookmarks = bookmarks;
  }
  renderTable();
  // console.log(temp);
}

function renderTable() {
  if (choosenBookmarks.length === 0) {
    tableWrapper.innerHTML = `<div class="no-bookmark-message"><span>No Bookmarks Yet</span></div>`;
    return;
  }
  tableWrapper.innerHTML = choosenBookmarks
    .map((bookmark, index) => {
      return (
        `
    <div  class="titles-content" data-id=${bookmark.id}>
    <div class="hash" id="num">${index + 1}</div>
    <div class="favicon" id="favicon">
      <img src=${bookmark.favIconUrl} />
    </div>
    <div>${bookmark.title}</div>
    <div>${bookmark.strTagsArray.join(" , ")}</div>
    <div>
    ${bookmark.describe}
    </div>
    <div id="options-link-wrapper">
    <a href=${bookmark.url} id="options-link" target="_blank">
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        vector-effect="non-scaling-stroke"
        d="M18.25 15.5a.75.75 0 0 0 .75-.75v-9a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0 0 1.5h7.19L6.22 16.72a.75.75 0 1 0 1.06 1.06L17.5 7.56v7.19c0 .414.336.75.75.75z"
      ></path>
    </svg>
  </a>
    </div>
  </div>` + `<hr / >`
      );
    })
    .join("");
}
// </div>` + `${index !== choosenBookmarks.length - 1 ? "<hr / >" : ""}`

function renderList() {
  tableWrapper.innerHTML = choosenBookmarksListObj.renderList();
  if (choosenBookmarksListObj.length >= 10) {
    tableWrapper.innerHTML += `<div class="top-bookmark-message"><span>Showing the top 10 results</span></div>`;
  }
}

class ChoosenBookmarksList {
  head = null;
  tail = null;
  length = 0;

  addToList(message, alike) {
    let node = {
      ...message.details,
      alike: alike,
      next: null,
      prev: null,
    };
    if (this.head === null) {
      this.head = this.tail = node;
      this.length += 1;
    } else {
      let pointer = this.head;
      let insertedFlag = false;
      while (pointer !== null) {
        if (node.alike > this.head.alike) {
          this.head.prev = node;
          node.next = this.head;
          this.head = node;
          insertedFlag = true;
        } else if (pointer.next === null) {
          pointer.next = node;
          node.prev = pointer;
          node.next = null;
          this.tail = node;
          insertedFlag = true;
        } else if (node.alike > pointer.alike) {
          pointer.prev.next = node;
          node.prev = pointer.prev;
          pointer.prev = node;
          node.next = pointer;
          insertedFlag = true;
        }
        if (insertedFlag) {
          this.length += 1;
          break;
        }
        pointer = pointer.next;
      }
    }

    if (this.length > 10) {
      this.tail = this.tail.prev;
      this.tail.next = null;
      this.length -= 1;
      // console.log("ran");
    }
  }

  printList() {
    let pointer = this.head;
    while (pointer !== null) {
      // console.log({ ...pointer });
      pointer = pointer.next;
    }
    // console.log("EOL");
  }

  renderList() {
    let pointer = this.head;
    let returningValue = "";
    let counter = 0;
    while (pointer !== null) {
      let bookmark = pointer;
      returningValue +=
        `
      <div  class="titles-content" data-id=${bookmark.id}>
      <div class="hash" id="num">${counter + 1}</div>
      <div class="favicon" id="favicon">
        <img src=${bookmark.favIconUrl} />
      </div>
      <div>${bookmark.title}</div>
      <div>${bookmark.strTagsArray.join(" , ")}</div>
      <div>
      ${bookmark.describe}
      </div>
      <div id="options-link-wrapper">
      <a href=${bookmark.url} id="options-link" target="_blank">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          vector-effect="non-scaling-stroke"
          d="M18.25 15.5a.75.75 0 0 0 .75-.75v-9a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0 0 1.5h7.19L6.22 16.72a.75.75 0 1 0 1.06 1.06L17.5 7.56v7.19c0 .414.336.75.75.75z"
        ></path>
      </svg>
    </a>
      </div>
    </div>` + `<hr / >`;
      counter++;
      pointer = pointer.next;
    }
    return returningValue;
  }
}

// </div>` + `${pointer.next !== null ? "<hr / >" : ""}`;
