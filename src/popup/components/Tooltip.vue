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
  nextTick,
  Ref,
  onBeforeUnmount,
} from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export interface TooltipRefType {
  editorInstance: Ref<monaco.editor.IStandaloneCodeEditor | null>;
}

export interface IStandaloneThemeData {
  base: string;
  inherit: boolean;
  rules: monaco.editor.ITokenThemeRule[];
  colors: monaco.editor.IColors;
}

export default defineComponent({
  props: {
    content: {
      type: String,
      default: "",
    },
    themeData: {
      type: Object as () => monaco.editor.IStandaloneThemeData,
      required: false,
      default: () => ({}),
    },
    x: Number,
    y: Number,
    text: String,
    visible: Boolean,
    theme: {
      type: String,
      required: false,
      default: "",
    },
    isCodeEditorPreview: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const monacoContainer = ref<HTMLElement | null>(null);

    let editorInstance: Ref<monaco.editor.IStandaloneCodeEditor | null> = ref(
      null
    );

    onBeforeUnmount(() => {
      if (editorInstance.value) {
        editorInstance.value.dispose();
      }
    });

    onMounted(() => {
      if (props.visible) {
        if (props.isCodeEditorPreview && monacoContainer.value) {
          editorInstance.value = monaco.editor.create(monacoContainer.value, {
            value: props.content,
            language: "javascript",
            theme: props.theme,
            fontSize: 8,
            lineNumbers: "off",
          });

          // Apply the theme data if available
          if (Object.keys(props.themeData).length > 0) {
            monaco.editor.defineTheme(props.theme, props.themeData);
            monaco.editor.setTheme(props.theme); // Set theme after defining.
          }
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

          // Apply the theme data if available
          if (Object.keys(props.themeData).length > 0) {
            monaco.editor.defineTheme(props.theme, props.themeData);
            monaco.editor.setTheme(props.theme); // Set theme after defining.
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
