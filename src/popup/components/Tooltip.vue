<template>
  <div
    v-if="showTooltip"
    class="tooltip"
    :style="{ left: `${tooltipX}px`, top: `${tooltipY}px` }"
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
  Prop,
} from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useStore } from 'vuex';
import { updateTooltipNavItem } from '../../utils/editorUtils';

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
  setup(props: Props) {
    const store = useStore();
    const tooltipText = computed(() => store.state.tooltipText);
    const tooltipX = computed(() => store.state.tooltipX);
    const tooltipY = computed(() => store.state.tooltipY);
    const showTooltip = computed(() => store.state.showTooltip);
    const theme = computed(() => store.state.theme);
    const themeData = computed(() => store.state.themeData);
    const monacoContainer = ref<HTMLElement | null>(null);
    const editorInstance = ref(
      null as monaco.editor.IStandaloneCodeEditor | null,
    );

    const initializeEditor = () => {
      if (!monacoContainer.value || !editorInstance.value) {
        console.error('Monaco container or editor instance is not set');
        return;
      }
      store.dispatch('createEditor', {
        monacoContainer: monacoContainer.value,
        editorInstance: editorInstance.value,
      });
    };

    const applyThemeToEditor = () => {
      if (editorInstance.value) {
        editorInstance.value.setValue(store.state.tooltipText);
        store.dispatch('applyTheme', {
          theme: props.theme,
          themeData: props.themeData,
        });
      } else {
        store.dispatch('createEditor', { monacoContainer, editorInstance });
      }
    };

    onMounted(() => {
      if (showTooltip.value && props.isCodeEditorPreview) {
        initializeEditor();
      }
      updateTooltipNavItem(store.state.tooltipText);
    });

    watch(
      () => showTooltip.value,
      (newVal) => {
        if (newVal && props.isCodeEditorPreview) {
          applyThemeToEditor();
        }
      },
    );

    onBeforeUnmount(() => {
      if (editorInstance.value) {
        editorInstance.value.dispose();
      }
    });

    watch(
      () => tooltipText.value,
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
          store.dispatch('applyTheme', {
            theme: props.theme,
            themeData: props.themeData,
          });
        }
      },
    );

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
