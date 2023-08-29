<template>
  <div class="container" :style="sunMoonStyles" style="height: 100%; width: 100%">
    <div class="sun-moon-container">
      <div v-if="displaySun" class="sun">
        <img src="../../assets/sun.svg" alt="Sun" />
      </div>
      <div v-if="displayMoon" class="moon">
        <img src="../../assets/moon.svg" alt="Moon" />
      </div>
    </div>

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

    <div
      class="navbar-wrapper navbar-container"
      @mouseover="handleMouseOver"
      @mousemove="adjustTooltipPosition"
      @mouseout="handleMouseOut"
      :draggable="isDraggable"
    >
      <Navbar
        @changeComponent="handleComponentChange"
        :currentComponent="currentComponent"
        @updateTooltipText="updateTooltipText"
        @mouseout="handleMouseOut"
      />
    </div>

    <div class="app-container">
      <div class="app-header">
        <div class="title-icon-wrapper">
          <div
            class="title-wrapper"
            ref="titleWrapper"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            @click="handleTitleClick"
          >
            <span class="title">{{ $t(formatTitle(currentComponent)) }}</span>
            <svg
              class="underline"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 200"
              ref="underlineRef"
            >
              <path
                class="underline-path"
                ref="underlinePath"
                stroke-width="10"
                stroke="url(#gradient)"
              ></path>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color: #7ed4e6; stop-opacity: 1" />
                  <stop offset="100%" style="stop-color: #b493d3; stop-opacity: 1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <img
            ref="paintbrushRef"
            id="iconToChangeColor"
            class="paintbrush"
            :class="{ spin: spinBrush, speedUp: speedUpBrush }"
            src="../../assets/icons/logo-bg-full.png"
            alt="Icon"
            @click="handleBrushClick"
          />
        </div>
      </div>
      <component
        class="app-content"
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
import { calculateDistance, calculateRotation } from '../utils/calculationUtils';
import { TimelineMax, Power2, Elastic } from 'gsap';
import { ExpoScaleEase, RoughEase, SlowMo } from 'gsap/EasePack';
import Draggable from 'gsap/Draggable';
import { gsap } from 'gsap';

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
  sunRotation: number;
  moonRotation: number;
  isDraggable: boolean;
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
  props: {
    currentTheme: {
      type: String,
      default: 'active4d',
    },
  },
  setup(props) {
    const paintbrushRef = ref<HTMLElement | null>(null);
    const underlineRef = ref<HTMLElement | null>(null);
    const navbarIconsRef = ref<HTMLElement | null>(null);
    const checkboxRef = ref<HTMLElement | null>(null);
    const tooltipContent = ref('');
    const themesArray = ref([]);
    const themeNamesArray = ref([]);
    const themeList = ref([]);
    const selectedThemeKey = ref(props.currentTheme || 'active4d');
    const showTooltip = ref(false);
    const theme = ref('');
    const themeData = ref({} as monaco.editor.IStandaloneThemeData);
    const isDraggable = ref(false);
    const currentComponent = ref('ThemeSelector');
    const tooltipX = ref(0);
    const tooltipY = ref(0);
    const originalPositions = ref<{ [key: string]: { x: number; y: number } }>({});

    gsap.registerPlugin(Draggable);


    const setupDraggable = (element: HTMLElement | null, id: string) => {
      if (!element) return;

      originalPositions.value[id] = { x: element.offsetLeft, y: element.offsetTop };

      Draggable.create(element, {
        type: 'x,y',
        bounds: 'body',
        edgeResistance: 0.65,
        zIndexBoost: false,
        onDragStart() {
          // Implement PID controller logic to magnetize element to mouse here
        },
        onDragEnd() {
          const distance = calculateDistance(
            this.x - originalPositions.value[id].x,
            this.y - originalPositions.value[id].y,
            0,
            0
          );

          if (distance > 20) {
            gsap.to(this.target, {
              x: originalPositions.value[id].x,
              y: originalPositions.value[id].y,
              duration: 0.5,
              ease: 'power1.out',
            });
          } else {
            originalPositions.value[id] = { x: this.x, y: this.y };
          }
        },
      });
    };

    const handleTooltip = (event: MouseEvent, content: string) => {
      tooltipX.value = event.clientX;
      tooltipY.value = event.clientY;
      tooltipContent.value = content;
    };

    onMounted(async () => {
      const themes = await getThemes();
      themesArray.value = themes.themesArray;
      themeNamesArray.value = themes.themeNamesArray;
      themeList.value = themes.themeList;
      console.log('mounted themeselector');

      setupDraggable(paintbrushRef.value, 'paintbrush');
      setupDraggable(underlineRef.value, 'underline');
      setupDraggable(navbarIconsRef.value, 'navbarIcons');
      setupDraggable(checkboxRef.value, 'checkbox');

      if (!props.currentTheme) {
        setDefaultTheme();
      }
    });

    return {
      paintbrushRef,
      underlineRef,
      navbarIconsRef,
      checkboxRef,
      tooltipX,
      tooltipY,
      tooltipContent,
      themesArray,
      themeNamesArray,
      themeList,
      selectedThemeKey,
      handleTooltip,
    };
  },

  data(): Data {
    return {
      currentComponent: 'ThemeSelector',
      showTooltip: false,
      theme: '',
      themeData: {} as monaco.editor.IStandaloneThemeData,
      isDraggable: false,
    };
  },
  computed: {
    sunMoonStyles(): Record<string, string> {
      return {
        '--sun-rotation-deg': `${this.sunRotation}deg`,
        '--moon-rotation-deg': `${this.moonRotation}deg`,
      };
    },
    displaySun(): boolean {
      const now = new Date();
      return now.getUTCHours() >= 6 && now.getUTCHours() < 18;
    },
    displayMoon(): boolean {
      const now = new Date();
      const hours = now.getUTCHours();
      return hours < 6 || hours >= 18;
    },
  },
  mounted() {
    this.listenForKonamiCode();
    const rotationData = calculateRotation();
    this.sunRotation = rotationData.sunRotation;
    this.moonRotation = rotationData.moonRotation;
  },
  watch: {
    sunRotation() {
      this.rotateSunOrMoon();
    },
    moonRotation() {
      this.rotateSunOrMoon();
    },
  },
  methods: {
    const updateTooltipText = (newText: string) => {
      showTooltip.value = true;
      tooltipX.value = 100; 
      tooltipY.value = 100; 
    };
    rotateSunOrMoon() {
      const { sunRotation, moonRotation } = calculateRotation();
      this.sunRotation = sunRotation;
      this.moonRotation = moonRotation;
    },
    const handleMouseOver = (event: MouseEvent) => {
      tooltipX.value = event.clientX;
      tooltipY.value = event.clientY;
      showTooltip.value = true;
    };

    handleComponentChange(componentName: string) {
      this.currentComponent = componentName;
      this.titleText = '';
      this.typeWriterEffect(this.$t(this.formatTitle(componentName)), 0);
    },
    typeWriterEffect(text: string, index: number) {
      if (index < text.length) {
        const letter = text.charAt(index);
        const spanId = `letter-${index}`;
        this.titleText += `<span id="${spanId}">${letter}</span>`;
        gsap.fromTo(`#${spanId}`, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.2 });
        setTimeout(() => this.typeWriterEffect(text, index + 1), 100); // adjust delay as needed
      }
    },
    formatTitle(componentName: string) {
      return componentName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
    },
    showScriptTooltip(data: any) {
      this.scriptContentForTooltip = data.content;
      this.tooltipX = data.x;
      this.tooltipY = data.y;
      this.showTooltip = true;
    },
    hideScriptTooltip() {
      this.showTooltip = false;
    },
    loadScriptIntoEditor(content: string) {
      console.log('content:', content);
      this.$emit('loadScriptIntoEditor', content);
    },
    showThemeTooltip(data: any) {
      this.tooltipX = data.x;
      this.tooltipY = data.y;
      this.theme = data.theme;
      this.themeData = data.themeData;
      this.showTooltip = true;
    },
    adjustThemeTooltipPosition(data: any) {
      this.tooltipX = data.x;
      this.tooltipY = data.y;
    },
    hideThemeTooltip() {
      this.showTooltip = false;
    },
    adjustTooltipPosition(event: MouseEvent) {
      const navbar = document.querySelector('.navbar-container') as HTMLElement;
      const navbarRect = navbar.getBoundingClientRect();
      const navbarX = navbarRect.left;
      const navbarY = navbarRect.top;

      this.tooltipX = event.pageX - navbarX + 10;
      this.tooltipY = event.pageY - navbarY + 10;

      const checkbox = document.querySelector(
        '.crazy-mode-checkbox',
      ) as HTMLInputElement;
      if (checkbox && checkbox.checked) {
        this.tooltipY += 30;
      }
    },
    handleMouseOut() {
      this.showTooltip = false;
      this.isDraggable = false;
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
});
</script>

<style scoped lang="scss">
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
