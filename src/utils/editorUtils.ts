import { Ref } from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const createEditor = (
  monacoContainer: Ref<HTMLElement | null>,
  editorInstance: Ref<monaco.editor.IStandaloneCodeEditor | null>,
  store: any,
) => {
  if (monacoContainer.value) {
    const config = {
      value: store.state.tooltipText,
      language: 'javascript',
      theme: store.state.theme,
      fontSize: 20,
      lineHeight: 30,
      lineNumbers: 'off',
      minimap: { enabled: false },
      overviewRulerLanes: 0,
      mouseWheelZoom: false,
      cursorStyle: 'line',
      cursorBlinking: 'blink',
      renderWhitespace: 'none',
      wordWrap: 'on',
      automaticLayout: true,
      folding: false,
      readOnly: true,
      lineDecorationsWidth: 0,
      scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden',
        useShadows: false,
      },
      glyphMargin: false,
      selectionHighlight: false,
    } as monaco.editor.IStandaloneEditorConstructionOptions;

    editorInstance.value = monaco.editor.create(monacoContainer.value, config);
  }
};

export const applyTheme = (
  theme: string,
  themeData: monaco.editor.IStandaloneThemeData,
) => {
  if (Object.keys(themeData).length > 0) {
    monaco.editor.defineTheme(theme, themeData);
    monaco.editor.setTheme(theme);
  }
};

export const isValidJSON = (text: string): boolean => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

export const formatJSON = (
  editorInstance: Ref<monaco.editor.IStandaloneCodeEditor | null>,
) => {
  if (isValidJSON(editorInstance.value?.getValue() || '')) {
    editorInstance.value?.setValue(
      JSON.stringify(
        JSON.parse(editorInstance.value?.getValue() || ''),
        null,
        2,
      ),
    );
  }
};

export const handlePaste = (
  event: ClipboardEvent,
  editorInstance: Ref<monaco.editor.IStandaloneCodeEditor | null>,
  autoFormat: boolean,
) => {
  if (autoFormat) {
    formatJSON(editorInstance);
  }
};

export const updateTooltipNavItem = (tooltipText: string) => {
  const navItem = document.querySelector(
    `.nav-item[data-tooltip='${tooltipText}']`,
  );
  if (navItem) {
    navItem.textContent = tooltipText;
  }
};
