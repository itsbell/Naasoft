import { BookmarkForm } from "./BookmarkForm.js";

const bookmarkForm = BookmarkForm.GetInstance();
bookmarkForm.Element.dispatchEvent(new Event("load"));