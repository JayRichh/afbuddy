<template>
  <div ref="tooltipRef" class="tooltip" :style="{ left: `${tooltipX}px`, top: `${tooltipY}px` }">
    <div v-if="isCodeEditorPreview" class="code-preview">
      <div ref="monacoContainerRef" class="monaco-instance"></div>
    </div>
    <span v-else>{{ tooltipText }}</span>
  </div>
</template>

<script lang="ts">
import { gsap } from 'gsap';
import { defineComponent, computed, onMounted, ref, watch, Ref } from 'vue';
import { useStore } from 'vuex';
import { createEditor, applyTheme } from '../../utils/editorUtils';
import { Sine } from 'gsap';

gsap.registerPlugin(Sine);

export default defineComponent({
  props: {
    themeData: { type: Object as () => monaco.editor.IStandaloneThemeData, default: () => ({}) },
    theme: { type: String, default: 'github-dark' },
    isCodeEditorPreview: { type: Boolean, default: false },
  },
  setup(props) {
    const store = useStore();
    const tooltipRef = ref(null);
    let timeoutId: ReturnType<typeof setTimeout>;

    const tooltipText = computed(() => store.state.tooltipText);
    const tooltipX = computed(() => store.state.tooltipX);
    const tooltipY = computed(() => store.state.tooltipY);
    const showTooltip = computed(() => store.state.showTooltip);
    const isCodeEditorPreview = computed(() => store.state.isCodeEditorPreview);

    const monacoContainerRef: Ref<HTMLDivElement | null> = ref(null);

    const initializeEditor = () => {
      if (props.isCodeEditorPreview && monacoContainerRef.value) {
        // createEditor(monacoContainerRef, store);
        applyTheme(props.theme, props.themeData);
      }
    };

    const animateTooltip = (show: boolean) => {
      if (tooltipRef.value) {
        gsap.to(tooltipRef.value, {
          duration: 0.2,
          opacity: show ? 1 : 0,
          ease: Sine.easeInOut,
          y: show ? 0 : 20,
        });
      }
    };

    let debounceTimeoutId: ReturnType<typeof setTimeout>;
    watch(
      () => showTooltip.value,
      (newVal, oldVal) => {
        clearTimeout(debounceTimeoutId);
        debounceTimeoutId = setTimeout(() => {
          if (newVal && !oldVal) {
            animateTooltip(true);
            initializeEditor();
          } else if (!newVal && oldVal) {
            animateTooltip(false);
          }
        }, 300);
      },
      { immediate: true },
    );

    onMounted(() => {
      initializeEditor();
      animateTooltip(showTooltip.value);
    });

    return {
      tooltipText,
      tooltipX,
      tooltipY,
      monacoContainerRef,
      isCodeEditorPreview,
      tooltipRef,
    };
  },
});
</script>

<style scoped lang="scss">
.tooltip {
  position: absolute;
  z-index: 999;
  background-color: #2d2d2d;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.3125rem;
  font-family: 'Roboto Slab', sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  filter: drop-shadow(0 0 0.25rem #000);
  pointer-events: auto;
  opacity: 0;
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
