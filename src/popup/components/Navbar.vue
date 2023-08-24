<template>
  <nav class="navbar">
      
      <a
      v-for="item in navItems"
  :key="item.id"
  href="#"
  @click.stop="handleClick(item.componentName, item.ariaLabel)"
  :aria-label="item.tooltip"
  :id="item.ariaLabel"
  :class="[
    'nav-item icon-container hitbox',
    isActive(item.componentName) ? 'active' : '',
    item.selected ? 'selected' : '',
  ]"
  @mouseover="hoverMouse($event, item.ariaLabel)"
  @mousemove="crazyModeEnabled ? magneticPullCrazyEffect($event, item.ariaLabel) : magneticPullEffect($event, item.ariaLabel)"
  @mouseleave="onIconMouseLeave"
>
  <div
    class="icon-mask"
    :id="`${item.ariaLabel}-mask`"
    @mouseleave="onIconMouseLeave"
  >
    <img
      :src="item.iconSrc"
      :alt="item.altText"
      class="masked-icon black-icon"
    />
    <img
      :src="item.iconMaskSrc"
      :alt="item.altText"
      class="masked-icon white-icon"
    />
  </div>
</a>
<div class="crazy-mode-toggle">
    <input
      type="checkbox"
      id="crazy-mode-checkbox"
      v-model="crazyModeEnabled"
      @change="toggleCrazyMode"
      @mouseover="$emit('updateTooltipText', 'Toggle Crazy Mode')"
      @mouseleave="$emit('updateTooltipText', '')"
    />
  <label for="crazy-mode-checkbox">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      class="checkbox-svg"
      :class="{ 'checked': crazyModeEnabled }"
    >
      <rect
        x="1"
        y="1"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
      />
      <path
        v-if="crazyModeEnabled"
        d="M5 9l3 3 7-7"
        stroke="currentColor"
        fill="none"
      />
    </svg>
  </label>
</div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Tooltip from "./Tooltip.vue";
import { gsap, Power2, Elastic, Bounce } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin";
import { ExpoScaleEase, RoughEase, SlowMo } from "gsap/EasePack";

gsap.registerPlugin(CSSPlugin, ExpoScaleEase, RoughEase, SlowMo);

interface NavItem {
  id: number | string;
  componentName: string;
  tooltip: string;
  iconSrc: string;
  iconMaskSrc: string;
  altText: string;
  ariaLabel: string;
  selected?: boolean;
}

interface NavbarData {
  draggedIcon: string | null;
  isDragging: boolean;
  crazyModeEnabled: boolean;
  navItems: NavItem[];
}

