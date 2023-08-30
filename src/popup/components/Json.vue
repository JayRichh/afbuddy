<template>
  <div>
    <button @click="showModal = true" class="draggable">Open Editor</button>
    <div v-if="showModal" class="modal draggable">
      <div class="modal-header">
        <h5 class="modal-title">JSON Editor</h5>
        <button type="button" class="close" @click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div
          ref="monacoContainer"
          class="monaco-instance draggable"
          style="height: 100%; width: 100%"
        ></div>
      </div>
      <div class="modal-footer">
        <input type="checkbox" v-model="autoFormat" class="draggable" /> Auto
        Format
        <button @click="formatJSON" class="draggable">Format JSON</button>
      </div>
    </div>
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
    const showModal = ref(false);
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
      showModal,
      autoFormat,
      monacoContainer,
      editorInstance,
      formatJSON,
    };
  },
});
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  z-index: 1000;
  width: 80%;
  height: 80%;
}
.draggable {
  cursor: move;
  z-index: 1001;
}
.modal-header,
.modal-footer {
  z-index: 1002;
}

.modal-dialog {
  max-width: 80%;
  z-index: 1002;
  .modal-content {
    .modal-body {
      .monaco-editor {
        height: 80vh;
        width: 100%;
        z-index: 1003;
      }
    }
  }
}
.icon-container,
.crazy-mode-toggle {
  z-index: 1004;
}
</style>
