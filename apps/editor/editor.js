let monacoInstance = null;

function initMonacoEditor() {
  require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs",
    },
  });

  require(["vs/editor/editor.main"], function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const container = document.getElementById("source-panel");

    // Clear old textarea
    container.innerHTML = "";

    monacoInstance = monaco.editor.create(container, {
      value: getActiveNote()?.content || "",
      language: "html",
      theme: currentTheme === "dark" ? "vs-dark" : "vs",
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: "on",
      wordWrap: "on",
    });

    // Listen for edits
    monacoInstance.onDidChangeModelContent(() => {
      updatePreviewAndStats();
      triggerAutoSave();
    });
  });
}

// Update Theme Toggle for Monaco
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (window.monaco && monacoInstance) {
    monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs");
  }
}
