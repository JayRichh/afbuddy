<template>
  <div>
    <div id="two" class="button" @click="showModal = !showModal">Open Editor</div>
    <div v-if="showModal" class="modal draggable two">
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
        <input type="checkbox" v-model="autoFormat" class="draggable" /> Auto Format
        <button @click="formatJSON" class="draggable">Format JSON</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue';
import { useStore } from 'vuex';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
export default defineComponent({
  setup() {
    const store = useStore();
    const json = computed(() => store.state.json);
    const showModal = ref(false);
    const autoFormat = computed(() => store.state.autoFormat);
    const monacoContainer = computed(() => store.state.monacoContainer);
    const editorInstance = computed(() => store.state.editorInstance);

    const formatJSON = () => {
      store.dispatch('formatJSON', json.value);
    };

    const handlePaste = (event: ClipboardEvent) => {
      if (autoFormat.value) {
        store.dispatch('formatJSON', json.value);
      }
    };

    const createEditor = () => {
      store.dispatch('createEditor', {
        monacoContainer: monacoContainer.value,
        editorInstance: editorInstance.value,
        json: json.value,
      });
    };

    onMounted(() => {
      createEditor();
    });

    return {
      json,
      showModal,
      autoFormat,
      monacoContainer,
      editorInstance,
      formatJSON,
      handlePaste,
      createEditor,
    };
  },
});
</script>

<style scoped lang="scss">
#two {
  position: fixed;
  display: table;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  transform: scale(0);
  z-index: 1;
  &.two {
    transform: scale(1);
    .modal-background {
      background: rgba(0, 0, 0, 0);
      animation: fadeIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      .modal {
        opacity: 0;
        animation: scaleUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      }
    }
    &.out {
      animation: quickScaleDown 0s 0.5s linear forwards;
      .modal-background {
        animation: fadeOut 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        .modal {
          animation: scaleDown 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      }
    }
  }
}
.modal {
  position: fixed;
  z-index: 1000;
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
.icon-container {
  z-index: 1004;
}
.crazy-mode-toggle {
  z-index: 1005;
  position: fixed;
  right: 10px;
  top: 10px;
}
</style>
