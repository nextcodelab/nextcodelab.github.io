/**
 * Modern Browser Markdown Notes Application
 * Client-side persistence, real-time preview, toolbar engine, and full formatting.
 */

(function () {
  "use strict";

  // --- App State ---
  const STORAGE_KEY = "notes_app_data";
  let notes = [];
  let activeNoteId = null;
  let autoSaveTimer = null;

  // --- DOM Elements ---
  const sidebar = document.getElementById("sidebar");
  const btnToggleSidebar = document.getElementById("btn-toggle-sidebar");
  const btnNewNote = document.getElementById("btn-new-note");
  const searchInput = document.getElementById("search-input");
  const noteList = document.getElementById("note-list");
  const noteTitleInput = document.getElementById("note-title-input");
  const saveStatus = document.getElementById("save-status");

  const editorContainer = document.getElementById("editor-container");
  const markdownInput = document.getElementById("markdown-input");
  const markdownPreview = document.getElementById("markdown-preview");
  const mdToolbar = document.getElementById("md-toolbar");
  const headingSelect = document.getElementById("heading-select");

  // Stats Elements
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
  const fullMarkdownPreview = document.getElementById("full-markdown-preview");
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

  const dialogCode = document.getElementById("dialog-code");
  const codeLangSelect = document.getElementById("code-lang-select");
  const btnCancelCode = document.getElementById("btn-cancel-code");
  const btnConfirmCode = document.getElementById("btn-confirm-code");

  // --- Initialize App ---
  function init() {
    initTheme();
    configureMarkdownRenderer();
    loadNotesFromStorage();
    bindEvents();

    if (notes.length === 0) {
      createNote("Welcome to Markdown Notes", getSampleMarkdown());
    } else {
      selectNote(notes[0].id);
    }
  }

  // --- Markdown Parser Configuration ---
  function configureMarkdownRenderer() {
    if (window.marked) {
      marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true,
        highlight: function (code, lang) {
          if (window.hljs) {
            if (lang && hljs.getLanguage(lang)) {
              return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
          }
          return code;
        },
      });
    }
  }

  // Isolated safe rendering function
  function renderMarkdown(content) {
    let rawHtml = "";
    if (window.marked) {
      rawHtml = marked.parse(content || "");
    } else {
      rawHtml = content || "";
    }

    // Security Sanitization
    if (window.DOMPurify) {
      return DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ["target", "checked"],
      });
    }
    return rawHtml;
  }

  // --- LocalStorage & Notes Logic ---
  function loadNotesFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      notes = data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse notes from storage", e);
      notes = [];
    }
  }

  function saveNotesToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setSaveStatus("Saved ✓");
    } catch (e) {
      console.error("Failed to save to storage", e);
      setSaveStatus("Error saving");
    }
  }

  function createNote(title = "Untitled Note", content = "") {
    const newNote = {
      id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
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
    if (!confirm("Are you sure you want to delete this note?")) return;

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
    markdownInput.value = note.content;

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
        note.title = noteTitleInput.value.trim() || "Untitled Note";
        note.content = markdownInput.value;
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

      const dateStr = formatDate(note.updatedAt);

      item.innerHTML = `
        <div class="note-item-info">
          <div class="note-item-title">${escapeHtml(note.title)}</div>
          <div class="note-item-date">${dateStr}</div>
        </div>
        <button class="btn-delete-note" title="Delete Note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `;

      item.querySelector(".btn-delete-note").onclick = (e) =>
        deleteNote(note.id, e);
      noteList.appendChild(item);
    });
  }

  function updatePreviewAndStats() {
    const content = markdownInput.value;
    const html = renderMarkdown(content);

    markdownPreview.innerHTML = html;
    if (fullMarkdownPreview) {
      fullMarkdownPreview.innerHTML = html;
    }

    updateStats();
  }

  function updateStats() {
    const text = markdownInput.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
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

  // --- Toolbar Smart Markdown Insertion Engine ---
  function insertFormatting(
    prefix,
    suffix = "",
    defaultText = "",
    isBlock = false,
  ) {
    const input = markdownInput;
    input.focus();

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selectedText = input.value.substring(start, end);
    const replacementText = selectedText || defaultText;

    let insertion = "";
    let newCursorPos = start;

    if (isBlock) {
      // Ensure block starts on new line
      const needsPrefixNewline = start > 0 && input.value[start - 1] !== "\n";
      const needsSuffixNewline =
        end < input.value.length && input.value[end] !== "\n";

      const p = needsPrefixNewline ? "\n" : "";
      const s = needsSuffixNewline ? "\n" : "";

      insertion = `${p}${prefix}${replacementText}${suffix}${s}`;
      newCursorPos = start + p.length + prefix.length;
    } else {
      insertion = `${prefix}${replacementText}${suffix}`;
      newCursorPos = selectedText
        ? start + insertion.length
        : start + prefix.length;
    }

    // Execute standard edit command for smooth native undo/redo history
    if (!document.execCommand("insertText", false, insertion)) {
      // Fallback
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

  function applyHeading(level) {
    const prefixes = {
      h1: "# ",
      h2: "## ",
      h3: "### ",
      h4: "#### ",
      h5: "##### ",
      h6: "###### ",
    };
    if (prefixes[level]) {
      insertFormatting(prefixes[level], "", "Heading", true);
    }
  }

  function removeFormatting() {
    const input = markdownInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    let selectedText = input.value.substring(start, end);

    if (!selectedText) return;

    // Strip basic markdown syntax tags
    selectedText = selectedText.replace(/[*_~`#>-]/g, "");

    document.execCommand("insertText", false, selectedText);
    updatePreviewAndStats();
    triggerAutoSave();
  }

  // --- Toolbar Button Route Dispatcher ---
  function handleToolbarAction(action) {
    switch (action) {
      case "bold":
        insertFormatting("**", "**", "bold text");
        break;
      case "italic":
        insertFormatting("*", "*", "italic text");
        break;
      case "strikethrough":
        insertFormatting("~~", "~~", "strikethrough text");
        break;
      case "code-inline":
        insertFormatting("`", "`", "code");
        break;
      case "highlight":
        insertFormatting("<mark>", "</mark>", "highlighted text");
        break;
      case "remove-format":
        removeFormatting();
        break;
      case "list-ul":
        insertFormatting("- ", "", "List item", true);
        break;
      case "list-ol":
        insertFormatting("1. ", "", "List item", true);
        break;
      case "checklist":
        insertFormatting("- [ ] ", "", "Task item", true);
        break;
      case "quote":
        insertFormatting("> ", "", "Quote text", true);
        break;
      case "hr":
        insertFormatting("---\n", "", "", true);
        break;
      case "table":
        insertFormatting(
          "| Column 1 | Column 2 |\n| --- | --- |\n| Item 1 | Item 2 |",
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
      case "code-block":
        openCodeDialog();
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
    const selected = markdownInput.value.substring(
      markdownInput.selectionStart,
      markdownInput.selectionEnd,
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

  function openCodeDialog() {
    dialogCode.classList.remove("hidden");
  }

  function closeDialogs() {
    dialogLink.classList.add("hidden");
    dialogImage.classList.add("hidden");
    dialogCode.classList.add("hidden");
  }

  // --- Event Bindings ---
  function bindEvents() {
    // Sidebar & Title
    btnToggleSidebar.onclick = () => sidebar.classList.toggle("collapsed");
    btnNewNote.onclick = () => createNote();
    searchInput.oninput = (e) => renderNoteList(e.target.value);

    noteTitleInput.oninput = () => {
      const note = getActiveNote();
      if (note) {
        note.title = noteTitleInput.value;
      }
      triggerAutoSave();
    };

    // Editor & Textarea Input
    markdownInput.oninput = () => {
      updatePreviewAndStats();
      triggerAutoSave();
    };

    // Tab key inside textarea
    markdownInput.onkeydown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        insertFormatting("  ", "", "");
      }
    };

    // Toolbar Delegate
    mdToolbar.onclick = (e) => {
      const btn = e.target.closest("button");
      if (btn && btn.dataset.action) {
        handleToolbarAction(btn.dataset.action);
      }
    };

    headingSelect.onchange = (e) => {
      applyHeading(e.target.value);
      e.target.value = ""; // Reset select
    };

    // Dialog Confirmation Actions
    btnCancelLink.onclick = closeDialogs;
    btnConfirmLink.onclick = () => {
      const text = linkTextInput.value || "link";
      const url = linkUrlInput.value || "https://";
      insertFormatting(`[${text}](${url})`);
      closeDialogs();
    };

    btnCancelImage.onclick = closeDialogs;
    btnConfirmImage.onclick = () => {
      const alt = imageAltInput.value || "Image";
      let url = imageUrlInput.value;

      if (imageFileInput.files && imageFileInput.files[0]) {
        const file = imageFileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (evt) {
          insertFormatting(`![${alt}](${evt.target.result})`);
          closeDialogs();
        };
        reader.readAsDataURL(file);
        return;
      }

      if (url) {
        insertFormatting(`![${alt}](${url})`);
      }
      closeDialogs();
    };

    btnCancelCode.onclick = closeDialogs;
    btnConfirmCode.onclick = () => {
      const lang = codeLangSelect.value;
      insertFormatting(
        `\`\`\`${lang}\n`,
        "\n```",
        'console.log("Hello World!");',
        true,
      );
      closeDialogs();
    };

    // Fullscreen Preview Mode
    btnFullPreview.onclick = () => {
      fullPreviewModal.classList.remove("hidden");
    };
    btnCloseFullPreview.onclick = () => {
      fullPreviewModal.classList.add("hidden");
    };

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

    // Global Shortcuts
    window.onkeydown = (e) => {
      // Escape closes modals
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
        } else if (e.key === "k") {
          e.preventDefault();
          handleToolbarAction("link");
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

  // --- Utilities ---
  function formatDate(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
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

  function getSampleMarkdown() {
    return `# Welcome to Markdown Notes Studio

This is a modern real-time Markdown editor.

## Key Features
- **Dual-panel live preview**
- **Syntax Highlighting** for code blocks
- Auto-saves to your browser's \`localStorage\`
- Sanitized & safe rendering

---

### Interactive Examples

#### Task Checklist
- [x] Create a new note
- [ ] Try keyboard shortcuts (\`Ctrl + B\`, \`Ctrl + I\`, \`Ctrl + K\`)
- [ ] Open Full Preview mode (\`Ctrl + Shift + P\`)

#### Code Block Example
\`\`\`javascript
function calculateSum(a, b) {
  console.log("Calculating sum...");
  return a + b;
}
\`\`\`

#### Blockquote
> "Markdown is a lightweight markup language with plain text formatting syntax."

#### Basic Table
| Feature | Supported |
| --- | --- |
| Live Preview | Yes |
| Local Persistence | Yes |
| Custom Toolbar | Yes |
`;
  }

  // --- Theme State Management ---
  const THEME_STORAGE_KEY = "notes_app_theme";
  const btnToggleTheme = document.getElementById("btn-toggle-theme");

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

    // Toggle icon between Moon and Sun
    if (btnToggleTheme) {
      btnToggleTheme.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  
  // Add inside bindEvents()
  btnToggleTheme.onclick = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  };

  // Kickstart application on DOM ready
  document.addEventListener("DOMContentLoaded", init);
})();
