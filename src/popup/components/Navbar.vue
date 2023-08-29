<template>
  <nav class="navbar">
    <a
      v-for="item in filteredNavItems"
      :if="shouldShowItem(item)"
      :key="item.id"
      ref="iconRefs"
      :class="{ selected: isActive(item.componentName) }"
      @click="handleClick($event, item)"
      @mouseenter="hoverMouse($event, item)"
      @mouseleave="onIconMouseLeave($event, item)"
      class="icon-container"
      :id="item.ariaLabel"
      :aria-label="item.ariaLabel"
    >
      <div
        class="icon-mask"
        :id="`${item.ariaLabel}-mask`"
        :aria-label="item.ariaLabel"
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
        ref="crazyModeCheckbox"
        type="checkbox"
        class="crazy-mode-checkbox"
        id="crazy-mode-checkbox"
        :aria-label="'crazy-mode-checkbox'"
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
import { defineComponent, ref, reactive, onMounted, computed } from 'vue';
import { gsap, Power2, Elastic, Bounce } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { ExpoScaleEase, RoughEase, SlowMo } from 'gsap/EasePack';
import Draggable from 'gsap/Draggable';

import { NavItem, NavItems, config, PIDState } from '../../utils/navbarConfig';
import Tooltip from './Tooltip.vue';
import { calculateDistance } from '../../utils/calculationUtils';

gsap.registerPlugin(CSSPlugin, ExpoScaleEase, RoughEase, SlowMo, Draggable);

