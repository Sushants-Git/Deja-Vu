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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsMEJBQTBCLGFBQWE7QUFDdkMsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsYUFBYSxzQ0FBc0M7QUFDbkQ7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBLFFBQVE7O0FBRVI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixzQkFBc0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsNkNBQTZDO0FBQ2hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxPQUFPLEdBQUcsVUFBVTtBQUNuRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leHRlbnNpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZXh0ZW5zaW9uLy4vc3JjL3BvcHVwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJsZXQgdGFnc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YWdzXCIpO1xuY29uc3QgdGFnc0lucHV0V3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFncy1pbnB1dC13cmFwcGVyXCIpO1xuY29uc3QgY3JlYXRlZFRhZ3NXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVkLXRhZ3Mtd3JhcHBlclwiKTtcbmNvbnN0IGRlc2NyaWJlRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlc2NyaWJlXCIpO1xuY29uc3QgbWFya0l0QnV0dG9uRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcmstaXRcIik7XG5jb25zdCBnb1RvQm9va21hcmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvb2ttYXJrXCIpO1xuXG5sZXQgdGFnc0FycmF5ID0gW107XG5sZXQgYm9va21hcmtzID0gW107XG5cbi8vIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmNsZWFyKCgpID0+IHtcbi8vICAgY29uc29sZS5sb2coXCJjbGVhcmVkXCIpO1xuLy8gfSk7XG5cbnRhZ3NFbC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgaWYgKGV2ZW50LmtleSA9PT0gXCIgXCIgJiYgdGFnc0VsLnZhbHVlLnRyaW0oKSAhPT0gXCJcIikge1xuICAgIGFkZFRhZyh0YWdzRWwudmFsdWUpO1xuICAgIGNyZWF0ZWRUYWdzV3JhcHBlci5zdHlsZS5tYXJnaW5Cb3R0b20gPSBcIjEwcHhcIjtcbiAgfVxufSk7XG5cbmNyZWF0ZWRUYWdzV3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGNvbnN0IGlkID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQuaWQ7XG4gIGRlbGV0ZVRhZyhpZCk7XG59KTtcblxuLy8gZ29Ub0Jvb2ttYXJrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4vLyAgIHZhciBuZXdVUkwgPSBcImh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9cIjtcbi8vICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBuZXdVUkwgfSk7XG4vLyB9KTtcblxubWFya0l0QnV0dG9uRWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgYXdhaXQgZ2V0Q3VycmVudFRhYigpLnRoZW4oYXN5bmMgKHRhYikgPT4ge1xuICAgIGNvbnN0IHVybCA9IHRhYi51cmw7XG4gICAgY29uc3QgdGl0bGUgPSB0YWIudGl0bGU7XG4gICAgY29uc3Qgc3RyVGFnc0FycmF5ID0gdGFnc0FycmF5Lm1hcCgob2JqKSA9PiBvYmoudmFsdWUpO1xuICAgIGNvbnN0IGRlc2NyaWJlID0gZGVzY3JpYmVFbC52YWx1ZS50cmltKCk7XG4gICAgY29uc3QgZmF2SWNvblVybCA9IHRhYi5mYXZJY29uVXJsO1xuXG4gICAgbGV0IHZhbHVlID0ge1xuICAgICAgdXJsLFxuICAgICAgdGl0bGUsXG4gICAgICBzdHJUYWdzQXJyYXksXG4gICAgICBkZXNjcmliZSxcbiAgICAgIGZhdkljb25VcmwsXG4gICAgfTtcblxuICAgIGJvb2ttYXJrcy5wdXNoKHZhbHVlKTtcblxuICAgIGJvb2ttYXJrcyA9IGJvb2ttYXJrcy5tYXAoKGJvb2ttYXJrKSA9PiAoe1xuICAgICAgLi4uYm9va21hcmssXG4gICAgICBzdHJUYWdzQXJyYXk6IEpTT04uc3RyaW5naWZ5KGJvb2ttYXJrLnN0clRhZ3NBcnJheSksXG4gICAgfSkpO1xuXG4gICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWxcbiAgICAgIC5zZXQoeyBib29rbWFya3M6IEpTT04uc3RyaW5naWZ5KGJvb2ttYXJrcykgfSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYWx1ZSBpcyBzZXRcIik7XG4gICAgICB9KTtcblxuICAgIC8vIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJib29rbWFya3NcIl0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2coXCJWYWx1ZSBjdXJyZW50bHkgaXMgXCIgKyByZXN1bHQuYm9va21hcmtzKTtcbiAgICAvLyB9KTtcblxuICAgIHRhZ3NBcnJheSA9IFtdO1xuICAgIGRlc2NyaWJlRWwudmFsdWUgPSBcIlwiO1xuICAgIHJlbmRlclRhZ3MoKTtcblxuICAgIGxvYWRCb29rbWFya3MoKTtcbiAgfSk7XG59KTtcblxubG9hZEJvb2ttYXJrcygpO1xuXG5hc3luYyBmdW5jdGlvbiBsb2FkQm9va21hcmtzKCkge1xuICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1wiYm9va21hcmtzXCJdKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICBpZiAoIXJlc3VsdC5ib29rbWFya3MpIHJldHVybjtcbiAgICBsZXQgdGVtcCA9IEpTT04ucGFyc2UocmVzdWx0LmJvb2ttYXJrcyk7XG4gICAgaWYgKHRlbXApIHtcbiAgICAgIHRlbXAgPSB0ZW1wLm1hcCgoYm9va21hcmspID0+ICh7XG4gICAgICAgIC4uLmJvb2ttYXJrLFxuICAgICAgICBzdHJUYWdzQXJyYXk6IEpTT04ucGFyc2UoYm9va21hcmsuc3RyVGFnc0FycmF5KSxcbiAgICAgIH0pKTtcbiAgICAgIGJvb2ttYXJrcyA9IHRlbXA7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHRlbXApO1xuICB9KTtcbn1cblxuLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYm9va21hcmtzKSk7XG5cbmZ1bmN0aW9uIGRlbGV0ZVRhZyhpZCkge1xuICBjb25zdCB0ZW1wID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGFnc0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRhZ3NBcnJheVtpXS5pZCAhPT0gaWQpIHtcbiAgICAgIHRlbXAucHVzaCh0YWdzQXJyYXlbaV0pO1xuICAgIH1cbiAgfVxuICB0YWdzQXJyYXkgPSB0ZW1wO1xuICByZW5kZXJUYWdzKCk7XG59XG5cbmZ1bmN0aW9uIGFkZFRhZyh0YWcpIHtcbiAgdGFnc0FycmF5LnB1c2goeyBpZDogZ2VuZXJhdGVDdXN0b21VVUlEKCksIHZhbHVlOiB0YWcudHJpbSgpIH0pO1xuICByZW5kZXJUYWdzKCk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclRhZ3MoKSB7XG4gIGlmICh0YWdzQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgY3JlYXRlZFRhZ3NXcmFwcGVyLnN0eWxlLm1hcmdpbkJvdHRvbSA9IFwiMHB4XCI7XG4gIH1cbiAgY3JlYXRlZFRhZ3NXcmFwcGVyLmlubmVySFRNTCA9IHRhZ3NBcnJheVxuICAgIC5tYXAoKHRhZykgPT4gYDxzcGFuIGNsYXNzPVwidGFnXCIgZGF0YS1pZD0ke3RhZy5pZH0+JHt0YWcudmFsdWV9PC9zcGFuPmApXG4gICAgLmpvaW4oXCJcIik7XG4gIHRhZ3NFbC52YWx1ZSA9IFwiXCI7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRUYWIoKSB7XG4gIGxldCBxdWVyeU9wdGlvbnMgPSB7IGFjdGl2ZTogdHJ1ZSwgbGFzdEZvY3VzZWRXaW5kb3c6IHRydWUgfTtcbiAgbGV0IFt0YWJdID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkocXVlcnlPcHRpb25zKTtcbiAgcmV0dXJuIHRhYjtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVDdXN0b21VVUlEKCkge1xuICByZXR1cm4gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgY29uc3QgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMDtcbiAgICBjb25zdCB2ID0gYyA9PT0gXCJ4XCIgPyByIDogKHIgJiAweDMpIHwgMHg4O1xuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=