export default defineComponent({
  components: {
    Tooltip,
  },

  props: {
    currentComponent: String,
  },

  setup(props) {
    const position = ref({ x: 0, y: 0 });
    const crazyModeEnabled = ref(false);

    const onMouseMove = (event: MouseEvent) => {
      const offsetX = Math.min(
        Math.max(event.clientX - position.value.x, -5),
        50
      );
      const offsetY = Math.min(
        Math.max(event.clientY - position.value.y, -5),
        20
      );

      position.value.x += offsetX;
      position.value.y += offsetY;
    };

    const onIconMouseLeave = (event: Event) => {
      const target = event.target as HTMLElement;

      gsap.to(target, {
        x: 0,
        y: 0,
        scale: 1,
        ease: ExpoScaleEase.config(1, 1.5, Power2.easeOut),
        duration: 1,
      });
    };

    return { position, onMouseMove, onIconMouseLeave, crazyModeEnabled };
  },

  data(): NavbarData {
    return {
      draggedIcon: null,
      isDragging: false,
      crazyModeEnabled: false,
      navItems: [
        {
          id: "1",
          componentName: "ThemeSelector",
          iconSrc: require("../../../assets/icons/theme.png"),
          iconMaskSrc: require("../../../assets/icons/themeWhite.png"),
          altText: "theme-icon",
          ariaLabel: "Themes",
          selected: true,
        },
        {
          id: "2",
          componentName: "TabWidthSetter",
          iconSrc: require("../../../assets/icons/formatting.png"),
          iconMaskSrc: require("../../../assets/icons/formattingWhite.png"),
          altText: "formatting-icon",
          ariaLabel: "Formatting",
          selected: false,
        },
        {
          id: "3",
          componentName: "CodeControls",
          iconSrc: require("../../../assets/icons/history.png"),
          iconMaskSrc: require("../../../assets/icons/historyWhite.png"),
          altText: "code-icon",
          ariaLabel: "Code Editor",
          selected: false,
        },
        {
          id: "4",
          componentName: "Geolocations",
          iconSrc: require("../../../assets/icons/geolocation.png"),
          iconMaskSrc: require("../../../assets/icons/geolocationWhite.png"),
          altText: "geolocation-icon",
          ariaLabel: "Geolocation",
          selected: false,
        },
        {
          id: "5",
          componentName: "UserAgents",
          iconSrc: require("../../../assets/icons/userAgent.png"),
          iconMaskSrc: require("../../../assets/icons/userAgentWhite.png"),
          altText: "user-agent-icon",
          ariaLabel: "User Agents",
          selected: false,
        },
        {
          id: "6",
          componentName: "DoomPlayer",
          iconSrc: require("../../../assets/icons/doom.png"),
          iconMaskSrc: require("../../../assets/icons/doomWhite.png"),
          altText: "doom-icon",
          ariaLabel: "Doom",
          selected: false,
        },
        {
          id: "7",
          componentName: "Info",
          iconSrc: require("../../../assets/icons/information.png"),
          iconMaskSrc: require("../../../assets/icons/informationWhite.png"),
          altText: "info-icon",
          ariaLabel: "Info",
          selected: false,
        },
      ] as NavItem[],
    };
  },

  methods: {
    magneticPullCrazyEffect(event: MouseEvent, ariaLabel: string): void {
      const iconElement = document.getElementById(ariaLabel);
      const maskElement = document.getElementById(`${ariaLabel}-mask`);

      if (iconElement && maskElement) {
        gsap.to([iconElement, maskElement], {
          x: (event.clientX - iconElement.getBoundingClientRect().left) * 0.2,
          y: (event.clientY - iconElement.getBoundingClientRect().top) * 0.2,
          ease: RoughEase.ease.config({
            strength: 1,
            points: 20,
            taper: "none",
            randomize: true,
          }),
          duration: 1,
        });
      }
    },
    magneticPullEffect(event: MouseEvent, ariaLabel: string): void {
      const iconContainer = document.getElementById(ariaLabel);
      if (!iconContainer || this.isDragging) return;

      const hoverArea = 0.8;
      const cursor = { x: event.clientX, y: event.clientY - window.scrollY };
      const width = iconContainer.offsetWidth;
      const height = iconContainer.offsetHeight;
      const offset = iconContainer.getBoundingClientRect();
      const elPos = { x: offset.left + width / 2, y: offset.top + height / 2 };
      const x = cursor.x - elPos.x;
      const y = cursor.y - elPos.y;
      const dist = Math.sqrt(x * x + y * y);
      const mutHover = dist < width * hoverArea;

      if (mutHover) {
        const angle = Math.atan2(y, x);
        const step = 1;
        const tx = Math.cos(angle) * step * 2  * 0.5;
        const ty = Math.sin(angle) * step * 2 * 0.5;
        const scale = 1.15;
        const rotation = 0.1;

        gsap.to(iconContainer, 0.7, {
          x: tx,
          y: ty,
          scale,
          rotation,
          ease: Elastic.easeOut.config(1.2, 0.4),
          onComplete: () => {
            gsap.to(iconContainer, 0.5, {
              scale: 1.05,
              ease: Bounce.easeOut,
            });
          },
        });
      } else {
        gsap.to(iconContainer, 0.7, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          ease: Elastic.easeOut.config(1.2, 0.4),
          onComplete: () => {
            gsap.to(iconContainer, 0.5, {
              scale: 1,
              ease: Bounce.easeOut,
            });
          },
        });
      }
    },

    calculateDistance(event: MouseEvent, ariaLabel: string): number {
      const iconContainer = document.getElementById(ariaLabel);
      if (!iconContainer) return 0;

      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const iconX =
        iconContainer.getBoundingClientRect().left +
        iconContainer.offsetWidth / 2;
      const iconY =
        iconContainer.getBoundingClientRect().top +
        iconContainer.offsetHeight / 2;

      return Math.sqrt((mouseX - iconX) ** 2 + (mouseY - iconY) ** 2);
    },

    resetIcon(ariaLabel: string): void {
      const iconElement = document.getElementById(ariaLabel);
      const maskElement = document.getElementById(`${ariaLabel}-mask`);

      if (iconElement && maskElement) {
        gsap.to([iconElement, maskElement], {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          ease: Elastic.easeOut.config(1.2, 0.4),
          duration: 0.7,
        });
      }
    },

    toggleCrazyMode(): void {
      this.crazyModeEnabled = !this.crazyModeEnabled;
      if (!this.crazyModeEnabled) {
        this.navItems.forEach((item) => {
          this.resetIcon(item.ariaLabel);
        });
      }
    },

    applyMagneticEffect(event: MouseEvent): void {
      if (this.crazyModeEnabled) {
        this.navItems.forEach((item: NavItem) => {
          if (item.ariaLabel) {
            this.magneticPullCrazyEffect(event, item.ariaLabel);
          }
        });
      } else {
        this.navItems.forEach((item: NavItem) => {
          if (item.ariaLabel) {
            this.magneticPullEffect(event, item.ariaLabel);
          }
        });
      }
    },

    mounted() {
      onMounted(() => {
        this.$nextTick(() => {
          this.navItems.forEach((item: NavItem) => {
            const iconContainer = document.getElementById(item.ariaLabel);
            if (iconContainer) {
              iconContainer.addEventListener("mousemove", (event: MouseEvent) => {
                this.applyMagneticEffect(event);
              });
            }
          });
        });
      });
    },

    hoverMouse(event: MouseEvent, ariaLabel: string): void {
      if (!this.isDragging) {
        this.$emit("updateTooltipText", ariaLabel);
      }
    },

    clipIcons(ariaLabel: string, clipWidth: number): void {
      if (this.isDragging && ariaLabel === this.draggedIcon) {
        const iconContainer = document.getElementById(ariaLabel);
        const whiteIcon = iconContainer?.querySelector(
          ".white-icon"
        ) as HTMLElement;
        const blackIcon = iconContainer?.querySelector(
          ".black-icon"
        ) as HTMLElement;

        gsap.to(whiteIcon, 0.7, {
          clipPath: `inset(0 0 0 ${50 + clipWidth}px)`,
          ease: Power2.easeOut,
        });

        gsap.to(blackIcon, 0.7, {
          clipPath: `inset(0 ${50 - clipWidth}px 0 0)`,
          ease: Power2.easeOut,
        });
      }
    },

    calculateClipWidthAndNavbarRight(
      event: MouseEvent,
      ariaLabel: string
    ): { clipWidth: number; navbarRight: number } {
      const iconContainer = document.getElementById(ariaLabel);
      if (!iconContainer) return { clipWidth: 0, navbarRight: 0 };

      const initialX = event.clientX;
      const navbarLeft = iconContainer.getBoundingClientRect().left + 50; // 50px from left edge
      const navbarRight = iconContainer.getBoundingClientRect().right;
      const offsetX = event.clientX - initialX;
      const clipWidth = Math.min(
        Math.max(0, navbarRight - navbarLeft + offsetX),
        100
      );

      return { clipWidth, navbarRight };
    },

    handleClick(componentName: string, ariaLabel: string) {
      // this.animateIcon(ariaLabel); no
      this.showComponent(componentName);
      this.navItems.forEach((item) => {
        if (item.componentName === componentName) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      });
    },

    showComponent(componentName: string) {
      this.$emit("changeComponent", componentName);
    },

    animateIcon(ariaLabel: string) {
      const icon = this.$el.querySelector(`a[aria-label='${ariaLabel}']`);
      if (icon) {
        const animationClass = this.getAnimationClass(ariaLabel);
        icon.classList.add(animationClass);
        setTimeout(() => {
          icon.classList.remove(animationClass);
        }, 3000);
      }
    },

    getAnimationClass(ariaLabel: string): string {
      const animationMap = {
        Themes: "paintbrushFlick",
        Formatting: "pyramidRoll",
        "Code Editor": "wheelSpin",
        Geolocation: "markerPulse",
        "User Agents": "magnifyZoom",
        Doom: "gamePulse",
        Info: "infoAwesome",
      } as Record<string, string>;
      return animationMap[ariaLabel] || "";
    },

    isActive(componentName: string) {
      return componentName === this.currentComponent;
    },
  },
});
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; 
  height: 100%;
  width: 50px;
  max-width: 50px;
  border-right: 1px solid #dddddde1;
  overflow-x: visible;
  overflow-y: visible;
  margin: 0;
  padding: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scrollbar-color: transparent transparent;

  &:first-child {
    margin-top: 5px;
  }

  &:last-child {
    position: absolute;
    bottom: 0;
  }


  .icon-mask {
    filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 255, 255, 0.814));
    transition: filter 0.3s ease;
    z-index: 100000000;
    position: relative;
    width: 50px;
    height: 50px;
    &:hover {
      cursor: pointer;
      filter: brightness(1.5) drop-shadow(0 0 10px rgba(255, 255, 255, 0.814));
      transform: scale(1.1);
      transition: filter 0.3s ease;
    }

    &:active {
      filter: drop-shadow(0 0 5px white) blur(1px);
      transform: scale(0.9);
      transition: filter 0.3s ease;
    }
  }

  .masked-icon {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 1000000000;
  }

  .black-icon {
    z-index: 100000000;
  }

  .white-icon {
    z-index: 1000000000;
  }

  .crazy-mode-toggle {
    display: flex;
    align-items: center;
    color: #fff;
    position: absolute;
    bottom: 0;

    input[type="checkbox"] {
      display: none;

      &:checked + label .checkbox-svg {
        fill: #fff;
      }
    }

    label {
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .checkbox-svg {
      fill: transparent;
      stroke: #fff; // White stroke
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }

  @keyframes paintbrushFlick {
    0% {
      transform: rotate(0deg) translateX(20px);
    }
    20% {
      transform: rotate(-100deg) translateX(20px);
    }
    40% {
      transform: rotate(70deg) translateX(20px);
    }
    60% {
      transform: rotate(-50deg) translateX(20px);
    }
    80% {
      transform: rotate(30deg) translateX(20px);
    }
    100% {
      transform: rotate(0deg) translateX(20px);
    }
  }
  @keyframes pyramidRoll {
    0%,
    100% {
      transform: scaleY(1) rotate(0deg) translateX(20px);
    }
    25% {
      transform: scaleY(0.7) rotate(1200deg) translateX(20px);
    }
    50% {
      transform: scaleY(0.9) rotate(2400deg) translateX(20px);
    }
    75% {
      transform: scaleY(0.8) rotate(3600deg) translateX(20px);
    }
  }
  @keyframes wheelSpin {
    0% {
      transform: rotate(0deg);
    }
    40% {
      transform: rotate(-365deg);
    }
    70% {
      transform: rotate(-355deg);
    }
    90% {
      transform: rotate(-360deg);
    }
    100% {
      transform: rotate(-358deg);
    }
  }
  @keyframes gamePulse {
    0%,
    100% {
      filter: hue-rotate(0deg);
      transform: translateY(0);
    }
    30% {
      filter: hue-rotate(15deg);
      transform: translateY(-5px);
    }
    70% {
      filter: hue-rotate(-15deg);
      transform: translateY(5px);
    }
  }
  @keyframes markerPulse {
    0%,
    100% {
      transform: scale(1) translateY(0);
    }
    50% {
      transform: scale(1.05) translateY(-2px);
    }
  }
  @keyframes magnifyZoom {
    0%,
    100% {
      transform: scale(1) rotate(0deg);
    }
    50% {
      transform: scale(1.1) translateX(10%) translateY(-10%) rotate(5deg);
    }
  }
  @keyframes infoAwesome {
    0%,
    100% {
      transform: translateY(0);
      filter: brightness(1);
    }
    50% {
      transform: translateY(-3px);
      filter: brightness(1.2);
    }
  }
  @keyframes pulseGlow {
    0%,
    100% {
      filter: brightness(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    }
    25% {
      filter: brightness(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
    }
    50% {
      filter: brightness(1) drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
    }
    75% {
      filter: brightness(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
    }
  }

  a.paintbrushFlick {
    animation: paintbrushFlick 2s infinite;
  }
  a.pyramidRoll {
    animation: pyramidRoll 3.5s cubic-bezier(0.32, 0, 0.67, 1);
  }
  a.wheelSpin {
    animation: wheelSpin 3.5s;
  }
  a.markerPulse {
    animation: markerPulse 2.5s ease-in-out;
  }
  a.magnifyZoom {
    animation: magnifyZoom 3s cubic-bezier(0.42, 0, 0.58, 1);
  }
  a.gamePulse {
    animation: gamePulse 1.5s ease-in-out;
  }
  a.infoAwesome {
    animation: infoAwesome 3s cubic-bezier(0.42, 0, 0.58, 1);
  }
  a.selected {
    filter: drop-shadow(0 0 10px #ffc3a0) drop-shadow(0 0 10px #ffafbd)
      drop-shadow(0 0 10px #d4a5a5) drop-shadow(0 0 10px #392343);
    animation: GradientShadow 3s ease infinite;
  }

  @keyframes GradientShadow {
    0% {
      filter: drop-shadow(0 0 10px #ffc3a0);
    }
    25% {
      filter: drop-shadow(0 0 10px #ffafbd);
    }
    50% {
      filter: drop-shadow(0 0 10px #d4a5a5);
    }
    75% {
      filter: drop-shadow(0 0 10px #392343);
    }
    100% {
      filter: drop-shadow(0 0 10px #ffc3a0);
    }
  }
}
</style>
