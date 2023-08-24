<template>
  <div class="container" :style="sunMoonStyles" style="height: 100%; width: 100%;">

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
      @mouseout="handleIconMouseOut"
    >
      <Navbar
        @changeComponent="handleComponentChange"
        :currentComponent="currentComponent"
        @updateTooltipText="updateTooltipText"
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
            <span class="title">{{ formatTitle(currentComponent) }}</span>
            <svg
              class="underline"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 100"
              ref="underlineSVG"
            >
              <path class="underline-path" ref="underlinePath"></path>
            </svg>
          </div>
          <img
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
        class="app-content "
        :is="currentComponent"
        v-bind="$attrs"
        @changeComponent="handleComponentChange"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import Navbar from "./components/Navbar.vue";
import ThemeSelector from "./components/ThemeSelector.vue";
import TabWidthSetter from "./components/TabWidthSetter.vue";
import CodeControls from "./components/CodeControls.vue";
import Geolocations from "./components/Geolocations.vue";
import UserAgents from "./components/UserAgents.vue";
import Info from "./components/Info.vue";
import Tooltip from "./components/Tooltip.vue";
import DoomPlayer from "./components/DoomPlayer.vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { calculateRotation } from "../utils/calculationUtils";
import { TimelineMax, Power2, Elastic } from "gsap";
import { ExpoScaleEase, RoughEase, SlowMo } from "gsap/EasePack";
import Draggable from "gsap/Draggable";
import { gsap } from "gsap";

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
}

