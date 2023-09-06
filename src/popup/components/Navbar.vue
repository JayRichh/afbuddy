<template>
  <nav class="navbar">
    <a
      v-for="(item, index) in displayNavItems"
      :key="item.id"
      :ref="
        (el) => {
          if (el) iconRefs[index] = el;
        }
      "
      :class="{ selected: isActive(item.componentName) }"
      @click="handleClick(item)"
      class="icon-container draggable"
      :id="item.id"
      :aria-label="item.ariaLabel"
    >
      <div class="icon-mask" :id="`${item.ariaLabel}-mask`" :aria-label="item.ariaLabel">
        <img :src="item.iconSrc" :alt="item.altText" class="masked-icon black-icon" />
        <img :src="item.iconMaskSrc" :alt="item.altText" class="masked-icon white-icon" />
      </div>
    </a>
    <div class="crazy-mode-toggle">
      <input
        ref="crazyModeCheckbox"
        type="checkbox"
        class="crazy-mode-checkbox draggable"
        id="crazy-mode-checkbox"
        :aria-label="'Ready: ' + (crazyModeEnabled ? 'Yes 🍕🍕🍕' : 'No 🙍‍♂️') + ''"
        v-model="crazyModeEnabled"
        @change="crazyModeToggle"
      />
      <label for="crazy-mode-checkbox">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          class="checkbox-svg"
          :class="{ checked: crazyModeEnabled }"
          :style="{ fill: crazyModeEnabled ? 'green' : 'white' }"
        >
          <rect x="1" y="1" width="18" height="18" fill="none" stroke="currentColor" />
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
interface MouseEvent extends Window {
  MouseEvent: any;
}

import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue';
import { useStore } from 'vuex';
import { gsap, Elastic } from 'gsap';
import { mapState, mapMutations } from 'vuex';
import { Draggable } from 'gsap/Draggable';
import { NavItem } from '../../utils/config';
import { PIDStateMap } from '../../utils/pidstate';

gsap.registerPlugin(Draggable);
export default defineComponent({
  props: {
    currentComponent: String,
  },
  setup(props) {
    const crazyModeEnabled = computed(() => store.state.crazyModeEnabled);
    const iconRefs = ref([]) as any;
    onMounted(() => {
      console.log(iconRefs.value);
    });

    const store = useStore();
    const displayNavItems = computed(() => {
      if (store.state.crazyModeEnabled) {
        return store.state.navItems;
      } else {
        return store.state.navItems.slice(1);
      }
    });

    const handleClick = (item: NavItem) => {
      console.log('Clicked item:', item);
      store.dispatch('updateCurrentComponent', item.componentName);
    };

    const isActive = (componentName: string) => {
      return componentName === props.currentComponent;
    };

    const crazyModeToggle = () => {
      store.commit('setCrazyModeEnabled', !store.state.crazyModeEnabled);
      const checkboxSvg = document.querySelector('.checkbox-svg');
      //   if (store.state.crazyModeEnabled) {
      //     gsap.to(checkboxSvg, {
      //       rotation: 360,
      //       duration: 1,
      //       ease: Elastic.easeOut.config(1, 0.3),
      //     });
      //     iconRefs.value.forEach((icon: any) => {
      //       const state = PIDStateMap.get(icon.getAttribute('aria-label') || '');
      //       if (state) {
      //         state.setPointX = state.originalX;
      //         state.setPointY = state.originalY;
      //       }
      //     });
      //   } else {
      //     gsap.to(checkboxSvg, {
      //       rotation: 0,
      //       duration: 1,
      //       ease: Elastic.easeOut.config(1, 0.3),
      //     });
      //   }
    };

    return {
      displayNavItems,
      handleClick,
      isActive,
      crazyModeToggle,
      iconRefs,
      crazyModeEnabled,
    };
  },
});
</script>

<style lang="scss" scoped>
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

  .icon-mask {
    filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 255, 255, 0.814));
    position: relative;
    width: 40px;
    height: 40px;

    &:hover {
      cursor: pointer;
      filter: brightness(1.5) drop-shadow(0 0 10px rgba(255, 255, 255, 0.814));
    }

    &:active {
      filter: drop-shadow(0 0 5px white) blur(1px);
    }
  }

  .masked-icon {
    position: absolute;
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .crazy-mode-toggle {
    display: flex;
    align-items: center;
    color: #fff;
    position: absolute;
    bottom: 0;
    margin-bottom: 0.5rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));

    input[type='checkbox'] {
      display: none;
    }

    .checkbox-svg {
      fill: transparent;
      stroke: #fff;
      width: 20px;
      height: 20px;
      transition: fill 0.3s ease;
      transition: transform 0.3s ease;

      &:hover {
        cursor: pointer;
        fill: #fff;
        transition:
          fill 0.3s ease,
          filter 0.3s ease,
          transform 0.3s ease;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        transform: scale(1.1);
      }

      &.checked {
        stroke: #fff;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        animation: glow 1s infinite alternate;
      }
    }
  }

  @keyframes glow {
    from {
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.514));
    }
    to {
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 1));
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
  @keyframes pulse {
    0% {
      transform: scale(1);
      filter: brightness(1);
    }
    20% {
      transform: scale(1.3);
      filter: brightness(1.3);
    }
    40% {
      transform: scale(1.6);
      filter: brightness(1.6);
    }
    60% {
      transform: scale(1.3);
      filter: brightness(1.3);
    }
    80% {
      transform: scale(1);
      filter: brightness(1);
    }
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
  }
}
</style>
../../utils/hoverEffects
