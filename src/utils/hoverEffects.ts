import { PIDStateMap, calculatePID } from './pidstate';
import { config } from './config';
import type { State } from './store/types';
import { Store } from 'vuex';

export function setupHoverEffects(store: Store<State>) {
  let latestEvent: MouseEvent | null = null;

  const updatePosition = () => {
    if (latestEvent) {
      const element = document.elementFromPoint(latestEvent.clientX, latestEvent.clientY);
      const draggableElement = element?.closest('.draggable') as HTMLElement | null;

      if (draggableElement) {
        const state = PIDStateMap.get(draggableElement.getAttribute('aria-label') || '');
        if (state) {
          const updatedState = calculatePID(latestEvent, state, config, draggableElement);
          store.commit('updatePIDState', {
            ariaLabel: draggableElement.getAttribute('aria-label') || '',
            pidState: updatedState,
          });
          store.dispatch('updateTooltip', {
            text: draggableElement.getAttribute('aria-label') || '',
            x: latestEvent.clientX,
            y: latestEvent.clientY,
            visible: true,
          });
        }
      }
    }
    requestAnimationFrame(updatePosition);
  };

  updatePosition();

  document.addEventListener('mousemove', (event: MouseEvent) => {
    latestEvent = event;
  });

  document.addEventListener('mouseleave', () => {
    store.dispatch('updateTooltip', {
      text: '',
      x: 0,
      y: 0,
      visible: false,
    });
  });
}