export default defineComponent({
  components: {
    Tooltip,
  },
  props: {
    currentComponent: String,
  },

  setup(props, { emit }) {
    // ------------------------------
    // Variables
    // ------------------------------
    const iconRefs = ref<HTMLElement[]>([]);
    const position = ref({ x: 0, y: 0 });
    const crazyModeEnabled = ref(false);
    const crazyModeCheckbox = ref<HTMLInputElement | null>(null);
    const showDoomIcon = ref(false);
    const navItems = reactive<NavItem[]>(NavItems);

    let hoveredElement: HTMLElement | null = null;
    let isDragging = ref(false);

    let pidState = new Map<string, PIDState>();

    // ------------------------------
    // Lifecycle Hooks
    onMounted(() => {
      iconRefs.value = iconRefs.value.map((ref) => ref as HTMLElement);


  // Make the icons draggable
  iconRefs.value.forEach((icon) => {
    const originalPosition = { x: icon.offsetLeft, y: icon.offsetTop };

    Draggable.create(icon, {
      type: "x,y",
      edgeResistance: 0.65,
      bounds: "body",
      onDragEnd: function() {
        const distance = calculateDistance(
          this.x - originalPosition.x,
          this.y - originalPosition.y,
          0,
          0
        );

        if (distance > 20) { // If the distance is more than 20px
          gsap.to(this.target, { // Animate the icon back to its original position
            x: originalPosition.x,
            y: originalPosition.y,
            duration: 0.5,
            ease: "power1.out"
          });
        }
      }
    });
  });

    // ------------------------------
    // Methods
    /** @param el - Adds an HTMLElement to iconRefs.
     */
    const addIconRef = (el: HTMLElement) => {
      if (el) {
        iconRefs.value.push(el);
      }
    };

    /** @param componentName - Checks if a component is active.
     */
    const isActive = (componentName: string) => {
      return componentName === props.currentComponent;
    };

    /** @param componentName - Emits a changeComponent event.
     */
    const showComponent = (componentName: string) => {
      emit('changeComponent', componentName);
    };

    /** @param item - Checks if an item should be shown
     */
    const shouldShowItem = (item: NavItem) => {
      return item.componentName !== 'DoomPlayer' || showDoomIcon.value;
    };

    /** @returns {NavItem[]} An array of filtered navigation items.
     */
    const filteredNavItems = computed(() => {
      return navItems.filter(
        (item) => !item.crazyMode || crazyModeEnabled.value,
      );
    });

    /** @param event - The MouseEvent object.
     * @param item - Handles click event on navigation items.
     */
    const handleClick = (event: MouseEvent, item: NavItem) => {
      event.preventDefault();
      emit('updateTooltipText', item.ariaLabel);

      navItems.forEach((navItem) => {
        navItem.selected = navItem.id === item.id;
      });
      if (!isDragging.value) {
        showComponent(item.componentName);
      }
    };

    /** @param event - The MouseEvent object.
     * @param item - Handles mouse hover event on navigation items.
     */
    const hoverMouse = (event: MouseEvent, item: NavItem) => {
      const distance = calculateDistance(
        event.clientX,
        event.clientY,
        item.position.x,
        item.position.y,
      );
      if (distance < 50) {
        applyMagneticEffect(event, item);
      }
      const tooltip = document.querySelector('.tooltip') as HTMLElement;
      if (tooltip) {
        tooltip.style.visibility = 'visible';
      }
    };

    /** @param event - The MouseEvent object.
     * @param item - Handles mouse enter event on navigation items.
     */
    const onIconMouseEnter = (event: MouseEvent, item: NavItem) => {
      hoveredElement = event.target as HTMLElement;
      document.addEventListener('mousemove', (e) =>
        applyMagneticEffect(e, item),
      );
      emit('updateTooltipText', item.ariaLabel);
    };

    /** @param ariaLabel - Animates an icon.
     */
    const animateIcon = (ariaLabel: string) => {
      const icon = document.querySelector(`a[aria-label='${ariaLabel}']`);
      if (icon) {
        const animationClass = getAnimationClass(ariaLabel);
        icon.classList.add(animationClass);
        setTimeout(() => {
          icon.classList.remove(animationClass);
        }, 3000);
      }
    };
    /**@param ariaLabel - Returns the animation class for an icon.
     */
    const getAnimationClass = (ariaLabel: string): string => {
      const animationMap = {
        Themes: 'paintbrushFlick',
        Formatting: 'pyramidRoll',
        'Code Editor': 'wheelSpin',
        Geolocation: 'markerPulse',
        'User Agents': 'magnifyZoom',
        Doom: 'gamePulse',
        Info: 'infoAwesome',
      } as Record<string, string>;

      return animationMap[ariaLabel] || '';
    };

    // ------------------------------
    /** @param event - The MouseEvent object.
     * @param item - Applies a magnetic effect to an icon.
     */
    const applyMagneticEffect = (event: MouseEvent, item: NavItem | string) => {
      if (!crazyModeEnabled.value) {
        const ariaLabel = typeof item === 'string' ? item : item.ariaLabel;
        const icon = document.querySelector(
          `a[aria-label='${ariaLabel}']`,
        ) as HTMLElement;

        if (icon) {
          const rect = icon.getBoundingClientRect();
          let errorX = event.clientX - rect.left - rect.width / 2;
          let errorY = event.clientY - rect.top - rect.height / 2;
          const distance = calculateDistance(errorX, errorY, 0, 0);

          let state = pidState.get(ariaLabel);
          if (!state) {
            state = {
              integralX: 0,
              integralY: 0,
              previousErrorX: 0,
              previousErrorY: 0,
              originalX: rect.left + rect.width / 2,
              originalY: rect.top + rect.height / 2,
              setPointX: rect.left + rect.width / 2,
              setPointY: rect.top + rect.height / 2,
            };
            pidState.set(ariaLabel, state);
          }
          const detachThreshold = config.maxDetachDistance;
          const maxDetachDistance = config.maxDetachDistance;
          const maxMovement = config.maxMovement;
          const Kp = config.Kp;
          const Ki = config.Ki;
          const Kd = config.Kd;

          if (distance > detachThreshold) {
            errorX = state.setPointX - rect.left - rect.width / 2;
            errorY = state.setPointY - rect.top - rect.height / 2;
          }

          if (distance > maxDetachDistance) {
            state.setPointX = state.originalX;
            state.setPointY = state.originalY;
            icon.style.transform = `translate(${state.originalX}px, ${state.originalY}px) scale(1)`;
            return;
          }

          const KpScaled = Kp * (distance / maxDetachDistance); // sticktion
          const KiScaled = Ki * (distance / maxDetachDistance); // sticktion
          const KdScaled = Kd * (distance / maxDetachDistance); // sticktion

          if (
            Math.abs(errorX) > maxMovement ||
            Math.abs(errorY) > maxMovement
          ) {
            state.setPointX = state.originalX;
            state.setPointY = state.originalY;
            icon.style.transform = `translate(${state.originalX}px, ${state.originalY}px) scale(1)`;
            return;
          }

          const proportionalX = Kp * errorX;
          const proportionalY = Kp * errorY;
          state.integralX += Ki * errorX;
          state.integralY += Ki * errorY;
          const derivativeX = Kd * (errorX - state.previousErrorX);
          const derivativeY = Kd * (errorY - state.previousErrorY);
          const dx = proportionalX + state.integralX + derivativeX;
          const dy = proportionalY + state.integralY + derivativeY;

          state.previousErrorX = errorX;
          state.previousErrorY = errorY;
          state.setPointX += dx;
          state.setPointY += dy;
          icon.style.transform = `translate(${state.setPointX}px, ${state.setPointY}px) scale(1.1)`;
        }
      }
    };

    /**  Toggles crazy mode.
     */
    const crazyModeToggle = () => {
      showDoomIcon.value = crazyModeEnabled.value;
      if (crazyModeEnabled.value) {
        gsap.to('.icon-container', {
          scale: 0.8,
          ease: Elastic.easeOut.config(1, 0.3),
        });
      } else {
        gsap.to('.icon-container', {
          scale: 0.9,
          ease: Elastic.easeOut.config(1, 0.3),
        });
      }
    };

    const onIconMouseLeave = (event: MouseEvent, item: NavItem) => {
      hoveredElement = null;
      const applyMagneticEffectListener = (e: MouseEvent) =>
        applyMagneticEffect(e, item);
      document.addEventListener('mousemove', applyMagneticEffectListener);
    };

    const resetStyles = () => {
      const icons = document.querySelectorAll('.icon-container') as NodeListOf<
        | HTMLElement
        | SVGElement
        | Element
        | any
        | null
        | undefined
        | unknown
        | never
        | void
      >;
      icons.forEach((icon) => {
        icon.style.transform = `translate(0px, 0px)`;
        icon.style.width = `0px`;
        icon.style.height = `0px`;
      });
    };

    return {
      position,
      crazyModeEnabled,
      crazyModeCheckbox,
      crazyModeToggle,
      iconRefs,
      addIconRef,
      navItems,
      animateIcon,
      getAnimationClass,
      isActive,
      showComponent,
      handleClick,
      applyMagneticEffect,
      hoverMouse,
      onIconMouseEnter,
      onIconMouseLeave,
      showDoomIcon,
      shouldShowItem,
      filteredNavItems,
    };
  },
});
</script>

<style lang="scss" scoped>
.icon-container {
  mask-image: linear-gradient(to right, white 50%, black 50%);
  mask-size: 200% 100%;
  mask-position: 100% 0;
}
.hidden {
  display: none;
}
.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-right: 1px solid #dddddde1;
  overflow-x: visible;
  overflow-y: visible;
  margin: 0;
  padding: 10px 0;
  height: 100%;
  width: 50px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scrollbar-color: transparent transparent;

  .icon-mask {
    filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 255, 255, 0.814));
    transition:
      filter 0.3s ease,
      transform 0.1s ease;
    z-index: 100000000;
    position: relative;
    width: 40px;
    height: 40px;

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
    margin-bottom: 12px;
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
        transform: rotate(360deg);
        transition: transform 0.3s ease;
        stroke: #fff;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        animation: glow 1s infinite alternate;
      }
    }
  }

  @keyframes glow {
    from {
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.6));
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
