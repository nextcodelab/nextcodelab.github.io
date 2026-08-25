/**
 * Modern HTML Notes & Real-time Studio
 * Features: Client-side storage, real-time safe HTML rendering, theme mode, and tag engine.
 */

(function () {
  "use strict";

  // App State & Keys
  const STORAGE_KEY = "html_notes_app_data";
  const THEME_STORAGE_KEY = "html_notes_app_theme";
  let notes = [];
  let activeNoteId = null;
  let autoSaveTimer = null;

  // DOM Elements
  const sidebar = document.getElementById("sidebar");
  const btnToggleSidebar = document.getElementById("btn-toggle-sidebar");
  const btnToggleTheme = document.getElementById("btn-toggle-theme");
  const btnNewNote = document.getElementById("btn-new-note");
  const searchInput = document.getElementById("search-input");
  const noteList = document.getElementById("note-list");
  const noteTitleInput = document.getElementById("note-title-input");
  const saveStatus = document.getElementById("save-status");

  const editorContainer = document.getElementById("editor-container");
  const htmlInput = document.getElementById("html-input");
  const htmlPreview = document.getElementById("html-preview");
  const htmlToolbar = document.getElementById("html-toolbar");
  const headingSelect = document.getElementById("heading-select");

  // Stats
  const statWords = document.getElementById("stat-words");
  const statChars = document.getElementById("stat-chars");
  const statLines = document.getElementById("stat-lines");
  const statModified = document.getElementById("stat-modified");

  // Mobile Views
  const btnShowEdit = document.getElementById("btn-show-edit");
  const btnShowPreview = document.getElementById("btn-show-preview");

  // Fullscreen Preview
  const btnFullPreview = document.getElementById("btn-full-preview");
  const fullPreviewModal = document.getElementById("full-preview-modal");
  const fullHtmlPreview = document.getElementById("full-html-preview");
  const btnCloseFullPreview = document.getElementById("btn-close-full-preview");

  // Dialogs
  const dialogLink = document.getElementById("dialog-link");
  const linkTextInput = document.getElementById("link-text-input");
  const linkUrlInput = document.getElementById("link-url-input");
  const btnCancelLink = document.getElementById("btn-cancel-link");
  const btnConfirmLink = document.getElementById("btn-confirm-link");

  const dialogImage = document.getElementById("dialog-image");
  const imageAltInput = document.getElementById("image-alt-input");
  const imageUrlInput = document.getElementById("image-url-input");
  const imageFileInput = document.getElementById("image-file-input");
  const btnCancelImage = document.getElementById("btn-cancel-image");
  const btnConfirmImage = document.getElementById("btn-confirm-image");

  // --- Initialize App ---
  function init() {
    initTheme();
    loadNotesFromStorage();
    bindEvents();

    if (notes.length === 0) {
      createNote("Welcome to HTML Editor Studio", getSampleHTML());
    } else {
      selectNote(notes[0].id);
    }
    initMonacoEditor();
  }

  // --- Theme Mode Logic ---
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    applyTheme(initialTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (btnToggleTheme) {
      btnToggleTheme.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  // Safe HTML Render
  function renderHTMLContent(content) {
    if (window.DOMPurify) {
      return DOMPurify.sanitize(content || "", {
        ADD_ATTR: ["target", "style", "class"],
      });
    }
    return content || "";
  }

  // --- LocalStorage & Notes Management ---
  function loadNotesFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      notes = data ? JSON.parse(data) : [];
    } catch (e) {
      notes = [];
    }
  }

  function saveNotesToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setSaveStatus("Saved ✓");
    } catch (e) {
      setSaveStatus("Error saving");
    }
  }

  function createNote(title = "Untitled HTML", content = "") {
    const newNote = {
      id: "doc_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      title: title,
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.unshift(newNote);
    saveNotesToStorage();
    renderNoteList();
    selectNote(newNote.id);
  }

  function deleteNote(id, event) {
    if (event) event.stopPropagation();
    if (!confirm("Are you sure you want to delete this document?")) return;

    notes = notes.filter((n) => n.id !== id);
    saveNotesToStorage();
    renderNoteList();

    if (activeNoteId === id) {
      if (notes.length > 0) {
        selectNote(notes[0].id);
      } else {
        createNote();
      }
    }
  }

  function selectNote(id) {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    activeNoteId = id;
    noteTitleInput.value = note.title;
    htmlInput.value = note.content;

    renderNoteList();
    updatePreviewAndStats();
  }

  function getActiveNote() {
    return notes.find((n) => n.id === activeNoteId);
  }

  function triggerAutoSave() {
    setSaveStatus("Saving...");
    clearTimeout(autoSaveTimer);

    autoSaveTimer = setTimeout(() => {
      const note = getActiveNote();
      if (note) {
        note.title = noteTitleInput.value.trim() || "Untitled Document";
        note.content = htmlInput.value;
        note.updatedAt = new Date().toISOString();

        saveNotesToStorage();
        renderNoteList();
        updateStats();
      }
    }, 400);
  }

  function setSaveStatus(text) {
    saveStatus.textContent = text;
  }

  // --- UI Render Helpers ---
  function renderNoteList(filterQuery = "") {
    noteList.innerHTML = "";
    const filtered = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(filterQuery.toLowerCase()),
    );

    filtered.forEach((note) => {
      const item = document.createElement("div");
      item.className = `note-item ${note.id === activeNoteId ? "active" : ""}`;
      item.onclick = () => selectNote(note.id);

      item.innerHTML = `
        <div class="note-item-info">
          <div class="note-item-title">${escapeHtml(note.title)}</div>
          <div class="note-item-date">${formatDate(note.updatedAt)}</div>
        </div>
        <button class="btn-delete-note" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `;

      item.querySelector(".btn-delete-note").onclick = (e) =>
        deleteNote(note.id, e);
      noteList.appendChild(item);
    });
  }

  function updatePreviewAndStats() {
    const content = htmlInput.value;
    const sanitized = renderHTMLContent(content);

    htmlPreview.innerHTML = sanitized;
    if (fullHtmlPreview) {
      fullHtmlPreview.innerHTML = sanitized;
    }

    updateStats();
  }

  function updateStats() {
    const text = htmlInput.value;
    const words = text
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const chars = text.length;
    const lines = text ? text.split("\n").length : 0;

    statWords.textContent = words;
    statChars.textContent = chars;
    statLines.textContent = lines;

    const note = getActiveNote();
    if (note) {
      statModified.textContent = "Last updated: " + formatDate(note.updatedAt);
    }
  }

  // --- Smart HTML Tag Insertion Engine ---
  function insertTag(
    openTag,
    closeTag = "",
    defaultText = "",
    isBlock = false,
  ) {
    const input = htmlInput;
    input.focus();

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selectedText = input.value.substring(start, end);
    const textToWrap = selectedText || defaultText;

    let insertion = "";
    let newCursorPos = start;

    if (isBlock) {
      const needsPrefixNewline = start > 0 && input.value[start - 1] !== "\n";
      const needsSuffixNewline =
        end < input.value.length && input.value[end] !== "\n";

      const p = needsPrefixNewline ? "\n" : "";
      const s = needsSuffixNewline ? "\n" : "";

      insertion = `${p}${openTag}${textToWrap}${closeTag}${s}`;
      newCursorPos = start + p.length + openTag.length;
    } else {
      insertion = `${openTag}${textToWrap}${closeTag}`;
      newCursorPos = selectedText
        ? start + insertion.length
        : start + openTag.length;
    }

    if (!document.execCommand("insertText", false, insertion)) {
      input.value =
        input.value.substring(0, start) +
        insertion +
        input.value.substring(end);
    }

    if (!selectedText) {
      input.setSelectionRange(newCursorPos, newCursorPos);
    } else {
      input.setSelectionRange(start, start + insertion.length);
    }

    updatePreviewAndStats();
    triggerAutoSave();
  }

  // --- Toolbar Action Dispatcher ---
  function handleToolbarAction(action) {
    switch (action) {
      case "bold":
        insertTag("<b>", "</b>", "bold text");
        break;
      case "italic":
        insertTag("<i>", "</i>", "italic text");
        break;
      case "underline":
        insertTag("<u>", "</u>", "underlined text");
        break;
      case "strikethrough":
        insertTag("<s>", "</s>", "strikethrough text");
        break;
      case "code":
        insertTag("<code>", "</code>", "code block");
        break;
      case "mark":
        insertTag("<mark>", "</mark>", "highlighted text");
        break;
      case "p":
        insertTag("<p>", "</p>", "Paragraph text goes here...", true);
        break;
      case "div":
        insertTag(
          '<div class="container">\n  ',
          "\n</div>",
          "Content inside div",
          true,
        );
        break;
      case "span":
        insertTag("<span>", "</span>", "span text");
        break;
      case "blockquote":
        insertTag("<blockquote>", "</blockquote>", "Quote text...", true);
        break;
      case "ul":
        insertTag(
          "<ul>\n  <li>",
          "</li>\n  <li>Second item</li>\n</ul>",
          "First item",
          true,
        );
        break;
      case "ol":
        insertTag(
          "<ol>\n  <li>",
          "</li>\n  <li>Second item</li>\n</ol>",
          "First item",
          true,
        );
        break;
      case "li":
        insertTag("<li>", "</li>", "List item");
        break;
      case "button":
        insertTag('<button type="button">', "</button>", "Click Me");
        break;
      case "hr":
        insertTag("<hr>\n", "", "", true);
        break;
      case "br":
        insertTag("<br>\n", "", "", false);
        break;
      case "table":
        insertTag(
          '<table border="1">\n  <thead>\n    <tr><th>Header 1</th><th>Header 2</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Data 1</td><td>Data 2</td></tr>\n  </tbody>\n</table>',
          "",
          "",
          true,
        );
        break;
      case "link":
        openLinkDialog();
        break;
      case "image":
        openImageDialog();
        break;
      case "undo":
        document.execCommand("undo");
        updatePreviewAndStats();
        break;
      case "redo":
        document.execCommand("redo");
        updatePreviewAndStats();
        break;
    }
  }

  // --- Dialog Handlers ---
  function openLinkDialog() {
    const selected = htmlInput.value.substring(
      htmlInput.selectionStart,
      htmlInput.selectionEnd,
    );
    linkTextInput.value = selected || "";
    linkUrlInput.value = "";
    dialogLink.classList.remove("hidden");
    linkTextInput.focus();
  }

  function openImageDialog() {
    imageAltInput.value = "";
    imageUrlInput.value = "";
    imageFileInput.value = "";
    dialogImage.classList.remove("hidden");
    imageAltInput.focus();
  }

  function closeDialogs() {
    dialogLink.classList.add("hidden");
    dialogImage.classList.add("hidden");
  }

  // --- Event Bindings ---
  function bindEvents() {
    btnToggleSidebar.onclick = () => sidebar.classList.toggle("collapsed");
    btnToggleTheme.onclick = () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    };
    btnNewNote.onclick = () => createNote();
    searchInput.oninput = (e) => renderNoteList(e.target.value);

    noteTitleInput.oninput = () => {
      const note = getActiveNote();
      if (note) note.title = noteTitleInput.value;
      triggerAutoSave();
    };

    htmlInput.oninput = () => {
      updatePreviewAndStats();
      triggerAutoSave();
    };

    htmlInput.onkeydown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        insertTag("  ", "", "");
      }
    };

    htmlToolbar.onclick = (e) => {
      const btn = e.target.closest("button");
      if (btn && btn.dataset.action) handleToolbarAction(btn.dataset.action);
    };

    headingSelect.onchange = (e) => {
      const tag = e.target.value;
      if (tag) {
        insertTag(
          `<${tag}>`,
          `</${tag}>`,
          `Heading ${tag.toUpperCase()}`,
          true,
        );
        e.target.value = "";
      }
    };

    // Dialog Confirmations
    btnCancelLink.onclick = closeDialogs;
    btnConfirmLink.onclick = () => {
      const text = linkTextInput.value || "Link";
      const url = linkUrlInput.value || "https://";
      insertTag(`<a href="${url}" target="_blank">`, "</a>", text);
      closeDialogs();
    };

    btnCancelImage.onclick = closeDialogs;
    btnConfirmImage.onclick = () => {
      const alt = imageAltInput.value || "Image";
      let url = imageUrlInput.value;

      if (imageFileInput.files && imageFileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          insertTag(`<img src="${evt.target.result}" alt="${alt}">`);
          closeDialogs();
        };
        reader.readAsDataURL(imageFileInput.files[0]);
        return;
      }

      if (url) insertTag(`<img src="${url}" alt="${alt}">`);
      closeDialogs();
    };

    // Fullscreen Preview
    btnFullPreview.onclick = () => fullPreviewModal.classList.remove("hidden");
    btnCloseFullPreview.onclick = () =>
      fullPreviewModal.classList.add("hidden");

    // Mobile View Toggle
    btnShowEdit.onclick = () => {
      editorContainer.classList.remove("show-preview");
      editorContainer.classList.add("show-editor");
      btnShowEdit.classList.add("active");
      btnShowPreview.classList.remove("active");
    };

    btnShowPreview.onclick = () => {
      editorContainer.classList.remove("show-editor");
      editorContainer.classList.add("show-preview");
      btnShowPreview.classList.add("active");
      btnShowEdit.classList.remove("active");
    };

    // Shortcuts
    window.onkeydown = (e) => {
      if (e.key === "Escape") {
        fullPreviewModal.classList.add("hidden");
        closeDialogs();
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === "s") {
          e.preventDefault();
          saveNotesToStorage();
        } else if (e.key === "b") {
          e.preventDefault();
          handleToolbarAction("bold");
        } else if (e.key === "i") {
          e.preventDefault();
          handleToolbarAction("italic");
        } else if (e.key === "u") {
          e.preventDefault();
          handleToolbarAction("underline");
        } else if (e.shiftKey && (e.key === "P" || e.key === "p")) {
          e.preventDefault();
          fullPreviewModal.classList.remove("hidden");
        } else if (e.key === "m") {
          e.preventDefault();
          createNote();
        }
      }
    };
  }

  function formatDate(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function escapeHtml(str) {
    return (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function getSampleHTML() {
    return `<h1>HTML Studio Notebook</h1>
<p>This is a real-time <b>HTML Source Editor</b> with instant safe rendering.</p>

<hr>

<h2>Quick Examples</h2>

<p>Highlight important details using <mark>mark tags</mark> or inline <code>code elements</code>.</p>

<blockquote>
  "HTML is the standard markup language for Web pages."
</blockquote>

<h3>Task Checklist</h3>
<ul>
  <li><b>Step 1:</b> Write raw HTML in the left editor</li>
  <li><b>Step 2:</b> Watch real-time rendering on the right</li>
  <li><b>Step 3:</b> Toggle Night Light Mode with the 🌙 button</li>
</ul>

<button type="button">Interactive Button</button>`;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
