import { Draggable } from 'gsap/Draggable';
import { Store } from 'vuex';
import type { State } from './store/types';
import { initialPIDState } from './pidstate';

export function setupDraggable(store: Store<State>) {
  const elements = Array.from(document.querySelectorAll('.draggable')) as HTMLElement[];

  elements.forEach((element: HTMLElement) => {
    Draggable.create(element, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: window,
      throwProps: true,
      onDragStart: function () {
        let state = store.getters.getPIDState(element.getAttribute('aria-label') || '');
        if (!state) {
          state = { ...initialPIDState };
          store.commit('setPIDState', {
            ariaLabel: element.getAttribute('aria-label') || '',
            pidState: state,
          });
        }
        store.commit('updatePIDState', {
          ariaLabel: element.getAttribute('aria-label') || '',
          pidState: {
            ...state,
            originalX: this.x,
            originalY: this.y,
            setPointX: this.x,
            setPointY: this.y,
          },
        });
      },
      onDrag: function () {
        const state = store.getters.getPIDState(element.getAttribute('aria-label') || '');
        if (state) {
          store.commit('updatePIDState', {
            ariaLabel: element.getAttribute('aria-label') || '',
            pidState: {
              ...state,
              setPointX: this.x,
              setPointY: this.y,
            },
          });
        }
      },
      onDragEnd: function () {
        const state = store.getters.getPIDState(element.getAttribute('aria-label') || '');
        if (state) {
          store.commit('updatePIDState', {
            ariaLabel: element.getAttribute('aria-label') || '',
            pidState: {
              ...state,
              setPointX: this.x,
              setPointY: this.y,
            },
          });
        }
      },
    });
  });
}
