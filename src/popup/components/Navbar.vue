<template>
  <nav class="navbar">
    <a
      v-for="item in navItems"
      :key="item.id"
      href="#"
      @click="showComponent(item.componentName)"
      :class="isActive(item.componentName)"
      class="nav-item"
    >
      <img
        :src="item.iconSrc"
        :alt="item.altText"
        class="navbar-icon"
        :id="item.ariaLabel"
        :aria-label="item.ariaLabel"
      />
    </a>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Tooltip from "./Tooltip.vue";

interface NavItem {
  id: number | string;
  componentName: string;
  tooltip: string;
  iconSrc: string;
  altText: string;
  ariaLabel: string;
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
  data(): NavbarData {
    return {
      navItems: [
        {
          id: "1",
          componentName: "ThemeSelector",
          tooltip: "Theme Selector",
          iconSrc: require("../../../assets/icons/theme.png"),
          altText: "theme-icon",
          ariaLabel: "Themes",
        },
        {
          id: "2",
          componentName: "TabWidthSetter",
          tooltip: "Tab Width Setter",
          iconSrc: require("../../../assets/icons/formatting.png"),
          altText: "formatting-icon",
          ariaLabel: "Formatting",
        },
        {
          id: "3",
          componentName: "CodeControls",
          tooltip: "Code Controls",
          iconSrc: require("../../../assets/icons/history.png"),
          altText: "code-icon",
          ariaLabel: "Code Editor",
        },
        {
          id: "4",
          componentName: "Geolocations",
          tooltip: "Geolocations",
          iconSrc: require("../../../assets/icons/geolocation.png"),
          altText: "geolocation-icon",
          ariaLabel: "Geolocation",
        },
        {
          id: "5",
          componentName: "UserAgents",
          tooltip: "User Agents",
          iconSrc: require("../../../assets/icons/userAgent.png"),
          altText: "user-agent-icon",
          ariaLabel: "User Agents",
        },
        {
          id: "6",
          componentName: "DoomPlayer",
          tooltip: "Doom",
          iconSrc: require("../../../assets/icons/doom.png"),
          altText: "doom-icon",
          ariaLabel: "Doom",
        },
        {
          id: "7",
          componentName: "Info",
          tooltip: "Info",
          iconSrc: require("../../../assets/icons/information.png"),
          altText: "info-icon",
          ariaLabel: "Info",
        },
      ] as NavItem[],
    };
  },
  methods: {
    showComponent(componentName: string) {
      this.$emit("changeComponent", componentName);
    },
    isActive(componentName: string) {
      return this.currentComponent === componentName ? "active" : "";
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
  width: 100%;
  height: 100vh;
  background: #333;
  overflow-x: visible;
  gap: 5px;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-bottom: 2px;
    color: #fff;
    text-decoration: none;
    transition: transform 0.3s ease-in-out;
    margin: 0;

    &:active {
      transform: scale(0.9);
    }

    &.active {
      transform: scale(1.1);
    }

    &:hover {
      cursor: pointer;
      transform: scale(1.2);
    }
  }

  .navbar-icon {
    filter: invert(1) brightness(1.8);
    width: 28px;
    height: 28px;
    cursor: pointer;
    transform: scale(0.9);

    &:hover,
    &:active {
      transition: transform 0.3s ease-in-out;
      transform: none;
    }
  }
}
</style>
