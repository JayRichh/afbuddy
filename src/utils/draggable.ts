import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { PIDStateMap, calculatePID } from '../utils/pidstate';
import { calculateDistance } from './calculations';
import { Store } from 'vuex';
import type { State } from './store/types';
import { config } from './config';

gsap.registerPlugin(Draggable);

export async function setupDraggable(store: Store<State>) {
  const elements = Array.from(document.querySelectorAll('.draggable')) as HTMLElement[];

  elements.forEach((element: HTMLElement) => {
    let hideTooltipTimeoutId: number | null = null;
    let latestEvent: MouseEvent | null = null;

    console.log('Initializing draggable element:', element.id);

    Draggable.create(element, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: window,
      throwProps: true,
      onDragStart: function () {
        const state = PIDStateMap.get(element.id);
        if (state) {
          state.setPointX = this.x;
          state.setPointY = this.y;
        }
        if (element.classList.contains('paintbrush')) {
          gsap.set(element, { transformOrigin: `${this.x}px ${this.y}px` });
        }
      },
      onDrag: function () {
        if (element.classList.contains('paintbrush')) {
          gsap.set(element, { transformOrigin: `${this.x}px ${this.y}px` });
        }
      },
      onDragEnd: function () {
        const state = PIDStateMap.get(element.id);

        if (state) {
          state.setPointX = this.x;
          state.setPointY = this.y;
        }
        if (element.classList.contains('paintbrush')) {
          gsap.set(element, { transformOrigin: `${this.x}px ${this.y}px` });
        }
      },
    });

    const updatePosition = () => {
      const state = PIDStateMap.get(element.id);

      console.log('updatePosition:', element.id, state, latestEvent);

      if (state && latestEvent) {
        const rect = element.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        console.log('calculating distance for pos update:', element.id);
        const distance = calculateDistance(state.setPointX, state.setPointY, center.x, center.y);
        console.log('calculated distance for pos update:', element.id);

        if (distance < config.maxDetachDistance) {
          console.log('Updating calculate PID:', element.id);
          calculatePID(latestEvent, element.id, state, config, element);
          console.log('Updated calculate PID:', element.id);
        }

        requestAnimationFrame(updatePosition);
      }
    };

    updatePosition();

    element.addEventListener('mousemove', async (event: MouseEvent) => {
      latestEvent = event;
      store.commit('setTooltipX', event.clientX);
      store.commit('setTooltipY', event.clientY);
      if (hideTooltipTimeoutId !== null) {
        window.clearTimeout(hideTooltipTimeoutId);
        hideTooltipTimeoutId = null;
      }
      if (!element.classList.contains('paintbrush') && !element.classList.contains('title')) {
        store.commit('setTooltipVisible', true);
      }

      const rect = element.getBoundingClientRect();
      const distance = calculateDistance(
        event.clientX,
        event.clientY,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );

      if (distance < config.maxDetachDistance) {
        const state = PIDStateMap.get(element.id);
        if (state) {
          calculatePID(
            event,
            element.id,
            state,
            { Kp: config.Kp, Ki: config.Ki, Kd: config.Kd },
            element,
          );
        }
      }

      await handleMouseMove(event, store);
    });

    element.addEventListener('mouseleave', () => {
      latestEvent = null;
      hideTooltipTimeoutId = window.setTimeout(() => {
        store.commit('setTooltipVisible', false);
      }, 200);

      const state = PIDStateMap.get(element.id);
      if (state) {
        element.style.transform = `translate(${state.originalX}px, ${state.originalY}px) scale(1)`;
      }
    });
  });
}

async function handleMouseMove(event: MouseEvent, store: Store<State>) {
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

function findClosestItem(event: MouseEvent) {
  const elements = Array.from(document.querySelectorAll('.draggable')) as HTMLElement[];

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

    return calculateDistance(event.clientX, event.clientY, prevCenter.x, prevCenter.y) <
      calculateDistance(event.clientX, event.clientY, currCenter.x, currCenter.y)
      ? prev
      : curr;
  });
}

export function destroyDraggable(draggableElements: Draggable[]) {
  draggableElements.forEach((draggable) => {
    draggable.kill();
  });
}
