<template>
  <div>
    <input type="checkbox" v-model="autoFormat" />
    <div
      ref="monacoContainer"
      class="monaco-instance"
      style="height: 100%; width: 100%"
    ></div>
    <button @click="formatJSON">Format JSON</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export default defineComponent({
  setup() {
    const store = useStore();
    const json = ref('');
    const autoFormat = store.getters.autoFormat;
    const monacoContainer = ref<HTMLElement | null>(null);
    const editorInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(
      null,
    );

    const isValidJSON = (text: string): boolean => {
      try {
        JSON.parse(text);
        return true;
      } catch {
        return false;
      }
    };

    const formatJSON = () => {
      if (isValidJSON(json.value)) {
        json.value = JSON.stringify(JSON.parse(json.value), null, 2);
      }
    };

    const handlePaste = (event: ClipboardEvent) => {
      if (autoFormat) {
        formatJSON();
      }
    };

    const createEditor = () => {
      if (monacoContainer.value) {
        const config = {
          value: json.value,
          language: 'json',
          theme: store.getters.jsonViewerTheme,
          automaticLayout: true,
          readOnly: false,
        } as monaco.editor.IStandaloneEditorConstructionOptions;

        editorInstance.value = monaco.editor.create(
          monacoContainer.value,
          config,
        );
      }
    };

    onBeforeUnmount(() => {
      if (editorInstance.value) {
        editorInstance.value.dispose();
      }
    });

    onMounted(() => {
      createEditor();
    });

    watch(autoFormat, (newValue) => {
      if (newValue) {
        window.addEventListener('paste', handlePaste);
      } else {
        window.removeEventListener('paste', handlePaste);
      }
    });

    return {
      json,
      autoFormat,
      monacoContainer,
      editorInstance,
      formatJSON,
    };
  },
});
</script>

<style scoped lang="scss">
.modal-dialog {
  max-width: 80%;
  .modal-content {
    .modal-body {
      .monaco-editor {
        height: 80vh;
        width: 100%;
      }
    }
  }
}
</style>
