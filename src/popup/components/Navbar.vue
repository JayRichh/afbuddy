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
          <path v-if="crazyModeEnabled" d="M5 9l3 3 7-7" stroke="currentColor" fill="none" />
        </svg>
      </label>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref, inject, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { gsap, Elastic } from 'gsap';
import { mapState, mapMutations } from 'vuex';
import { Draggable } from 'gsap/Draggable';
import { NavItem } from '../../utils/config';

gsap.registerPlugin(Draggable);
export default defineComponent({
  props: {
    currentComponent: String,
  },
  setup(props, context) {
    onMounted(() => {
      setActiveIcon('ThemeSelector');
    });
    const store = useStore();
    const iconMaskStyles = inject('iconMaskStyles') as Ref<Record<string, string>>;
    const iconRefs = ref([]) as any;

    watch(iconMaskStyles, (newStyles) => {
      iconRefs.value.forEach((icon: any) => {
        const newStyle = newStyles[icon.id];
        if (newStyle) {
          const whiteIcon = icon.querySelector('.white-icon');
          whiteIcon.style.clipPath = newStyle;

          if (icon.id === 'ThemeSelector') {
            icon.classList.add('active');
          }
        }
      });
    });

    const setActiveIcon = (iconId: string) => {
      iconRefs.value.forEach((icon: any) => {
        icon.classList.remove('active');
        if (icon.id === iconId) {
          icon.classList.add('active');
        }
      });
    };

    const crazyModeEnabled = computed(() => store.state.crazyModeEnabled);
    const displayNavItems = computed(() =>
      store.state.crazyModeEnabled ? store.state.navItems : store.state.navItems.slice(1),
    );

    const handleClick = (item: NavItem) => {
      store.dispatch('updateCurrentComponent', item.componentName);
      setActiveIcon(item.id as string);
      context.emit('changeComponent', item.componentName);
    };

    const isActive = (componentName: string) => componentName === props.currentComponent;

    const crazyModeToggle = () => {
      store.commit('setCrazyModeEnabled', !store.state.crazyModeEnabled);
      // Animate
    };

    return {
      displayNavItems,
      handleClick,
      isActive,
      crazyModeToggle,
      iconRefs,
      crazyModeEnabled,
      setActiveIcon,
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

  .icon-mask {
    filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 255, 255, 0.814));
    position: relative;
    width: 40px;
    height: 40px;
    mask-position: 0% 0px;
    -webkit-mask-position: 0% 0px;

    &:hover {
      cursor: pointer;
      filter: brightness(1.5) drop-shadow(0 0 10px rgba(255, 255, 255, 0.814));
    }

    .active {
      filter: drop-shadow(0 0 5px white) blur(1px);
      background: transparent;
      mask-image: linear-gradient(-45deg, #52bcba, #f5a553, #3575b3, #061a34);
      -webkit-mask-image: linear-gradient(-45deg, #52bcba, #f5a553, #3575b3, #061a34);
      mask-size: 400% 400%;
      -webkit-mask-size: 400% 400%;
      animation: gradient 15s ease infinite;
      -webkit-animation: gradient 15s ease infinite;
    }
  }

  .masked-icon {
    position: absolute;
    width: 40px;
    height: 40px;
    object-fit: contain;
    z-index: 2;
  }
  .masked-icon.white-icon {
    clip-path: inset(0 0 0 0) !important;
    -webkit-clip-path: inset(0 0 0 0) !important;
    z-index: 2;
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
}
</style>
