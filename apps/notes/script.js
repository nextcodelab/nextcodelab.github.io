/**
 * Notes App - Vanilla JavaScript Implementation
 */

(function () {
  "use strict";

  // --- Constants & Config ---
  const STORAGE_KEY = "notesAppData";
  const THEME_KEY = "notesTheme";
  const SAVE_DEBOUNCE_MS = 400;

  const DEFAULT_NOTE = {
    id: "welcome-note",
    title: "Welcome to Notes ✎",
    content: `Welcome to your clean, simple online notebook!

Here are a few quick tips to get started:

• Auto-Save: Everything you write is saved automatically to your browser's local storage.
• Shortcuts:
    - Ctrl/Cmd + N : Create a new note
    - Ctrl/Cmd + F : Focus search bar
    - Ctrl/Cmd + S : Instant save
    - Esc          : Close mobile menu
• Data Control: You can export all your notes as a JSON file or import them back anytime using the buttons at the bottom of the sidebar.
• Search: Type in the search box to filter your notes by title or body instantly.

Happy writing!`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // --- State Variables ---
  let notes = [];
  let activeNoteId = null;
  let searchTerm = "";
  let saveTimeout = null;

  // --- DOM Elements ---
  const elements = {
    html: document.documentElement,
    sidebar: document.getElementById("sidebar"),
    sidebarOverlay: document.getElementById("sidebar-overlay"),
    mobileMenuBtn: document.getElementById("mobile-menu-btn"),
    closeSidebarBtn: document.getElementById("close-sidebar-btn"),
    themeToggleBtn: document.getElementById("theme-toggle"),
    newNoteBtn: document.getElementById("new-note-btn"),
    emptyNewNoteBtn: document.getElementById("empty-new-note-btn"),
    searchInput: document.getElementById("search-input"),
    clearSearchBtn: document.getElementById("clear-search-btn"),
    notesList: document.getElementById("notes-list"),
    noSearchResults: document.getElementById("no-search-results"),
    exportBtn: document.getElementById("export-btn"),
    importInput: document.getElementById("import-input"),

    // Editor Elements
    saveStatus: document.getElementById("save-status"),
    deleteNoteBtn: document.getElementById("delete-note-btn"),
    editorWorkspace: document.getElementById("editor-workspace"),
    emptyWorkspace: document.getElementById("empty-workspace"),
    noteTitle: document.getElementById("note-title"),
    noteDate: document.getElementById("note-date"),
    noteStats: document.getElementById("note-stats"),
    noteContent: document.getElementById("note-content"),

    // Modal Elements
    deleteModal: document.getElementById("delete-modal"),
    cancelDeleteBtn: document.getElementById("cancel-delete-btn"),
    confirmDeleteBtn: document.getElementById("confirm-delete-btn"),
  };

  // --- Core Application Initialization ---
  function init() {
    initTheme();
    loadNotesFromStorage();

    // Select recent note or create default if empty
    if (notes.length === 0) {
      createNote(DEFAULT_NOTE.title, DEFAULT_NOTE.content);
    } else {
      sortNotesByModified();
      selectNote(notes[0].id);
    }

    renderSidebar();
    bindEvents();
  }

  // --- Storage Functions ---
  function loadNotesFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      notes = data ? JSON.parse(data) : [];
      if (!Array.isArray(notes)) notes = [];
    } catch (e) {
      console.error("Failed to parse notes from LocalStorage:", e);
      notes = [];
    }
  }

  function saveNotesToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setSaveStatus("saved");
    } catch (e) {
      console.error("Failed to save notes to LocalStorage:", e);
      alert("Storage full or unavailable. Unable to save changes.");
    }
  }

  // --- Theme Management ---
  function initTheme() {
    const savedTheme =
      localStorage.getItem(THEME_KEY) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(savedTheme);
  }

  function setTheme(theme) {
    elements.html.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const current = elements.html.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  }

  // --- Note Operations ---
  function createNote(title = "Untitled Note", content = "") {
    const now = new Date().toISOString();
    const newNote = {
      id: "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      title: title.trim(),
      content: content,
      createdAt: now,
      updatedAt: now,
    };

    notes.unshift(newNote);
    saveNotesToStorage();
    renderSidebar();
    selectNote(newNote.id);

    // Focus editor title for quick input
    elements.noteTitle.focus();
    elements.noteTitle.select();
  }

  function selectNote(id) {
    activeNoteId = id;
    const note = notes.find((n) => n.id === id);

    if (!note) {
      activeNoteId = null;
      renderEditor();
      renderSidebar();
      return;
    }

    renderEditor();
    renderSidebar();
    closeSidebarMobile();
  }

  function updateActiveNote() {
    if (!activeNoteId) return;

    const note = notes.find((n) => n.id === activeNoteId);
    if (!note) return;

    const newTitle = elements.noteTitle.value.trim() || "Untitled Note";
    const newContent = elements.noteContent.value;

    // Check if content actually changed
    if (note.title === newTitle && note.content === newContent) return;

    setSaveStatus("saving");

    note.title = newTitle;
    note.content = newContent;
    note.updatedAt = new Date().toISOString();

    // Debounced Auto-Save
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      sortNotesByModified();
      saveNotesToStorage();
      renderSidebar();
      updateMetaBar(note);
    }, SAVE_DEBOUNCE_MS);
  }

  function showDeleteConfirmation() {
    if (!activeNoteId) return;
    elements.deleteModal.classList.remove("hidden");
    elements.deleteModal.setAttribute("aria-hidden", "false");
  }

  function hideDeleteConfirmation() {
    elements.deleteModal.classList.add("hidden");
    elements.deleteModal.setAttribute("aria-hidden", "true");
  }

  function confirmDelete() {
    if (!activeNoteId) return;

    notes = notes.filter((n) => n.id !== activeNoteId);
    saveNotesToStorage();
    hideDeleteConfirmation();

    if (notes.length > 0) {
      sortNotesByModified();
      selectNote(notes[0].id);
    } else {
      activeNoteId = null;
      renderEditor();
      renderSidebar();
    }
  }

  // --- Rendering Functions ---
  function renderSidebar() {
    elements.notesList.innerHTML = "";

    const filteredNotes = notes.filter((note) => {
      const query = searchTerm.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    });

    if (filteredNotes.length === 0) {
      elements.noSearchResults.classList.remove("hidden");
    } else {
      elements.noSearchResults.classList.add("hidden");
    }

    filteredNotes.forEach((note) => {
      const item = document.createElement("div");
      item.className = `note-item ${note.id === activeNoteId ? "active" : ""}`;
      item.dataset.id = note.id;

      const previewText = note.content
        ? note.content.replace(/\n+/g, " ")
        : "Empty note...";

      item.innerHTML = `
        <div class="note-item-title">${escapeHTML(note.title || "Untitled Note")}</div>
        <div class="note-item-preview">${escapeHTML(previewText)}</div>
        <div class="note-item-date">${formatDate(note.updatedAt)}</div>
      `;

      item.addEventListener("click", () => selectNote(note.id));
      elements.notesList.appendChild(item);
    });
  }

  function renderEditor() {
    if (!activeNoteId) {
      elements.editorWorkspace.classList.add("hidden");
      elements.emptyWorkspace.classList.remove("hidden");
      elements.deleteNoteBtn.classList.add("hidden");
      elements.saveStatus.classList.add("hidden");
      return;
    }

    const note = notes.find((n) => n.id === activeNoteId);
    if (!note) return;

    elements.editorWorkspace.classList.remove("hidden");
    elements.emptyWorkspace.classList.add("hidden");
    elements.deleteNoteBtn.classList.remove("hidden");
    elements.saveStatus.classList.remove("hidden");

    elements.noteTitle.value = note.title;
    elements.noteContent.value = note.content;

    updateMetaBar(note);
  }

  function updateMetaBar(note) {
    elements.noteDate.textContent = `Modified ${formatDate(note.updatedAt)}`;

    // Calculate Word & Character Count
    const text = note.content.trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    const charCount = note.content.length;

    elements.noteStats.textContent = `${wordCount} ${wordCount === 1 ? "word" : "words"}, ${charCount} ${charCount === 1 ? "character" : "characters"}`;
  }

  function setSaveStatus(status) {
    if (status === "saving") {
      elements.saveStatus.classList.add("saving");
      elements.saveStatus.querySelector(".status-text").textContent =
        "Saving...";
    } else {
      elements.saveStatus.classList.remove("saving");
      elements.saveStatus.querySelector(".status-text").textContent = "Saved ✓";
    }
  }

  // --- Helper Utilities ---
  function sortNotesByModified() {
    notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  function formatDate(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 30) return "Just now";
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;

    // Same year check
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function escapeHTML(str) {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
  }

  // --- Mobile Drawer Controls ---
  function openSidebarMobile() {
    elements.sidebar.classList.add("open");
    elements.sidebarOverlay.classList.add("active");
  }

  function closeSidebarMobile() {
    elements.sidebar.classList.remove("open");
    elements.sidebarOverlay.classList.remove("active");
  }

  // --- Data Import & Export ---
  function exportNotes() {
    if (notes.length === 0) {
      alert("No notes to export.");
      return;
    }
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `notes_backup_${new Date().toISOString().slice(0, 10)}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function importNotes(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          // Valid structure check
          const validNotes = importedData.filter(
            (n) => n.id && n.title !== undefined && n.content !== undefined,
          );
          if (validNotes.length > 0) {
            notes = validNotes;
            saveNotesToStorage();
            sortNotesByModified();
            selectNote(notes[0].id);
            alert(`Successfully imported ${validNotes.length} notes.`);
          } else {
            alert("Invalid notes file format.");
          }
        } else {
          alert("Invalid file structure.");
        }
      } catch (err) {
        alert("Error parsing JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset input
  }

  // --- Event Listeners & Keyboard Shortcuts ---
  function bindEvents() {
    // Note Input Listeners
    elements.noteTitle.addEventListener("input", updateActiveNote);
    elements.noteContent.addEventListener("input", updateActiveNote);

    // Sidebar & Action Listeners
    elements.newNoteBtn.addEventListener("click", () => createNote());
    elements.emptyNewNoteBtn.addEventListener("click", () => createNote());
    elements.themeToggleBtn.addEventListener("click", toggleTheme);
    elements.deleteNoteBtn.addEventListener("click", showDeleteConfirmation);

    elements.cancelDeleteBtn.addEventListener("click", hideDeleteConfirmation);
    elements.confirmDeleteBtn.addEventListener("click", confirmDelete);

    // Mobile Navigation
    elements.mobileMenuBtn.addEventListener("click", openSidebarMobile);
    elements.closeSidebarBtn.addEventListener("click", closeSidebarMobile);
    elements.sidebarOverlay.addEventListener("click", closeSidebarMobile);

    // Search Box Listener
    elements.searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value;
      if (searchTerm) {
        elements.clearSearchBtn.classList.remove("hidden");
      } else {
        elements.clearSearchBtn.classList.add("hidden");
      }
      renderSidebar();
    });

    elements.clearSearchBtn.addEventListener("click", () => {
      elements.searchInput.value = "";
      searchTerm = "";
      elements.clearSearchBtn.classList.add("hidden");
      renderSidebar();
    });

    // Import / Export
    elements.exportBtn.addEventListener("click", exportNotes);
    elements.importInput.addEventListener("change", importNotes);

    // Keyboard Shortcuts
    document.addEventListener("keydown", (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Ctrl + N -> New Note
      if (isCmdOrCtrl && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createNote();
      }

      // Ctrl + S -> Save Instantly
      if (isCmdOrCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (activeNoteId) {
          clearTimeout(saveTimeout);
          saveNotesToStorage();
          renderSidebar();
        }
      }

      // Ctrl + F -> Focus Search
      if (isCmdOrCtrl && e.key.toLowerCase() === "f") {
        e.preventDefault();
        elements.searchInput.focus();
        elements.searchInput.select();
      }

      // Esc -> Close Mobile Sidebar or Modal
      if (e.key === "Escape") {
        closeSidebarMobile();
        hideDeleteConfirmation();
      }
    });
  }

  // --- Start App ---
  document.addEventListener("DOMContentLoaded", init);
})();
