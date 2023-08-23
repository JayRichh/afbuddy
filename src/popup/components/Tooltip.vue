<template>
  <div
    class="tooltip"
    v-if="visible"
    :style="{
      top: y + 'px',
      left: x + 'px',
      overflow: 'hidden',
    }"
  >
    <div
      v-if="isCodeEditorPreview"
      class="code-preview"
      style="height: 100%; width: 100%"
    >
      <div
        ref="monacoContainer"
        class="monaco-instance"
        style="height: 100%; width: 100%"
      ></div>
    </div>
    <div v-else>{{ content }}</div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  watch,
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
      default: `// ding dong
        const a={b:{c:1}};
        function f(n){return n<2?n:f(n-1)+f(n-2);}
        function g(x){return x<1?1:x*g(x-1);}`,
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
      default: "GitHub",
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

    const tooltipSize = computed(() => {
      return props.isCodeEditorPreview ? "200px" : "100px";
    });

    const createEditor = () => {
      if (monacoContainer.value) {
        const config = {
          value: props.content,
          language: "javascript",
          theme: props.theme,
          fontSize: 20,
          lineHeight: 30,
          lineNumbers: "off",
          minimap: { enabled: false },
          overviewRulerLanes: 0,
          mouseWheelZoom: false,
          cursorStyle: "line",
          cursorBlinking: "blink",
          renderWhitespace: "none",
          wordWrap: "on",
          automaticLayout: true,
          folding: false,
          readOnly: true,
          lineDecorationsWidth: 0,
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
            useShadows: false,
          },
          glyphMargin: false,
          selectionHighlight: false,
        } as monaco.editor.IStandaloneEditorConstructionOptions;

        editorInstance.value = monaco.editor.create(
          monacoContainer.value,
          config
        );
        applyTheme();
      }
    };

    const applyTheme = () => {
      if (Object.keys(props.themeData).length > 0) {
        monaco.editor.defineTheme(props.theme, props.themeData);
        monaco.editor.setTheme(props.theme);
      }
    };

    onBeforeUnmount(() => {
      if (editorInstance.value) {
        editorInstance.value.dispose();
      }
    });

    onMounted(() => {
      if (props.visible && props.isCodeEditorPreview) {
        createEditor();
      }
    });

    watch(
      () => props.visible,
      (newVal) => {
        if (newVal && props.isCodeEditorPreview) {
          if (editorInstance.value) {
            editorInstance.value.setValue(props.content);
            applyTheme();
          } else {
            createEditor();
          }
        }
      }
    );

    watch(
      () => props.content,
      (newVal) => {
        if (newVal && editorInstance.value) {
          editorInstance.value.setValue(newVal);
        }
      }
    );

    watch(
      () => props.themeData,
      (newVal) => {
        if (newVal && Object.keys(newVal).length > 0 && editorInstance.value) {
          applyTheme();
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
  z-index: 20000 !important;
  background-color: #333;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  line-height: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: "Montserrat", sans-serif;

  &::after {
    content: "";
    position: absolute;
    border-width: 5px 5px 5px 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
    z-index: 20000 !important;
  }
}

.code-preview {
  width: 400px;
  height: 300px;
  position: relative;
  left: -200px;
  top: -150px;
}

.monaco-instance {
  width: 100%;
  height: 100%;
  font-size: 20px;
  line-height: 24px;
}
</style>
