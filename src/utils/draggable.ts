import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { calculatePID, PIDState } from './pidstate';
import { NavItems, calculateDistance } from './config';
import { Store } from 'vuex';

gsap.registerPlugin(Draggable);

export function setupDraggable(store: Store<any>) {
  const elements = Array.from(
    document.querySelectorAll('.draggable'),
  ) as HTMLElement[];

  elements.forEach((element: HTMLElement) => {
    const item = NavItems.find((item) => item.id === element.id);
    if (!item) {
      throw new Error(`Could not find item with id: ${element.id}`);
    }

    let state = store.getters.getPIDState(item.ariaLabel);
    if (!state) {
      store.dispatch('initializePIDState', item);
      state = store.getters.getPIDState(item.ariaLabel);
    }

    attachMouseMoveListener(element, (event) => {
      calculatePID(event, item, state, {}, element);
      handleMagneticEffect(event, state, element);
      store.commit('setTooltipText', item.ariaLabel);
      store.commit('setTooltipX', event.clientX);
      store.commit('setTooltipY', event.clientY);
      store.commit('setCurrentComponent', item.componentName);
    });
  });
}

function handleMagneticEffect(
  event: MouseEvent,
  state: PIDState,
  element: HTMLElement,
) {
  const distance = calculateDistance(
    event.clientX,
    event.clientY,
    state.setPointX,
    state.setPointY,
  );
  if (distance <= 20) {
    gsap.to(element, { x: event.clientX, y: event.clientY, duration: 0.5 });
  }
}

function attachMouseMoveListener(
  element: HTMLElement,
  handler: (event: MouseEvent) => void,
) {
  element.addEventListener('mousemove', handler);
}

// function handleDragEnd(draggable: Draggable, state: PIDState) {
//   const distanceX = Math.abs(draggable.x - state.originalX);
//   const distanceY = Math.abs(draggable.y - state.originalY);
//   if (distanceX > 20 || distanceY > 20) {
//     const rubberBandX = (1.0 - 1.0 / ((distanceX * 0.55) / 640 + 1.0)) * 640;
//     const rubberBandY = (1.0 - 1.0 / ((distanceY * 0.55) / 640 + 1.0)) * 640;
//     gsap.to(draggable.target, {
//       x: rubberBandX,
//       y: rubberBandY,
//       duration: 0.5,
//     });
//     state.setPointX = rubberBandX;
//     state.setPointY = rubberBandY;
//   } else {
//     state.setPointX = draggable.x;
//     state.setPointY = draggable.y;
//   }
// }

export function destroyDraggable(draggableElements: Draggable[]) {
  draggableElements.forEach((draggable) => {
    draggable.kill();
  });
}
