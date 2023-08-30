```vue
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
    <Navbar
      class="navbar-container"
      :currentComponent="currentComponent"
      @changeComponent="handleComponentChange"
    />
    <div class="app-container">
      <div class="app-header">
        <div class="title-icon-wrapper">
          <div class="title-wrapper draggable magnetic" ref="titleWrapper">
            <span class="title">{{ $t(currentComponent) }}</span>
            <svg
              class="underline draggable magnetic"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 200"
              ref="underlineSVG"
            >
              <path
                class="underline-path"
                ref="underlinePath"
                stroke-width="10"
                stroke="url(#gradient)"
              ></path>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop
                    offset="0%"
                    style="stop-color: #7ed4e6; stop-opacity: 1"
                  />
                  <stop
                    offset="100%"
                    style="stop-color: #b493d3; stop-opacity: 1"
                  />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <img
            ref="paintbrush"
            id="iconToChangeColor"
            class="paintbrush draggable magnetic"
            src="../../assets/icons/logo-bg-full.png"
            alt="Icon"
          />
        </div>
      </div>
      <Component
        class="app-content draggable magnetic"
        :is="currentComponent"
        v-bind="$attrs"
        @changeComponent="handleComponentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, Component } from 'vue';
import Navbar from './components/Navbar.vue';
import ThemeSelector from './components/ThemeSelector.vue';
import TabManager from './components/TabManager.vue';
import CodeControls from './components/CodeControls.vue';
import Geolocation from './components/Geolocation.vue';
import UserAgents from './components/UserAgents.vue';
import Info from './components/Info.vue';
import Tooltip from './components/Tooltip.vue';
import DoomPlayer from './components/DoomPlayer.vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { NavItem, calculateRotation } from '../utils/config';
import { ExpoScaleEase, RoughEase, SlowMo } from 'gsap/EasePack';
import Draggable from 'gsap/Draggable';
import { gsap } from 'gsap';
import { setupDraggable } from '../utils/draggable';
import { mapState, mapMutations } from 'vuex';
import { useStore } from 'vuex';

gsap.registerPlugin(ExpoScaleEase, RoughEase, SlowMo, Draggable);

interface Data {
  currentComponent: string;
  scriptContentForTooltip: string;
  showTooltip: boolean;
  tooltipText: string;
  tooltipX: number;
  tooltipY: number;
  theme: string;
  themeData: monaco.editor.IStandaloneThemeData;
  isDraggable: boolean;
  draggableElements: Draggable[];
}

export default defineComponent({
  components: {
    Navbar,
    ThemeSelector,
    TabManager,
    CodeControls,
    Geolocation,
    UserAgents,
    Info,
    Tooltip,
    DoomPlayer,
  },
  data(): Data {
    return {
      currentComponent: 'ThemeSelector',
      scriptContentForTooltip: '',
      showTooltip: false,
      tooltipText: '',
      tooltipX: 0,
      tooltipY: 0,
      theme: 'GitHub',
      themeData: {} as monaco.editor.IStandaloneThemeData,
      isDraggable: false,
      draggableElements: [],
    };
  },
  created() {
    this.$store.dispatch('initializeStore');
  },
  computed: {
    ...mapState(['tooltipText', 'tooltipX', 'tooltipY', 'showTooltip']),
  },
  methods: {
    ...mapMutations([
      'setTooltipText',
      'setTooltipX',
      'setTooltipY',
      'setShowTooltip',
    ]),
    handleComponentChange(componentName: string) {
      this.currentComponent = componentName;
    },
    listenForKonamiCode() {
      let input = '';
      const secret = '38384040373937396665';
      window.addEventListener('keyup', (e: KeyboardEvent) => {
        input += '' + e.keyCode;
        if (input === secret) {
          this.activatePixelPerfection();
          input = '';
        }
      });
    },
    activatePixelPerfection() {},
  },
  mounted() {
    const store = useStore();
    this.listenForKonamiCode();
    const draggableElements = Array.from(
      document.querySelectorAll('.icon-container'),
    ) as HTMLElement[];
    this.draggableElements = setupDraggable(
      draggableElements,
      (event: MouseEvent, item: NavItem, element: HTMLElement) => {
        store.commit('setTooltipX', event.clientX);
        store.commit('setTooltipY', event.clientY);
        store.commit('setCurrentComponent', item.componentName);
      },
    );
  },
});
</script>

<style lang="scss">
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
  background-color: rgba(246, 248, 250, 0.9);
  z-index: 0;
}
.sun-moon-container {
  position: absolute;
  bottom: 50%;
  left: 50%;
  z-index: 9999;
  transform-origin: bottom;
  transition: transform 0.5s;
}
.sun {
  transform: rotate(calc(90deg + var(--sun-rotation-deg))) translateX(80%);
}

.moon {
  transform: rotate(calc(90deg + var(--moon-rotation-deg))) translateX(80%);
}

.navbar-container {
  width: 50px;
  height: 100%;
  padding: 0;
  background: linear-gradient(to bottom, #1c1c1c, #454545);
  position: relative;
  z-index: 9999;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: row;
  height: auto;
  width: calc(100% - 50px);
  left: 50px;
  top: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  overflow: auto;
  overflow-x: hidden; //this might break things

  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    max-height: 60px;
    flex: 1;
    z-index: 10002;
    background-color: transparent;
    position: absolute;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    min-width: 100%;
    padding: 0.5rem;
  }

  .app-content {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: center;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: transparent;
    position: relative;
    z-index: 0;
  }
}

.title-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.title-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.paintbrush {
  transform-origin: center;
  z-index: 10000;
  width: 64px;
  height: 64px;
  opacity: 1;
  margin: 0.4rem 0.5rem 0 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;

  &:hover {
    animation: rockBrush 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
    cursor: pointer;
    opacity: calc(0.8 + 0.2 * var(--speed));
  }

  &:active {
    animation: throwBrush 1s ease forwards;
    cursor: pointer;
  }

  &.spin {
    animation-play-state: running;
  }

  &.speedUp {
    animation: spinAndRubberBand 1s linear infinite;
  }
}

.title {
  letter-spacing: 0.075rem;
  color: #333;
  text-transform: uppercase;
  cursor: pointer;
  z-index: 10000;
  background-color: #0000;
  flex: 1;
  width: 100%;
  height: 2em;
  margin: 0;
  padding: 2.5rem 0 0.2rem;
  font: 700 1.2rem monospace;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  text-align: left;
  font-size: 20px;
}

.underline {
  z-index: 1;
  cursor: pointer;
  scale: calc(1 + 0.1 * var(--speed));
  background-color: #0000;
  width: 100%;
  transition: stroke 0.3s;
  position: relative;
  bottom: 0;
  left: 0;
}

.underline-path {
  fill: none;
  stroke-linecap: round;
}

// Animation Keyframes
@keyframes rockBrush {
  0% {
    transform: rotate(-5deg);
  }
  25% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes spinAndRubberBand {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
}

@keyframes throwBrush {
  0% {
    transform: translateY(0) scaleX(1) scaleY(1);
  }
  10% {
    transform: translateY(10px) scaleX(1) scaleY(1);
  }
  20% {
    transform: translateY(-10px) rotate(180deg) scaleX(1) scaleY(1);
  }
  60% {
    transform: translateY(0) rotate(360deg) scaleX(1) scaleY(1);
  }
  70%,
  80%,
  90% {
    transform: translateY(10px) rotate(360deg - 15deg) scaleX(1) scaleY(1);
  }
  75%,
  85% {
    transform: translateY(0) rotate(360deg + 15deg) scaleX(1) scaleY(1);
  }
  95% {
    transform: translateY(0) rotate(365deg) scaleX(1) scaleY(1);
  }
  100% {
    transform: translateY(0) rotate(360deg) scaleX(1) scaleY(1);
  }
}
</style>
