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
  elements.forEach((element, index) => {
    const item = NavItems[index];
    const state = PIDStateMap.get(item.ariaLabel) as PIDState;
    const draggable = Draggable.create(element, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: document.body,
      throwProps: true,
      onDrag: function (event: MouseEvent) {
        onDrag(event, item, element);
        calculatePID(event, item, state, {}, element);
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
