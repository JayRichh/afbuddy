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
      @mousedown="startDrag($event, item.ariaLabel)"
    >
      <div class="icon-mask" :id="`${item.ariaLabel}Mask`">
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
  </nav>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Tooltip from "./Tooltip.vue";
import { gsap, Power2, Elastic } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin";

gsap.registerPlugin(CSSPlugin);

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
  navItems: NavItem[];
}

export default defineComponent({
  components: {
    Tooltip,
  },

  props: {
    currentComponent: String,
  },

  data(): NavbarData {
    return {
      draggedIcon: null,
      isDragging: false,
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
    resetIcon(ariaLabel: string) {
      const iconContainer = document.getElementById(ariaLabel);
      if (iconContainer) {
        gsap.to(iconContainer, 0.7, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          ease: Elastic.easeOut.config(1.2, 0.4),
        });
      }

      this.clipIcons(ariaLabel, 0);
    },

    hoverMouse(event: MouseEvent, ariaLabel: string): void {
      if (!this.isDragging) {
        this.$emit("showTooltip", ariaLabel);
      }
    },

    startDrag(event: MouseEvent, ariaLabel: string): void {
      const iconContainer = document.getElementById(ariaLabel);
      if (!iconContainer) return;

      this.isDragging = true;
      this.draggedIcon = ariaLabel;

      const onMouseMove = (event: MouseEvent) => {
        const { clipWidth, navbarRight } = this.calculateClipWidthAndNavbarRight(event, ariaLabel);
        gsap.to(iconContainer, 0.7, {
          x: event.clientX - navbarRight,
          y: event.clientY - 20,
          scale: 1.2,
          rotation: 360,
          ease: Power2.easeOut,
        });
        this.clipIcons(ariaLabel, clipWidth);
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        this.resetIcon(ariaLabel);
        this.isDragging = false;
        this.draggedIcon = null;
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },

    clipIcons(ariaLabel: string, clipWidth: number): void {
      if (this.isDragging && ariaLabel === this.draggedIcon) {
        const iconContainer = document.getElementById(ariaLabel);
        const whiteIcon = iconContainer?.querySelector(".white-icon") as HTMLElement;
        const blackIcon = iconContainer?.querySelector(".black-icon") as HTMLElement;

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
      const clipWidth = Math.min(offsetX, 40); // Clip up to 40px

      return { clipWidth, navbarRight };
    },

    handleClick(componentName: string, ariaLabel: string) {
      this.showComponent(componentName);
      this.navItems.forEach((item) => {
        item.selected = item.componentName === componentName;
      });
      this.animateIcon(ariaLabel);
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
      return this.currentComponent === componentName ? "active" : "";
    },
  },
});
</script>

<style lang="scss" scoped>
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  width: 40px;
  height: auto;
  z-index: 10000;
  overflow-x: visible;
  overflow-y: visible;
  transition: transform 0.3s ease;
  cursor: pointer;
  filter: brightness(1.8) drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));

  &:hover {
    transform: scale(1.1);
    filter: brightness(1) drop-shadow(0 0 4px rgba(197, 242, 177, 0.8));
  }

  &.initial-glow {
    filter: invert(1) brightness(2.5)
      drop-shadow(0 0 14px rgba(255, 255, 255, 0.8));
  }

  > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 45px;
    height: 100%;
    object-fit: contain;
    z-index: 190000;
    padding: auto;
    margin: auto;
  }
}

.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
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

  .icon-container {
    position: relative;
    width: 100%;
    max-width: 50px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    padding: 0;
    margin: 0;
  }

  .icon-mask {
    position: absolute;
    overflow: visible;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .masked-icon {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .black-icon {
    z-index: 999999999;
  }

  .white-icon {
    z-index: 1000000000;
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
    animation: pulseGlow 2s ease-in-out infinite;

    &:hover {
      transform-origin: center;
      transform: scale(1);
      filter: brightness(3) drop-shadow(0 0 14px rgba(197, 242, 177, 0.8));
    }
  }
}
</style>
