<template>
  <nav class="navbar">
    <a
      v-for="(item, index) in displayNavItems"
      :key="item.id"
      :id="item.id"
      :aria-label="item.ariaLabel"
      :tooltip-text="item.tooltipText"
      @click="handleClick(item, index)"
      ref="iconContainers"
      class="icon-container magnet draggable"
    >
      <img
        :src="item.iconSrc"
        :alt="item.altText"
        :class="['masked-icon', 'black-icon', isActive(item.componentName) ? 'active' : '']"
        :id="`${item.ariaLabel}mask`"
        :aria-label="item.ariaLabel"
        :style="getStyleObject(iconMaskStyles[item.id])"
        ref="iconMask"
      />
      <img
        :src="item.iconMaskSrc"
        :alt="item.altText"
        :class="['masked-icon', 'white-icon', isActive(item.componentName) ? 'active' : '']"
        :id="`${item.ariaLabel}`"
        :tooltip-text="item.tooltipText"
        :style="getStyleObject(iconMaskStyles[item.id])"
        ref="icon"
      />
    </a>
    <div class="crazy-mode-toggle">
      <input
        ref="crazyModeCheckbox"
        type="checkbox"
        class="crazy-mode-checkbox"
        id="crazy-mode-checkbox"
        v-model="crazyModeEnabled"
        @change="crazyModeToggle"
      />
      <label for="crazy-mode-checkbox" class="checkbox-label">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          class="checkbox-svg"
          :class="{ checked: crazyModeEnabled }"
          ref="checkboxSvg"
        >
          <rect x="1" y="1" width="18" height="18" fill="none" stroke="currentColor" />
          <path v-if="crazyModeEnabled" d="M5 9l3 3 7-7" stroke="currentColor" fill="none" />
        </svg>
      </label>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref, inject, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { NavItem } from '../../utils/config';
gsap.registerPlugin(Draggable);

export default defineComponent({
  props: {
    currentComponent: String,
  },
  setup(props) {
    const store = useStore();
    const activeIndex = ref(-1);
    const iconMaskStyles = inject('iconMaskStyles', ref({}));
    const getStyleObject = (styleString: string) => {
      const styleObject: Record<string, string> = {};
      if (styleString) {
        styleString.split(';').forEach((style) => {
          const [property, value] = style.split(':');
          if (property && value) {
            styleObject[property.trim()] = value.trim();
          }
        });
      }
      return styleObject;
    };

    const crazyModeEnabled = computed(() => store.state.crazyModeEnabled);
    const displayNavItems = computed(() =>
      store.state.crazyModeEnabled ? store.state.navItems : store.state.navItems.slice(1),
    );

    const handleClick = (item: NavItem, index: number) => {
      activeIndex.value = index;
      store.dispatch('updateCurrentComponent', item.componentName);
    };

    const isActive = (componentName: string) => componentName === props.currentComponent;

    const checkboxSvg = ref(null);

    const crazyModeToggle = () => {
      store.commit('setCrazyModeEnabled', !crazyModeEnabled.value);
      const iconContainers = gsap.utils.toArray('.icon-container:not(:first-child)');
      const tl = gsap.timeline();
      if (crazyModeEnabled.value) {
        iconContainers.forEach((mask: any, index: number) => {
          tl.to(
            mask,
            {
              y: `${10 + index * 2}%`,
              duration: 0.2,
              ease: 'power1.inOut',
            },
            index * 0.05,
          ).to(
            mask,
            {
              y: '0%',
              duration: 0.2,
              ease: 'power1.inOut',
            },
            index * 0.05 + 0.2,
          );
        });
      } else {
        iconContainers.forEach((mask: any, index: number) => {
          tl.to(
            mask,
            {
              y: `-${10 + index * 2}%`,
              duration: 0.2,
              ease: 'power1.inOut',
            },
            index * 0.05,
          );
        });
      }
      tl.eventCallback('onComplete', () => {
        gsap.set(checkboxSvg.value, { clearProps: 'all' });
      });
    };

    return {
      getStyleObject,
      displayNavItems,
      handleClick,
      isActive,
      crazyModeToggle,
      activeIndex,
      crazyModeEnabled,
      iconMaskStyles,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../animation-keyframes.scss';
.hidden {
  display: none;
}

img {
  width: 80%;
  height: 80%;
}

.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-x: visible;
  overflow-y: visible;
  margin: 0;
  padding: 5px 0 0 0;
  height: 100%;
  width: 60px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scrollbar-color: transparent transparent;
  background-image: var(--darkest-gradient);
  background-size: cover;
  background-attachment: fixed;
  background-color: #061a34;
  filter: drop-shadow(1px 4px 3px rgba(49, 48, 48, 0.521)) drop-shadow(0 0 10px #000);

  height: 100vh;
  display: flex;

  .icon-container {
    filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 255, 255, 0.814));
    position: relative;
    width: 40px;
    height: 40px;

    &:hover {
      cursor: pointer;
      transform: scale(1.1) rotate(5deg);
      filter: brightness(1.5) drop-shadow(0 0 10px rgba(255, 255, 255, 0.814));
    }
  }

  .masked-icon {
    position: absolute;
    width: 40px;
    object-fit: contain;
  }
  .masked-icon.black-icon {
    clip-path: inset(0 0 0 0) !important;
    -webkit-clip-path: inset(0 0 0 0) !important;
    z-index: 5;
  }
  .masked-icon.white-icon {
    z-index: 6;

    &.active {
      mask-image: linear-gradient(-45deg, #52bcba, #f5a553, #3575b3, #061a34);
      animation: gradient 15s ease infinite;
      filter: brightness(1) drop-shadow(0 0 5px white) blur(1px);
    }
  }

  .crazy-mode-toggle {
    display: flex;
    align-items: center;
    color: #fff;
    position: absolute;
    bottom: 0;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    z-index: 3;

    .checkbox-label {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 20px;
    }

    input[type='checkbox'] {
      display: none;
    }

    .crazy-mode-checkbox {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }

    .checkbox-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      stroke: #fff;
      transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

      &:hover {
        cursor: pointer;
        transform: scale(1.1);
      }

      &:active {
        cursor: pointer;
        transform: scale(0.9);
      }

      &.checked {
        transform: scale(1.05);
        stroke: #fff;
        path {
          stroke: green;
          fill: green;
        }
      }
    }
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
  img.active {
    filter: drop-shadow(0 0 10px #ffc3a0) drop-shadow(0 0 10px #ffafbd)
      drop-shadow(0 0 10px #d4a5a5) drop-shadow(0 0 10px #392343);
    animation: GradientShadow 3s ease infinite;
  }
}
</style>
