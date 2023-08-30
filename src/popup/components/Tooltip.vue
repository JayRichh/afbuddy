```vue
<template>
  <div
    class="tooltip"
    v-if="showTooltip"
    :style="{
      top: tooltipY + 'px',
      left: tooltipX + 'px',
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
    <div v-else>{{ tooltipText }}</div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  watch,
  onBeforeUnmount,
  ref,
  toRefs,
  Prop,
  reactive,
} from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useStore, mapState } from 'vuex';

interface Props {
  themeData: monaco.editor.IStandaloneThemeData;
  theme: string;
  isCodeEditorPreview: boolean;
}

export default defineComponent({
  props: {
    themeData: {
      type: Object as () => monaco.editor.IStandaloneThemeData,
      default: () => ({}),
    },
    theme: { type: String, default: 'GitHub' },
    isCodeEditorPreview: { type: Boolean, default: false },
  },
  computed: {
    ...mapState([
      'tooltipText',
      'tooltipX',
      'tooltipY',
      'showTooltip',
      'theme',
      'themeData',
    ]),
  },
  setup(props: Props) {
    const store = useStore();
    const tooltipText = computed(() => store.state.tooltipText);
    const tooltipX = computed(() => store.state.tooltipX);
    const tooltipY = computed(() => store.state.tooltipY);
    const showTooltip = computed(() => store.state.showTooltip);
    const theme = computed(() => store.state.theme);
    const themeData = computed(() => store.state.themeData);

    const state = reactive({
      tooltipText,
      tooltipX,
      tooltipY,
      showTooltip,
      theme,
      themeData,
    });

    const monacoContainer = ref<HTMLElement | null>(null);
    const editorInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(
      null,
    );

    const tooltipSize = computed(() => {
      return props.isCodeEditorPreview ? '200px' : '100px';
    });

    const createEditor = () => {
      if (monacoContainer.value) {
        const config = {
          value: store.state.tooltipText,
          language: 'javascript',
          theme: store.state.themeData,
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

        editorInstance.value = monaco.editor.create(
          monacoContainer.value,
          config,
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
      if (store.state.showTooltip && props.isCodeEditorPreview) {
        createEditor();
      }
      if (store.state.tooltipText) {
        const navItem = document.querySelector(
          ".nav-item[data-tooltip='" + store.state.tooltipText + "']",
        );
        if (navItem) {
          navItem.textContent = store.state.tooltipText;
        }
      }
    });

    watch(
      () => store.state.showTooltip,
      (newVal) => {
        if (newVal && props.isCodeEditorPreview) {
          if (editorInstance.value) {
            editorInstance.value.setValue(store.state.tooltipText);
            applyTheme();
          } else {
            createEditor();
          }
        }
      },
    );

    watch(
      () => store.state.tooltipText,
      (newVal) => {
        if (newVal && editorInstance.value) {
          editorInstance.value.setValue(newVal);
        }
      },
    );

    watch(
      () => props.themeData,
      (newVal) => {
        if (newVal && Object.keys(newVal).length > 0 && editorInstance.value) {
          applyTheme();
        }
      },
    );

    return {
      ...toRefs(state),
      monacoContainer,
      editorInstance,
      tooltipText,
      tooltipX,
      tooltipY,
      showTooltip,
      theme,
      themeData,
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
  font-family: 'Montserrat', sans-serif;

  &::after {
    content: '';
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
