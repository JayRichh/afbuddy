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
          <h1 class="title draggable">{{ $t(formattedTitle) }}</h1>
          <img
            ref="paintbrush"
            id="iconToChangeColor"
            class="paintbrush draggable"
            src="../../assets/icons/logo-bg-full.png"
            alt="Icon"
          />
        </div>
      </div>
      <component :is="currentComponent" class="app-content draggable" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, Component, ref, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import ThemeSelector from './components/ThemeSelector.vue';
import Json from './components/Json.vue';
import TabManager from './components/TabManager.vue';
import CodeControls from './components/CodeControls.vue';
import Geolocation from './components/Geolocation.vue';
import UserAgents from './components/UserAgents.vue';
import Info from './components/Info.vue';
import Tooltip from './components/Tooltip.vue';
import DoomPlayer from './components/DoomPlayer.vue';
import { ExpoScaleEase, RoughEase, SlowMo } from 'gsap/EasePack';
import Draggable from 'gsap/Draggable';
import { gsap } from 'gsap';
import { setupDraggable } from '../utils/draggable';
import { mapState, mapMutations } from 'vuex';
import { useStore } from 'vuex';
import { setupAnimations } from '../utils/animations';
import { listenForKonamiCode as konamiCodeListener } from '../utils/z';

gsap.registerPlugin(ExpoScaleEase, RoughEase, SlowMo, Draggable);

interface Data {
  currentComponent: string;
  scriptContentForTooltip: string;
  isDraggable: boolean;
}

export default defineComponent({
  components: {
    Navbar: Navbar,
    ThemeSelector: ThemeSelector,
    Json,
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
    };
  },

  computed: {
    ...mapState([
      'tooltipText',
      'tooltipX',
      'tooltipY',
      'showTooltip',
      'crazyModeEnabled',
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
      const store = useStore();
      store.commit('setCurrentComponent', componentName);
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

  setup() {
    let [firstIcon, popin, popout]: gsap.core.Timeline[] = [];
    const currentComponent = computed(() => store.state.currentComponent);
    console.log(currentComponent);

    const store = useStore();
    const formattedTitle = computed(() => {
      const title = store.state.currentComponent;
      return title
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(' ', '\n');
    });

    onMounted(() => {
      const animations = setupAnimations();
      const { tl, hoverAnim, activeAnim, spinAnim, popin, popout, firstIcon } = animations;
      tl.play();

      gsap.utils.toArray('.icon-mask').forEach((mask: any, index: number) => {
        if (index === 0) {
          firstIcon.play();
        } else {
          popin.play();
          popout.play();
        }
      });
    });

    const crazyModeToggle = () => {
      store.commit('setCrazyModeEnabled', !store.state.crazyModeEnabled);

      if (store.state.crazyModeEnabled) {
        firstIcon.play();
        popin.play();
      } else {
        firstIcon.reverse();
        popout.play();
      }
    };

    return {
      formattedTitle,
      crazyModeToggle,
      currentComponent,
    };
  },

  async mounted() {
    this.listenForKonamiCode = this.listenForKonamiCode.bind(this) as () => void;
    this.activatePixelPerfection = this.activatePixelPerfection.bind(this) as () => void;
    konamiCodeListener(this.activatePixelPerfection);

    const store = useStore();
    await store.dispatch('initializeStore');

    this.$nextTick(() => {
      setupDraggable(store);
    });
  },
});
</script>

<style lang="scss">
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
  z-index: 2;
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
  z-index: 0;

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
  z-index: 2;
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
