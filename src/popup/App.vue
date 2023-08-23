<template>
  <div class="container" :style="sunMoonStyles">
    <div v-if="displaySun" class="sun">
      <img src="../../assets/sun.svg" alt="Sun" />
    </div>
    <div v-if="displayMoon" class="moon">
      <img src="../../assets/moon.svg" alt="Moon" />
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
      class="navbar-container"
      @mouseover="handleMouseOver"
      @mousemove="adjustTooltipPosition"
      @mouseout="handleIconMouseOut"
    >
      <Navbar
        @changeComponent="handleComponentChange"
        :currentComponent="currentComponent"
      />
    </div>
    <div class="app-container">
      <div class="app-header">
        <div class="title-icon-wrapper">
          <span class="title">{{ formatTitle(currentComponent) }}</span>
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
        class="app-content"
        :is="currentComponent"
        v-bind="$attrs"
        @changeComponent="handleComponentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
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

interface Data {
  currentComponent: string;
  scriptContentForTooltip: string;
  showTooltip: boolean;
  tooltipText: string;
  tooltipX: number;
  tooltipY: number;
  theme: string;
  themeData: monaco.editor.IStandaloneThemeData;
  // weatherData: any;
  // temperature: any;
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
  setup() {
    const spinBrush = ref(false);
    const speedUpBrush = ref(false);

    const handleBrushClick = () => {
      spinBrush.value = !spinBrush.value;
      if (spinBrush.value) {
        speedUpBrush.value = true;
        setTimeout(() => {
          speedUpBrush.value = false;
        }, 1000); // Reset after 1 second
      }
    };

    return { spinBrush, speedUpBrush, handleBrushClick };
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
  mounted() {
    this.listenForKonamiCode();
    const rotationData = calculateRotation();
    this.sunRotation = rotationData.sunRotation;
    this.moonRotation = rotationData.moonRotation;
  },
  watch: {
    displaySun(newValue) {
      if (newValue) {
        document.body.style.backgroundImage = "url(../../assets/sun.svg)";
      } else {
        document.body.style.backgroundImage = "url(../../assets/moon.svg)";
      }
    },
    sunRotation() {
      this.rotateSunOrMoon();
    },
    moonRotation() {
      this.rotateSunOrMoon();
    },
  },
  methods: {
    rotateSunOrMoon() {
      const { sunRotation, moonRotation } = calculateRotation();
      this.sunRotation = sunRotation;
      this.moonRotation = moonRotation;
    },
    handleMouseOver(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (target.nodeName === "IMG") {
        this.showTooltip = true;
        this.tooltipText = target.getAttribute("aria-label") || "";
        this.tooltipX = event.pageX;
        this.tooltipY = event.pageY;
      }
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
    // displayWeather() {
    //   if (this.weatherData.hourly.temperature) {
    //     document.body.style.backgroundImage =
    //       "url(../../assets/rain-clouds.svg)";
    //   }
    // },
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
/* Global Image Styles */
.cloud1,
.cloud2 {
  position: absolute;
  top: 50px;
  width: 50px;
  height: 18px;
}

.cloud1 {
  left: -150px;
  animation: moveclouds 25s linear infinite;
  background: url(../../assets/cloud1.svg) no-repeat;
}

.cloud2 {
  left: -195px;
  animation: moveclouds 30s linear infinite;
  background: url(../../assets/cloud2.svg) no-repeat;
}

@keyframes moveclouds {
  0% {
    left: -250px;
  }
  100% {
    left: 100%;
  }
}

.app-content {
  width: 100%;
  height: calc(100% - 60px);
  max-height: calc(100% - 60px);
  margin: 0;
  padding: 0;
  flex: 1;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.container {
  display: flex;
  height: 100%;
  width: 100%;
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  background-color: rgba(246, 248, 250, 0.9);
  margin: 0;
  padding: 0;
  flex: 1;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;

  .sun,
  .moon {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform-origin: 50% 100%;
    transition: transform 0.5s;
    transform: rotate(var(--sun-rotation-deg) deg);
    z-index: 10001;
  }
}

.navbar-container {
  width: 50px;
  max-width: 50px;
  height: 100vh !important;
  margin: 0;
  padding: 5px 0 5px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background: linear-gradient(to bottom, #1c1c1c, #454545);
  overflow-y: hidden;
  overflow-x: auto;
  position: relative;
  z-index: 9999 !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: calc(100% - 50px);
  height: 100vh !important;
  margin: 0;
  padding: 0;
  flex: 1;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow-y: hidden;
  overflow-x: hidden;
  background-color: rgba(246, 248, 250, 0.9);
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  max-height: 60px;
  flex: 1;
  margin: 0;
  padding: 0;
  z-index: 10002;
  background-color: transparent;
  position: absolute;
  top: 0;
  width: calc(100% - 50px);
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

.paintbrush {
  transform-origin: center;
  z-index: 10000;
  width: 64px;
  height: 64px;
  opacity: 1;
  animation: rotate 2s linear infinite;
  animation-play-state: paused;
  margin: 0.4rem 0.5rem 0 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;

  &.spin {
    animation-play-state: running;
  }

  .speedUp {
    animation: spinAndRubberBand 1s linear infinite;
  }

  &:hover {
    animation: rockBrush 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
    cursor: pointer;
    opacity: calc(0.8 + 0.2 * var(--speed));
  }

  &:active {
    animation: throwBrush 1s ease forwards;
    cursor: pointer;
    transform: scaleY(1) scaleX(1);
  }
}

.title {
  font: 1.3rem monospace;
  letter-spacing: 0.075rem;
  margin: 0.5rem 0 0.5rem 0.5rem;
  padding: 0;
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
}

.title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #5a6b7c;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.title:hover::after {
  transform: scaleX(1);
}

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

label {
  font-weight: 500;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
}

select,
input[type="number"] {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-size: 1rem;
  background-color: #fff;

  &:hover {
    border-color: #80bdff;
  }

  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
}

select option {
  padding: 0.5rem 1rem;

  &:hover {
    background-color: #80bdff;
    color: white;
  }
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
