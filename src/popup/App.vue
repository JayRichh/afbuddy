<template>
  <div class="container" style="height: 100%; width: 100%">
    <Tooltip
      v-if="showTooltip"
      :x="tooltipX"
      :y="tooltipY"
      :content="tooltipText"
      :visible="showTooltip"
      :theme="theme"
      :themeData="themeData"
      :isCodeEditorPreview="isCodeEditorPreview"
    />
    <Navbar class="navbar-container" @changeComponent="handleComponentChange" ref="navbar" />
    <div class="app-container">
      <div class="app-header">
        <div class="title-icon-wrapper">
          <h1 class="title draggable no-tooltip">{{ $t(formattedTitle) }}</h1>
          <img
            ref="paintbrush"
            id="iconToChangeColor"
            class="paintbrush magnet"
            src="../../assets/icons/logo-bg-full.png"
            alt="Icon"
          />
        </div>
      </div>
      <component :is="currentComponent" class="app-content" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, provide, nextTick } from 'vue';
import { mapState, mapActions, mapMutations, useStore } from 'vuex';
import gsap from 'gsap';
import { ExpoScaleEase, RoughEase, SlowMo } from 'gsap/EasePack';
import Draggable from 'gsap/Draggable';
import {
  Navbar,
  ThemeSelector,
  Json,
  TabManager,
  CodeControls,
  Geolocation,
  UserAgents,
  Info,
  Tooltip,
  DoomPlayer,
} from './components';

import {
  setupDraggable,
  setupAnimations,
  listenForKonamiCode as konamiCodeListener,
  setupHoverEffects,
} from '../utils';

gsap.registerPlugin(ExpoScaleEase, RoughEase, SlowMo, Draggable);

export default defineComponent({
  components: {
    Navbar,
    ThemeSelector,
    Json,
    TabManager,
    CodeControls,
    Geolocation,
    UserAgents,
    Info,
    Tooltip,
    DoomPlayer,
  },
  computed: {
    ...mapState([
      'currentComponent',
      'tooltipText',
      'tooltipX',
      'tooltipY',
      'showTooltip',
      'crazyModeEnabled',
      'navItems',
      'theme',
      'themeData',
      'pidState',
      'isCodeEditorPreview',
    ]),
    formattedTitle() {
      const title = this.currentComponent;
      return title
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(' ', '\n');
    },
  },
  methods: {
    ...mapActions(['initializeStore']),
    ...mapMutations(['setCurrentComponent', 'setCrazyModeEnabled']),
  },
  setup() {
    const navbar = ref(null as any);
    const store = useStore();
    const iconMaskStyles = ref<Record<string, string>>({});
    let [firstIcon, popin, popout]: gsap.core.Timeline[] = [];
    const secret = '38384040373937396665';
    let input = '';
    provide('iconMaskStyles', iconMaskStyles);

    onMounted(async () => {
      konamiCodeListener(() => {
        // Activate Pixel Perfection
      });

      await store.dispatch('initializeStore');

      const animations = setupAnimations();
      const { tl, popin, popout, firstIcon } = animations;
      tl.play();
      gsap.utils.toArray('.masked-icon').forEach((mask: any, index: number) => {
        firstIcon.play();
        popin.play();
        popout.play();
      });

      nextTick(() => {
        setupHoverEffects(store, document.body as HTMLBodyElement);
        setupDraggable(store, iconMaskStyles);
      });
    });

    return {
      handleComponentChange: (componentName: string) => {
        store.dispatch('updateCurrentComponent', componentName);
      },
      store,
      iconMaskStyles,
      secret,
      input,
      firstIcon,
      popin,
      popout,
    };
  },
});
</script>

<style lang="scss">
@import './animation-keyframes.scss';

:root {
  --watercolour-gradient: linear-gradient(to right, #3f87a6, #ebf8e1, #f69c3c);
  --dark-gradient: linear-gradient(45deg, #061a34, #1b2e4a, #2d4160, #3f5476);
  --darkest-gradient: linear-gradient(240deg, #020a14, #0f1929, #172231, #283141);
  --light-gradient: linear-gradient(45deg, #f5a553, #f7b062, #f9bb71, #fbc680);
}

.underline-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  position: relative;
  box-sizing: border-box;
}

.underline {
  width: calc(2 * 50%);
  height: 60px;
}

.underline-path {
  stroke-dasharray: 20, 10;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.3s ease;
}

.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.container {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}

.sun-moon-container {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  transition: transform 0.5s;
}
.sun {
  transform: rotate(calc(90deg + var(--sun-rotation-deg))) translateX(80%);
}

.moon {
  transform: rotate(calc(90deg + var(--moon-rotation-deg))) translateX(80%);
}

.svg-line {
  stroke: url(#gradient);
}

.navbar-container {
  background: linear-gradient(to bottom, #1c1c1c, #454545);
  position: relative;
  box-sizing: border-box;
  width: 60px;
  height: 100%;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: auto;
  overflow-x: hidden;

  .app-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    min-height: 60px;
    height: 60px;
    flex: 1;
    top: 0;
    width: 100%;
    min-width: 100%;
    position: absolute;
  }
}

.title {
  padding-left: 0.75rem;
  padding-top: 0.1rem;
}

.title-icon-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  position: relative;
  box-sizing: border-box;
}

h1 {
  padding: 0;
  margin: 0;
  line-height: 1.2em;
  padding-bottom: 7.5px;
  white-space: pre-line;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 25px;
}

.paintbrush {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  opacity: 1;
  padding: 0.1rem 0.1rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.paintbrush:hover {
  cursor: grab;
}

.paintbrush:active {
  cursor: grabbing;
}
</style>
