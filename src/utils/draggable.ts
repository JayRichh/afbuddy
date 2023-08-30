import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { calculatePID, PIDStateMap, PIDState } from './pidstate';
import { NavItem, NavItems } from './config';
import { useStore } from 'vuex';

gsap.registerPlugin(Draggable);
export function setupDraggable(
  elements: HTMLElement[],
  onDrag: (event: MouseEvent, item: NavItem, element: HTMLElement) => void,
) {
  const store = useStore();
  const draggableElements: Draggable[] = [];

  NavItems.forEach((item: NavItem) => {
    PIDStateMap.set(item.ariaLabel, {
      originalX: 0,
      originalY: 0,
      previousErrorX: 0,
      previousErrorY: 0,
      setPointX: 0,
      setPointY: 0,
      integralX: 0,
      integralY: 0,
    });
    const element = elements.find((el) => el.id === item.id);
    if (!element) {
      console.error(`Element for item ${item.id} is not found`);
      return;
    }
    const state = PIDStateMap.get(item.ariaLabel) as PIDState;
    if (!state) {
      console.error(`State for item ${item.ariaLabel} is undefined`);
      return;
    }

    element.addEventListener('mousemove', (event: MouseEvent) => {
      calculatePID(event, item, state, {}, element);
      store.commit('setTooltipText', item.ariaLabel);
    });

    const draggable = Draggable.create(element, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: document.body,
      throwProps: true,
      onDrag: function (event: MouseEvent) {
        onDrag(event, item, element);
        store.commit('setTooltipX', event.clientX);
        store.commit('setTooltipY', event.clientY);
        store.commit('setCurrentComponent', item.componentName);
      },
      onDragEnd: function () {
        if (this.hitTest(element, 20)) {
          this.revert();
          state.setPointX = state.originalX;
          state.setPointY = state.originalY;
          store.commit('setShowTooltip', false);
        }
      },
    })[0];

    draggableElements.push(draggable);
  });

  return draggableElements;
}

export function destroyDraggable(draggableElements: Draggable[]) {
  draggableElements.forEach((draggable) => {
    draggable.kill();
  });
}
