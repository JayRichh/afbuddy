<template>
  <div
    class="tooltip"
    v-if="visible"
    :style="{ top: y + 'px', left: x + 'px' }"
  >
    <div v-if="isCodeEditorPreview" class="code-preview">
      <div ref="monacoContainer" class="monaco-instance"></div>
    </div>
    <div v-else>{{ content }}</div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  Ref,
  onBeforeUnmount,
} from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

interface Props {
  content: string;
  themeData: monaco.editor.IStandaloneThemeData;
  x: number;
  y: number;
  visible: boolean;
  theme: string;
  isCodeEditorPreview: boolean;
}

export default defineComponent({
  props: {
    content: {
      type: String,
      default: "",
    },
    themeData: {
      type: Object as () => monaco.editor.IStandaloneThemeData,
      default: () => ({}),
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    theme: {
      type: String,
      default: "vs-dark", // Defaulting to a known Monaco theme
    },
    isCodeEditorPreview: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props) {
    const monacoContainer = ref<HTMLElement | null>(null);
    const editorInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(
      null
    );

    onBeforeUnmount(() => {
      if (editorInstance.value) {
        editorInstance.value.dispose();
      }
    });

    onMounted(() => {
      if (props.visible && props.isCodeEditorPreview && monacoContainer.value) {
        if (editorInstance.value) {
          editorInstance.value.setValue(props.content);
        } else {
          editorInstance.value = monaco.editor.create(monacoContainer.value, {
            value: props.content,
            language: "javascript",
            theme: props.theme,
            fontSize: 8,
            lineNumbers: "off",
          });
        }

        if (Object.keys(props.themeData).length > 0) {
          monaco.editor.defineTheme(props.theme, props.themeData);
          monaco.editor.setTheme(props.theme);
        }
      }
    });

    watch(
      () => props.visible,
      (newVal) => {
        if (newVal && props.isCodeEditorPreview && monacoContainer.value) {
          editorInstance.value = monaco.editor.create(monacoContainer.value, {
            value: props.content,
            language: "javascript",
            theme: props.theme,
            fontSize: 8,
            lineNumbers: "off",
          });

          if (Object.keys(props.themeData).length > 0) {
            monaco.editor.defineTheme(props.theme, props.themeData);
            monaco.editor.setTheme(props.theme);
          }
        }
      }
    );

    return {
      monacoContainer,
      editorInstance,
    };
  },
});
</script>

<style scoped lang="scss">
.tooltip {
  position: absolute;
  z-index: 9999;

  padding: 5px;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  max-width: 300px;

  &::after {
    content: "";
    position: absolute;
    left: 5px;
    top: -5px;
    border-width: 0 5px 5px 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
  }
}

.code-preview {
  width: 400px;
  height: 200px;
}

.monaco-instance {
  width: 100%;
  height: 100%;
}
</style>
