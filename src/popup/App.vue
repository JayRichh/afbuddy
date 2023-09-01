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
          </div>
          <div class="svg-wrapper">
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
                d="M 0 100 L 1000 100"
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
      isDraggable: false,
      draggableElements: [],
    };
  },

  async created() {
    await this.$store.dispatch('initializeStore');
  },

  computed: {
    ...mapState([
      'tooltipText',
      'tooltipX',
      'tooltipY',
      'showTooltip',
      'crazyModeEnabled',
      'currentComponent',
      'navItems',
      'theme',
      'themeData',
    ]),
  },

  methods: {
    ...mapMutations([
      'setTooltipText',
      'setTooltipX',
      'setTooltipY',
      'setShowTooltip',
      'setCurrentComponent',
      'setCrazyModeEnabled',
    ]),
    handleComponentChange(componentName: string) {
      this.$store.commit('setCurrentComponent', componentName);
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

  async mounted() {
    this.listenForKonamiCode();
    const store = useStore();
    const tl = gsap.timeline({ smoothChildTiming: true, repeat: 0 });
    tl.fromTo(
      '.app-header',
      { y: '-100%' },
      { y: '0%', duration: 0.5, ease: 'power2.out' },
    )
      .fromTo(
        '.paintbrush',
        { x: '100%', y: '-100%', rotation: 360 },
        { x: '0%', y: '0%', rotation: 0, duration: 1, ease: 'power2.out' },
      )
      .to('.paintbrush', {
        rotation: 15,
        yoyo: true,
        repeat: 1,
        duration: 0.2,
        ease: 'power1.inOut',
      });

    gsap.utils.toArray('.icon-mask').forEach((mask: any, index: number) => {
      tl.fromTo(
        mask,
        { y: '200%', autoAlpha: 0 },
        {
          y: '0%',
          duration: 0.1 + index * 0.015,
          ease: 'bounce.out',
          autoAlpha: 0,
        },
        index * 0.015,
      ).to(mask, {
        y: '0%',
        duration: 0.2 + index * 0.015,
        ease: 'power2.out',
        autoAlpha: 1,
        blur: index * 5,
      });
    });

    const navbarContainer = document.querySelector('.navbar-container');
    if (navbarContainer instanceof HTMLElement) {
      const cutoffPoint = navbarContainer.offsetHeight * 0.25;
      window.addEventListener('scroll', () => {
        gsap.utils.toArray('.icon-mask').forEach((mask: any) => {
          if (mask.getBoundingClientRect().top < cutoffPoint) {
            tl.to(mask, {
              autoAlpha: 1,
              blur: 0,
            });
          } else {
            tl.to(mask, {
              autoAlpha: 0,
            });
          }
        });
      });
    }

    tl.pause();
    tl.resume();
    tl.seek(1.5);
    tl.reverse();
    tl.timeScale(2);
    tl.restart();

    const draggableClassElements = Array.from(
      document.querySelectorAll('.icon-container'),
    ).map((el) => el as HTMLElement);
    if (draggableClassElements.length > 0) {
      setupDraggable(draggableClassElements, this.$store);
    } else {
      console.error('No draggable elements found');
    }
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

.svg-line {
  stroke: url(#gradient);
}

:root {
  --watercolour-gradient: linear-gradient(to right, #3f87a6, #ebf8e1, #f69d3c);
}

.navbar-container {
  width: 40px;
  height: 100%;
  padding: 0;
  background: linear-gradient(to bottom, #1c1c1c, #454545);
  position: relative;
  z-index: 9999;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: calc(100% - 40px);

  position: relative;
  overflow: auto;
  overflow-x: hidden; //this might break things
  z-index: 0;

  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    max-height: 60px;
    flex: 1;
    z-index: 10002;
    background-color: transparent;
    position: relative;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    min-width: 100%;
    padding: 0.5rem;
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
    transform: scale(1.1); // Added for hover effect
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
  z-index: 1000001;
  cursor: pointer;
  scale: calc(1 + 0.1 * var(--speed));
  background-color: #0000;
  width: 100%;
  transition: stroke 0.3s;
  bottom: 0;
  left: 0;
  position: absolute;
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
