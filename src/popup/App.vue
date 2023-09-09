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
      :isCodeEditorPreview="!!theme"
    />
    <Navbar class="navbar-container" @changeComponent="handleComponentChange" />
    <div class="app-container">
      <div class="app-header">
        <div class="title-icon-wrapper">
          <h1 class="title draggable no-tooltip">{{ $t(formattedTitle) }}</h1>
          <img
            ref="paintbrush"
            id="iconToChangeColor"
            class="paintbrush draggable"
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
    const store = useStore();
    const iconMaskStyles = ref<Record<string, string>>({});
    let [firstIcon, popin, popout]: gsap.core.Timeline[] = [];
    const secret = '38384040373937396665';
    let input = '';
    provide('iconMaskStyles', iconMaskStyles);

    const listenForKonamiCode = () => {
      window.addEventListener('keyup', (e: KeyboardEvent) => {
        input += '' + e.keyCode;
        if (input === secret) {
          // Activate Pixel Perfection
          input = '';
        }
      });
    };

    onMounted(async () => {
      listenForKonamiCode();
      konamiCodeListener(() => {
        // Activate Pixel Perfection
      });

      await store.dispatch('initializeStore');

      const animations = setupAnimations();
      const { tl, popin, popout, firstIcon } = animations;
      tl.play();
      gsap.utils.toArray('.icon-mask').forEach((mask: any, index: number) => {
        if (index === 0) {
          firstIcon.play();
        } else {
          popin.play();
          popout.play();
        }
      });

      nextTick(() => {
        setupHoverEffects(store);
        setupDraggable(store, iconMaskStyles);
      });
    });

    return {
      handleComponentChange: (componentName: string) => {
        store.dispatch('updateCurrentComponent', componentName);
      },
      store,
      iconMaskStyles,
      listenForKonamiCode,
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

:root {
  --watercolour-gradient: linear-gradient(to right, #3f87a6, #ebf8e1, #f69d3c);
}

.navbar-container {
  width: 60px;
  height: 100%;
  padding: 0;
  background: linear-gradient(to bottom, #1c1c1c, #454545);
  position: relative;
  box-sizing: border-box;
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
  padding-left: 0.25rem;
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
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
  font-family: 'Raleway', sans-serif;
  font-weight: 400;
  color: #080808;
  transition: all 0.4s ease;
  -webkit-transition: all 0.4s ease;
  letter-spacing: 0.8px;
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
  cursor: pointer;
}

.paintbrush:active {
  cursor: pointer;
}
</style>
