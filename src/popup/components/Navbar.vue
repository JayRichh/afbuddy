<template>
  <nav class="navbar">
    <a
      v-for="item in navItems"
      :key="item.id"
      href="#"
      @click.stop="handleClick(item.componentName)"
      :aria-label="item.tooltip"
      :title="item.tooltip"
      :class="[
        'nav-item',
        isActive(item.componentName) ? 'active' : '',
        item.selected ? 'selected' : '',
      ]"
    >
      <img
        :src="item.iconSrc"
        :alt="item.altText"
        class="navbar-icon"
        :id="item.ariaLabel"
        :aria-label="item.ariaLabel"
        @click="animateIcon(item.ariaLabel)"
      />
    </a>
  </nav>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import Tooltip from "./Tooltip.vue";

interface NavItem {
  id: number | string;
  componentName: string;
  tooltip: string;
  iconSrc: string;
  altText: string;
  ariaLabel: string;
  selected?: boolean;
}

interface NavbarData {
  navItems: NavItem[];
}

export default defineComponent({
  components: {
    Tooltip,
  },
  props: {
    currentComponent: String,
  },
  mounted() {
    this.addMagneticEffectToIcons();
  },
  data(): NavbarData {
    return {
      navItems: [
        {
          id: "1",
          componentName: "ThemeSelector",
          iconSrc: require("../../../assets/icons/theme.png"),
          altText: "theme-icon",
          ariaLabel: "Themes",
          selected: true,
        },
        {
          id: "2",
          componentName: "TabWidthSetter",
          iconSrc: require("../../../assets/icons/formatting.png"),
          altText: "formatting-icon",
          ariaLabel: "Formatting",
          selected: false,
        },
        {
          id: "3",
          componentName: "CodeControls",
          iconSrc: require("../../../assets/icons/history.png"),
          altText: "code-icon",
          ariaLabel: "Code Editor",
          selected: false,
        },
        {
          id: "4",
          componentName: "Geolocations",
          iconSrc: require("../../../assets/icons/geolocation.png"),
          altText: "geolocation-icon",
          ariaLabel: "Geolocation",
          selected: false,
        },
        {
          id: "5",
          componentName: "UserAgents",
          iconSrc: require("../../../assets/icons/userAgent.png"),
          altText: "user-agent-icon",
          ariaLabel: "User Agents",
          selected: false,
        },
        {
          id: "6",
          componentName: "DoomPlayer",
          iconSrc: require("../../../assets/icons/doom.png"),
          altText: "doom-icon",
          ariaLabel: "Doom",
          selected: false,
        },
        {
          id: "7",
          componentName: "Info",
          iconSrc: require("../../../assets/icons/information.png"),
          altText: "info-icon",
          ariaLabel: "Info",
          selected: false,
        },
      ] as NavItem[],
    };
  },
  methods: {
    handleClick(componentName: string) {
      this.showComponent(componentName);
      this.navItems.forEach((item) => {
        item.selected = item.componentName === componentName;
      });
    },
    showComponent(componentName: string) {
      this.$emit("changeComponent", componentName);
    },

    animateIcon(ariaLabel: string) {
      const icon = this.$el.querySelector(`#${ariaLabel}`);
      if (icon) {
        icon.classList.add("animate");
        setTimeout(() => {
          icon.classList.remove("animate");
        }, 3000);
      }
    },
    isActive(componentName: string) {
      return this.currentComponent === componentName ? "active" : "";
    },
    addMagneticEffectToIcons() {
      const icons: NodeListOf<HTMLElement> = this.$el.querySelectorAll(
        ".navbar-icon"
      );
      icons.forEach((icon) => {
        icon.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = icon.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          let offsetX = (e.clientX - centerX) / 20; // Adjust the divisor for stronger/weaker effect
          let offsetY = (e.clientY - centerY) / 20;

          // Limit the movement to 2px in any direction
          offsetX = Math.min(Math.max(offsetX, -10), 10);
          offsetY = Math.min(Math.max(offsetY, -10), 10);

          icon.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });

        icon.addEventListener("mouseleave", () => {
          icon.style.transform = "none";
        });
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  gap: 4px;
  overflow-y: hidden;
  margin: 0.5rem 0 1rem 0;
  padding: 0;
  box-sizing: border-box;

  a {
    color: #fff;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
    border-radius: 8px;
    cursor: pointer;
  }

  .navbar-icon {
    position: relative;
    padding: 0;
    margin: 0;
    width: 30px;
    height: 30px;
    cursor: pointer;
    filter: invert(1) brightness(1.8)
      drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));

    &:hover {
      transform: scale(1.4);
      animation: pulseGlow 1s infinite;
      filter: invert(1) brightness(3)
        drop-shadow(0 0 14px rgba(197, 242, 177, 0.8));
    }

    &:active {
      animation: pulseGlow 1s;
      filter: invert(1) brightness(1.8)
        drop-shadow(0 0 10px rgba(192, 245, 244, 0.8));
    }

    .selected::before {
      content: "";
      position: absolute;
      top: -2px;
      right: -2px;
      bottom: -2px;
      left: -2px;
      border: 2px solid #fff;
      border-radius: 8px;
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

  a.animate:nth-child(1) {
    animation: paintbrushFlick 2s infinite;
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

  a.animate:nth-child(2) .navbar-icon {
    animation: pyramidRoll 3.5s cubic-bezier(0.32, 0, 0.67, 1);
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

  a.animate:nth-child(3) .navbar-icon {
    animation: wheelSpin 3.5s;
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

  a.animate:nth-child(4) .navbar-icon {
    animation: markerPulse 2.5s ease-in-out;
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

  a.animate:nth-child(5) .navbar-icon {
    animation: magnifyZoom 3s cubic-bezier(0.42, 0, 0.58, 1);
  }

  a.animate:nth-child(6) .navbar-icon {
    animation: gamePulse 1.5s ease-in-out;
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

  a.animate:nth-child(7) .navbar-icon {
    animation: infoAwesome 3s cubic-bezier(0.42, 0, 0.58, 1);
  }

  @keyframes pulseGlow {
    0% {
      transform: scale(1);
      filter: invert(1) brightness(1.8)
        drop-shadow(0 0 14px rgba(255, 255, 255, 0.7));
    }
    50% {
      transform: scale(1.2);
      filter: invert(1) brightness(1.8)
        drop-shadow(0 0 24px rgba(255, 255, 255, 0.968));
    }
    100% {
      transform: scale(1);
      filter: invert(1) brightness(1.8)
        drop-shadow(0 0 15px rgba(255, 255, 255, 0.605));
    }
  }
}
</style>
