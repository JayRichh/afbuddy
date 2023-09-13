import { Ref } from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Store } from 'vuex';
import state from './store/state';
import { editorConfig as baseEditorConfig } from './config';

export function createEditor(
  monacoContainer: Ref<HTMLElement | null>,
  editorInstance: Ref<monaco.editor.IStandaloneCodeEditor | null>,
  store: Store<typeof state>,
) {
  if (monacoContainer.value) {
    const code = `const f = n => n ? n * f(n - 1) : 1, 
fib = n => n < 2 ? n : fib(n - 1) + fib(n - 2),
p = num => { 
  for(let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++)
    if(num % i === 0) return false; 
  return num > 1;
},
primes = Array.from({length: 30}, (_, i) => i + 1).filter(p);
    `;

    try {
      const config: monaco.editor.IStandaloneEditorConstructionOptions = {
        ...baseEditorConfig,
        value: code,
        theme: store.state.monacoTheme,
      };

      console.log('config', config, 'editorInstance', editorInstance.value);

      if (!editorInstance.value) {
        editorInstance.value = monaco.editor.create(monacoContainer.value, config);
      }

      if (store.state.themeData && Object.keys(store.state.themeData).length > 0) {
        applyTheme(store.state.monacoTheme, store.state.themeData);
      }
    } catch (error) {
      console.error('error:', error);
    }
  }
}

export function applyTheme(theme: string, themeData: monaco.editor.IStandaloneThemeData) {
  try {
    if (Object.keys(themeData).length > 0) {
      monaco.editor.defineTheme(theme, themeData);
      monaco.editor.setTheme(theme);
    }
  } catch (error) {
    console.error('Error in applyTheme:', error);
  }
}

export const isValidJSON = (text: string): boolean => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

export const formatJSON = (editorInstance: Ref<monaco.editor.IStandaloneCodeEditor | null>) => {
  if (isValidJSON(editorInstance.value?.getValue() || '')) {
    editorInstance.value?.setValue(
      JSON.stringify(JSON.parse(editorInstance.value?.getValue() || ''), null, 2),
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