export default defineComponent({
  components: {
    Navbar,
    ThemeSelector,
    TabWidthSetter,
    CodeControls,
    Geolocations,
    UserAgents,
    Info,
    Tooltip,
    DoomPlayer,
  },
  setup() {
    const sunRotation = ref(0);
    const moonRotation = ref(0);
    const spinBrush = ref(false);
    const speedUpBrush = ref(false);

    const underlineDuration = 0.5;
    const waveHeight = 50;
    const waveLength = 250;
    const tl = new TimelineMax({ paused: true });

    const titleWrapper = ref<HTMLElement | null>(null);
    const underlineSVG = ref<SVGSVGElement | null>(null);
    const underlinePath = ref<SVGPathElement | null>(null);

    const handleBrushClick = () => {
      spinBrush.value = !spinBrush.value;
      if (spinBrush.value) {
        speedUpBrush.value = true;
        setTimeout(() => {
          speedUpBrush.value = false;
        }, 1000);
      }
    };

    onMounted(() => {
      gsap.set(underlinePath.value, {
        opacity: 0,
        attr: { d: "M0,50 Q500,50 1000,50" },
      });

      Draggable.create(underlineSVG.value, {
        type: "x,y",
        bounds: titleWrapper.value,
        edgeResistance: 0.65,
        throwProps: true,
        maxDuration: 0.3,
        zIndexBoost: false,
        onDragStart() {
          gsap.to(".underline-path", 0.3, {
            attr: { "stroke-width": 10 },
            ease: Elastic.easeInOut.config(2, 0.3),
          });
        },
        onRelease() {
          gsap.to(".underline-path", 0.3, {
            attr: { "stroke-width": 6 },
            ease: Elastic.easeInOut.config(2, 0.3),
          });
        },
        onDrag() {
          const x = this.x;
          const y = this.y;
          const path = `M0,50 Q${x},${y} 1000,50`;
          gsap.to(underlinePath.value, 0.3, {
            attr: { d: path },
            ease: Elastic.easeInOut.config(2, 0.3),
          });
        },
        onComplete() {
          gsap.to(".underline-path", 0.3, {
            attr: { "stroke-width": 6 },
            ease: Elastic.easeInOut.config(2, 0.3),
          });
        },
      });
    });

    const handleMouseEnter = () => {
      gsap.to(underlinePath.value, 0.6, {
        opacity: 1,
        attr: { d: "M0,60 Q500,50 1000,60", "stroke-width": 6 },
        ease: Elastic.easeOut.config(2, 0.3),
      });
    };

    const handleMouseLeave = () => {
      gsap.to(underlinePath.value, 1, {
        opacity: 0,
        attr: { d: "M0,50 Q500,50 1000,50" },
        ease: Elastic.easeOut.config(1, 0.5),
        delay: 2,
      });
    };

    const handleTitleClick = () => {
      gsap.fromTo(
        underlinePath.value,
        { attr: { d: "M0,50 Q500,100 1000,50" } },
        {
          attr: { d: "M0,50 Q500,0 1000,50" },
          ease: Elastic.easeOut.config(1, 0.3),
          duration: 0.5,
        }
      );
    };

    return {
      titleWrapper,
      underlinePath,
      handleMouseEnter,
      handleMouseLeave,
      handleTitleClick,
      spinBrush,
      speedUpBrush,
      handleBrushClick,
      sunRotation,
      moonRotation,
      underlineSVG,
    };
  },
  data(): Data {
    const rotationData = calculateRotation();
    return {
      currentComponent: "ThemeSelector",
      scriptContentForTooltip: "",
      showTooltip: false,
      tooltipText: "",
      tooltipX: 0,
      tooltipY: 0,
      theme: "",
      themeData: {} as monaco.editor.IStandaloneThemeData,
      sunRotation: rotationData.sunRotation,
      moonRotation: rotationData.moonRotation,
    };
  },
  computed: {
    sunMoonStyles(): Record<string, string> {
      return {
        "--sun-rotation-deg": `${this.sunRotation}deg`,
        "--moon-rotation-deg": `${this.moonRotation}deg`,
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
    updateTooltipText(newText: string) {
      this.tooltipText = newText;
    },
    rotateSunOrMoon() {
      const { sunRotation, moonRotation } = calculateRotation();
      this.sunRotation = sunRotation;
      this.moonRotation = moonRotation;
    },
    handleMouseOver(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      this.showTooltip = true;
      this.tooltipText = target.dataset.tooltip || "";
      this.tooltipX = event.pageX;
      this.tooltipY = event.pageY;
    },
    handleIconMouseOver() {
      const icon = document.getElementById(
        "iconToChangeColor"
      ) as HTMLImageElement;
      icon.style.filter = "invert(1)";
    },
    handleIconMouseOut() {
      const icon = document.getElementById(
        "iconToChangeColor"
      ) as HTMLImageElement;
      icon.style.filter = "invert(0)";
    },
    handleComponentChange(componentName: string) {
      this.currentComponent = componentName;
    },
    formatTitle(componentName: string) {
      return componentName
        .replace(/([A-Z])/g, " $1")
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
      console.log("content:", content);
      this.$emit("loadScriptIntoEditor", content);
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
      const navbar = document.querySelector(".navbar-container") as HTMLElement;
      const navbarRect = navbar.getBoundingClientRect();
      const navbarX = navbarRect.left;
      const navbarY = navbarRect.top;

      this.tooltipX = event.pageX - navbarX + 10;
      this.tooltipY = event.pageY - navbarY + 10;
    },
    handleMouseOut() {
      this.showTooltip = false;
    },
    listenForKonamiCode() {
      let input = "";
      const secret = "38384040373937396665";
      window.addEventListener("keyup", (e: KeyboardEvent) => {
        input += "" + e.keyCode;
        if (input === secret) {
          this.activatePixelPerfection();
          input = "";
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
  display: inline-flex;
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
  font: 1.2rem monospace;
  letter-spacing: 0.075rem;
  margin: 0;
  padding: 1rem 0 0.2rem 0;
  border-radius: 8px 0 0 8px;
  background-color: #f6f8fa;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
  flex: 1;
  width: calc(100% - 150px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  z-index: 2;
  transition: color 0.3s;
}

.underline {
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999999999;
  cursor: pointer;
  transition: stroke 0.3s ease;
}

.underline-path {
  stroke: #fff;
  transition: stroke 2s ease;
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
