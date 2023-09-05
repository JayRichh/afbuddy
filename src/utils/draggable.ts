import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { PIDStateMap, calculatePID, initialPIDState } from '../utils/pidstate';
import { calculateDistance } from './calculations';
import { Store } from 'vuex';
import type { State } from './store/types';
import { config } from './config';

gsap.registerPlugin(Draggable);

export async function setupDraggable(store: Store<State>) {
  const elements = Array.from(
    document.querySelectorAll('.draggable'),
  ) as HTMLElement[];
  let latestEvent: MouseEvent | null = null;

  elements.forEach((element: HTMLElement) => {
    Draggable.create(element, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: window,
      throwProps: true,
      onDragStart: function () {
        let state = PIDStateMap.get(element.getAttribute('aria-label') || '');
        console.log('state', state);
        if (!state) {
          state = { ...initialPIDState };
          PIDStateMap.set(element.id, state);
        }
        state.originalX = this.x;
        state.originalY = this.y;

        state.setPointX = this.x;
        state.setPointY = this.y;
        if (element.classList.contains('paintbrush')) {
          gsap.set(element, {
            transformOrigin: `${this.x}px ${this.y}px`,
            animation: 'none',
          });
        }
      },
      onDrag: function () {
        const state = PIDStateMap.get(element.getAttribute('aria-label') || '');
        if (state) {
          state.setPointX = this.x;
          state.setPointY = this.y;
        }

        if (element.classList.contains('paintbrush')) {
          gsap.set(element, {
            transformOrigin: `${this.x}px ${this.y}px`,
            animation: 'throwBrush 1s ease forwards',
          });
        }
      },
      onDragEnd: function () {
        const state = PIDStateMap.get(element.getAttribute('aria-label') || '');

        if (state) {
          state.setPointX = this.x;
          state.setPointY = this.y;
          // Reset
          // state.originalX = this.x;
          // state.originalY = this.y;
        }

        if (element.classList.contains('paintbrush')) {
          gsap.set(element, {
            transformOrigin: `${this.x}px ${this.y}px`,
            animation:
              'rockBrush 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
          });
        }
      },
    });

    const updatePosition = () => {
      const state = PIDStateMap.get(element.getAttribute('aria-label') || '');
      console.log('state updatepos', state);
      if (state && latestEvent) {
        const rect = element.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        const distance = calculateDistance(
          state.setPointX,
          state.setPointY,
          center.x,
          center.y,
        );
        if (distance < 20) {
          calculatePID(latestEvent, state, config, element);
        }
        requestAnimationFrame(updatePosition);
      }
    };

    updatePosition();

    element.addEventListener('mousemove', async (event: MouseEvent) => {
      latestEvent = event;

      if (
        !element.classList.contains('no-tooltip') &&
        element.classList.contains('navicon')
      ) {
        store.commit('setTooltipVisible', true);
      }
      const rect = element.getBoundingClientRect();
      const distance = calculateDistance(
        event.clientX,
        event.clientY,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      if (distance < 20) {
        const state = PIDStateMap.get(element.getAttribute('aria-label') || '');
        if (state) {
          state.setPointX = state.originalX; // Reset
          state.setPointY = state.originalY; // Reset
        }
        const item = findClosestItem(event);
        if (item) {
          store.dispatch('updateTooltip', {
            text: item.ariaLabel,
            x: event.clientX,
            y: event.clientY,
            visible: true,
          });
        }
      }
    });

    let hideTooltipTimeoutId: number | undefined;
    element.addEventListener('mouseleave', () => {
      latestEvent = null;

      if (hideTooltipTimeoutId !== undefined) {
        window.clearTimeout(hideTooltipTimeoutId);
      }
      hideTooltipTimeoutId = window.setTimeout(() => {
        store.commit('setTooltipVisible', false);
      }, 200);
      const state = PIDStateMap.get(element.getAttribute('aria-label') || '');
      if (state) {
        element.style.transform = `translate(${state.originalX}px, ${state.originalY}px) scale(1)`;
      }
    });
  });
}
function findClosestItem(event: MouseEvent) {
  const elements = Array.from(
    document.querySelectorAll('.draggable'),
  ) as HTMLElement[];

  return elements.reduce((prev, curr) => {
    const prevRect = prev.getBoundingClientRect();
    const currRect = curr.getBoundingClientRect();

    const prevCenter = {
      x: prevRect.left + prevRect.width / 2,
      y: prevRect.top + prevRect.height / 2,
    };
    const currCenter = {
      x: currRect.left + currRect.width / 2,
      y: currRect.top + currRect.height / 2,
    };

    return calculateDistance(
      event.clientX,
      event.clientY,
      prevCenter.x,
      prevCenter.y,
    ) < calculateDistance(event.clientX, event.clientY, currCenter.x, currCenter.y)
      ? prev
      : curr;
  });
}

export function destroyDraggable(draggableElements: Draggable[]) {
  draggableElements.forEach((draggable) => {
    draggable.kill();
  });
}
