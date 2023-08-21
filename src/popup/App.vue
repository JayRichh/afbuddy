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
      :text="tooltipText"
      :visible="showTooltip"
      :theme="theme"
      :themeData="themeData"
      :isCodeEditorPreview="!!theme"
      :content="tooltipText"
    />
    <div
      class="navbar-container"
      @mouseover="handleMouseOver"
      @mousemove="adjustTooltipPosition"
      @mouseout="handleMouseOut"
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
            class="paintbrush"
            :class="{ spin: spinBrush }"
            src="../../assets/icons/logo-bg-full.png"
            alt="Icon"
            @click="handleBrushClick"
          />
        </div>
      </div>
      <component
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

function calculateRotation() {
  const now = new Date();
  const hours = now.getUTCHours();

  let sunRotation = (hours / 24) * 360;
  let moonRotation = (((hours + 12) % 24) / 24) * 360;

  return { sunRotation, moonRotation };
}

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
    DoomPlayer
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
    const handleBrushClick = () => {
      spinBrush.value = !spinBrush.value;
    };

    return { spinBrush, handleBrushClick };
  },
  data() {
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
.sun,
.moon {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform-origin: 50% 100%;
}

.sun {
  transition: transform 0.5s;
  transform: rotate(var(--sun-rotation-deg) deg);
}

.moon {
  transition: transform 0.5s;
  transform: rotate(var(--moon-rotation-deg) deg);
}
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

img {
  height: 3rem;
  width: 3rem;
}

img:hover {
  transform: scale(1.02);
}

img:active {
  transform: scale(0.98);
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(75, 75, 75, 0.8) rgba(50, 50, 50, 0.6);
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(50, 50, 50, 0.6);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(75, 75, 75, 0.8);
    border-radius: 3px;
    &:hover {
      background-color: rgba(85, 85, 85, 0.9);
    }
  }
}

.container {
  display: flex;
  height: 100%;
  width: 100%;
}

.navbar-container {
  width: 38px;
  max-width: 36px;
  height: 100%;
  background-color: #f6f8fa;
  overflow-y: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.app-container {
  display: flex;
  flex-direction: column;
  background-color: #f6f8fa;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  flex: 1;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font: 1.2rem monospace;
  font-weight: 500;
  width: 100%;
  background-color: #f6f8fa;
  border-bottom: 1px solid #e0e0e0;
}

.title-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.paintbrush {
  margin: 0 15px 0 0;
  transform-origin: center;
  &:hover {
    cursor: pointer;
    animation: rotate 2s linear infinite;
  }
  &.spin {
    animation: throwBrush 1s ease forwards;
  }
}

.title {
  font-family: "Arial", sans-serif;
  font-weight: bold;
  margin-left: 10px;
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
    transform: translateY(0) scaleX(-1);
  }
  10% {
    transform: translateY(10px) scaleX(-1);
  }
  20% {
    transform: translateY(-10px) rotate(180deg) scaleX(-1);
  }
  60% {
    transform: translateY(0) rotate(360deg) scaleX(-1);
  }
  70%,
  80%,
  90% {
    transform: translateY(10px) rotate(360deg - 15deg) scaleX(-1);
  }
  75%,
  85% {
    transform: translateY(0) rotate(360deg + 15deg) scaleX(-1);
  }
  95% {
    transform: translateY(0) rotate(365deg) scaleX(-1);
  }
  100% {
    transform: translateY(0) rotate(360deg) scaleX(-1);
  }
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
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
