console.log("New updated version Runnign");

loadBookmarks();

let bookmarks = [];
let tagsArray = [];
let choosenBookmarks = bookmarks;
let choosenBookmarksListObj = null;
let counter = 0;

let describeEl = document.getElementById("options-describe");
let tagsEl = document.getElementById("options-tags");
const optionsCreatedTagsWrapper = document.getElementById(
  "options-created-tags-wrapper"
);

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
      choosenBookmarks = bookmarks;
    }
    renderTable();
    console.log(temp);
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
  if (tagsEl.value.trim() !== "") {
    describeEl.disabled = true;
  } else if (tagsEl.value.trim() === "") {
    describeEl.disabled = false;
  }

  if (event.key === " " && tagsEl.value.trim() !== "") {
    addTag(tagsEl.value);
    console.log("Works");
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
  if (describeEl.value.trim() === "" && tagsEl.value.trim() === "") {
    return;
  }
  if (describeEl.value.trim() === "") {
    searchByTags();
  } else {
    ask(describeEl.value);
  }
});

function ask(question) {
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
    console.log(message);
    console.log(response);
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
  console.log(temp);
}

function renderTable() {
  tableWrapper.innerHTML = choosenBookmarks
    .map((bookmark, index) => {
      return (
        `
    <div class="titles-content">
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
  </div>` + `${index !== choosenBookmarks.length - 1 ? "<hr / >" : ""}`
      );
    })
    .join("");
}

function renderList() {
  tableWrapper.innerHTML = choosenBookmarksListObj.renderList();
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
          return;
        }
        pointer = pointer.next;
      }
    }

    if (this.length > 10) {
      this.tail = this.tail.prev;
      this.tail.next = null;
      this.length -= 1;
    }
  }

  printList() {
    let pointer = this.head;
    while (pointer !== null) {
      console.log({ ...pointer });
      pointer = pointer.next;
    }
    console.log("EOL");
  }

  renderList() {
    let pointer = this.head;
    let returningValue = "";
    let counter = 0;
    while (pointer !== null) {
      let bookmark = pointer;
      returningValue +=
        `
      <div class="titles-content">
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
    </div>` + `${pointer.next !== null ? "<hr / >" : ""}`;
      counter++;
      pointer = pointer.next;
    }
    return returningValue;
  }
}
