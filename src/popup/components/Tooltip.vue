<template>
  <div
    v-if="showTooltip"
    class="tooltip"
    :style="{ left: `${tooltipX}px`, top: `${tooltipY}px` }"
  >
    <div v-if="isCodeEditorPreview" class="code-preview" style="height: 100%; width: 100%">
      <div
        ref="monacoContainer"
        class="monaco-instance"
        style="height: 100%; width: 100%"
      ></div>
    </div>
    <span v-else>{{ tooltipText }}</span>
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
  Prop,
  Ref,
} from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useStore } from 'vuex';
import { createEditor, applyTheme } from '../../utils/editorUtils';

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
    theme: { type: String, default: 'github-dark' },
    isCodeEditorPreview: { type: Boolean, default: false },
  },
  setup(props: Props) {
    const store = useStore();
    const tooltipText = computed(() => store.state.tooltipText);
    const tooltipX = computed(() => store.state.tooltipX);
    const tooltipY = computed(() => store.state.tooltipY);
    const showTooltip = computed(() => store.state.showTooltip);
    const theme = computed(() => store.state.theme);
    const themeData = computed(() => store.state.themeData);

    const monacoContainer = ref<HTMLElement>();
    const editorInstance = ref<monaco.editor.IStandaloneCodeEditor>();

    onMounted(() => {
      if (props.isCodeEditorPreview && monacoContainer.value) {
        createEditor(
          monacoContainer as Ref<HTMLElement | null>,
          editorInstance as Ref<monaco.editor.IStandaloneCodeEditor | null>,
          store,
        );
        applyTheme(props.theme, props.themeData);
      }
    });

    onBeforeUnmount(() => {
      if (editorInstance.value) {
        editorInstance.value.dispose();
      }
    });

    watch(tooltipText, (newText) => {
      if (editorInstance.value) {
        editorInstance.value.setValue(newText);
      }
    });

    return {
      tooltipText,
      tooltipX,
      tooltipY,
      showTooltip,
      theme,
      themeData,
      monacoContainer,
      editorInstance,
    };
  },
});
</script>

<style scoped lang="scss">
.tooltip {
  position: absolute;
  z-index: 1;
  background-color: #333;
  color: #fff;
  padding: 1rem;
  border-radius: 0.3125rem;
  font-family: 'Roboto Slab', sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    border-width: 0.3125rem;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
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
