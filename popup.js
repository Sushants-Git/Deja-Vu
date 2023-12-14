/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsMEJBQTBCLGFBQWE7QUFDdkMsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxhQUFhLHNDQUFzQztBQUNuRDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsUUFBUTs7QUFFUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQiw2Q0FBNkM7QUFDaEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLE9BQU8sR0FBRyxVQUFVO0FBQ25FO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovL2V4dGVuc2lvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9leHRlbnNpb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9leHRlbnNpb24vLi9zcmMvcG9wdXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImxldCB0YWdzRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhZ3NcIik7XG5jb25zdCB0YWdzSW5wdXRXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YWdzLWlucHV0LXdyYXBwZXJcIik7XG5jb25zdCBjcmVhdGVkVGFnc1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZWQtdGFncy13cmFwcGVyXCIpO1xuY29uc3QgZGVzY3JpYmVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVzY3JpYmVcIik7XG5jb25zdCBtYXJrSXRCdXR0b25FbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFyay1pdFwiKTtcbmNvbnN0IGdvVG9Cb29rbWFyayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm9va21hcmtcIik7XG5cbmxldCB0YWdzQXJyYXkgPSBbXTtcbmxldCBib29rbWFya3MgPSBbXTtcblxuLy8gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuY2xlYXIoKCkgPT4ge1xuLy8gICBjb25zb2xlLmxvZyhcImNsZWFyZWRcIik7XG4vLyB9KTtcblxudGFnc0VsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICBpZiAoZXZlbnQua2V5ID09PSBcIiBcIiAmJiB0YWdzRWwudmFsdWUudHJpbSgpICE9PSBcIlwiKSB7XG4gICAgYWRkVGFnKHRhZ3NFbC52YWx1ZSk7XG4gICAgY3JlYXRlZFRhZ3NXcmFwcGVyLnN0eWxlLm1hcmdpbkJvdHRvbSA9IFwiMTBweFwiO1xuICB9XG59KTtcblxuY3JlYXRlZFRhZ3NXcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZGF0YXNldC5pZDtcbiAgZGVsZXRlVGFnKGlkKTtcbn0pO1xuXG4vLyBnb1RvQm9va21hcmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbi8vICAgdmFyIG5ld1VSTCA9IFwiaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL1wiO1xuLy8gICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IG5ld1VSTCB9KTtcbi8vIH0pO1xuXG5tYXJrSXRCdXR0b25FbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgZnVuY3Rpb24gKCkge1xuICBhd2FpdCBnZXRDdXJyZW50VGFiKCkudGhlbihhc3luYyAodGFiKSA9PiB7XG4gICAgY29uc3QgdXJsID0gdGFiLnVybDtcbiAgICBjb25zdCB0aXRsZSA9IHRhYi50aXRsZTtcbiAgICBjb25zdCBzdHJUYWdzQXJyYXkgPSB0YWdzQXJyYXkubWFwKChvYmopID0+IG9iai52YWx1ZSk7XG4gICAgY29uc3QgZGVzY3JpYmUgPSBkZXNjcmliZUVsLnZhbHVlLnRyaW0oKTtcbiAgICBjb25zdCBmYXZJY29uVXJsID0gdGFiLmZhdkljb25Vcmw7XG5cbiAgICBsZXQgdmFsdWUgPSB7XG4gICAgICBpZDogZ2VuZXJhdGVDdXN0b21VVUlEKCksXG4gICAgICB1cmwsXG4gICAgICB0aXRsZSxcbiAgICAgIHN0clRhZ3NBcnJheSxcbiAgICAgIGRlc2NyaWJlLFxuICAgICAgZmF2SWNvblVybCxcbiAgICB9O1xuXG4gICAgYm9va21hcmtzLnB1c2godmFsdWUpO1xuXG4gICAgYm9va21hcmtzID0gYm9va21hcmtzLm1hcCgoYm9va21hcmspID0+ICh7XG4gICAgICAuLi5ib29rbWFyayxcbiAgICAgIHN0clRhZ3NBcnJheTogSlNPTi5zdHJpbmdpZnkoYm9va21hcmsuc3RyVGFnc0FycmF5KSxcbiAgICB9KSk7XG5cbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuICAgICAgLnNldCh7IGJvb2ttYXJrczogSlNPTi5zdHJpbmdpZnkoYm9va21hcmtzKSB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhbHVlIGlzIHNldFwiKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImJvb2ttYXJrc1wiXSkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhcIlZhbHVlIGN1cnJlbnRseSBpcyBcIiArIHJlc3VsdC5ib29rbWFya3MpO1xuICAgIC8vIH0pO1xuXG4gICAgdGFnc0FycmF5ID0gW107XG4gICAgZGVzY3JpYmVFbC52YWx1ZSA9IFwiXCI7XG4gICAgcmVuZGVyVGFncygpO1xuXG4gICAgbG9hZEJvb2ttYXJrcygpO1xuICB9KTtcbn0pO1xuXG5sb2FkQm9va21hcmtzKCk7XG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRCb29rbWFya3MoKSB7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJib29rbWFya3NcIl0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgIGlmICghcmVzdWx0LmJvb2ttYXJrcykgcmV0dXJuO1xuICAgIGxldCB0ZW1wID0gSlNPTi5wYXJzZShyZXN1bHQuYm9va21hcmtzKTtcbiAgICBpZiAodGVtcCkge1xuICAgICAgdGVtcCA9IHRlbXAubWFwKChib29rbWFyaykgPT4gKHtcbiAgICAgICAgLi4uYm9va21hcmssXG4gICAgICAgIHN0clRhZ3NBcnJheTogSlNPTi5wYXJzZShib29rbWFyay5zdHJUYWdzQXJyYXkpLFxuICAgICAgfSkpO1xuICAgICAgYm9va21hcmtzID0gdGVtcDtcbiAgICB9XG4gICAgY29uc29sZS5sb2codGVtcCk7XG4gIH0pO1xufVxuXG4vLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShib29rbWFya3MpKTtcblxuZnVuY3Rpb24gZGVsZXRlVGFnKGlkKSB7XG4gIGNvbnN0IHRlbXAgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWdzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGFnc0FycmF5W2ldLmlkICE9PSBpZCkge1xuICAgICAgdGVtcC5wdXNoKHRhZ3NBcnJheVtpXSk7XG4gICAgfVxuICB9XG4gIHRhZ3NBcnJheSA9IHRlbXA7XG4gIHJlbmRlclRhZ3MoKTtcbn1cblxuZnVuY3Rpb24gYWRkVGFnKHRhZykge1xuICB0YWdzQXJyYXkucHVzaCh7IGlkOiBnZW5lcmF0ZUN1c3RvbVVVSUQoKSwgdmFsdWU6IHRhZy50cmltKCkgfSk7XG4gIHJlbmRlclRhZ3MoKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyVGFncygpIHtcbiAgaWYgKHRhZ3NBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICBjcmVhdGVkVGFnc1dyYXBwZXIuc3R5bGUubWFyZ2luQm90dG9tID0gXCIwcHhcIjtcbiAgfVxuICBjcmVhdGVkVGFnc1dyYXBwZXIuaW5uZXJIVE1MID0gdGFnc0FycmF5XG4gICAgLm1hcCgodGFnKSA9PiBgPHNwYW4gY2xhc3M9XCJ0YWdcIiBkYXRhLWlkPSR7dGFnLmlkfT4ke3RhZy52YWx1ZX08L3NwYW4+YClcbiAgICAuam9pbihcIlwiKTtcbiAgdGFnc0VsLnZhbHVlID0gXCJcIjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudFRhYigpIHtcbiAgbGV0IHF1ZXJ5T3B0aW9ucyA9IHsgYWN0aXZlOiB0cnVlLCBsYXN0Rm9jdXNlZFdpbmRvdzogdHJ1ZSB9O1xuICBsZXQgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeShxdWVyeU9wdGlvbnMpO1xuICByZXR1cm4gdGFiO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUN1c3RvbVVVSUQoKSB7XG4gIHJldHVybiBcInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eFwiLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICBjb25zdCByID0gKE1hdGgucmFuZG9tKCkgKiAxNikgfCAwO1xuICAgIGNvbnN0IHYgPSBjID09PSBcInhcIiA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==