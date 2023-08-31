import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { calculatePID, PIDStateMap, PIDState } from './pidstate';
import { NavItem, NavItems } from './config';
import { useStore } from 'vuex';

console.log('Registering Draggable plugin with gsap');
gsap.registerPlugin(Draggable);
export function setupDraggable(
  elements: HTMLElement[],
  onDrag: (event: MouseEvent, item: NavItem, element: HTMLElement) => void,
) {
  console.log('Initializing Vuex store');
  const store = useStore();
  const draggableElements: Draggable[] = [];

  console.log('Iterating over NavItems');
  NavItems.forEach((item: NavItem) => {
    console.log(`Setting initial PIDState for NavItem ${item.ariaLabel}`);
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

    console.log(`Adding mousemove event listener for element ${element.id}`);
    element.addEventListener('mousemove', (event: MouseEvent) => {
      calculatePID(event, item, state, {}, element);
      store.commit('setTooltipText', item.ariaLabel);
    });

    console.log(`Creating Draggable for element ${element.id}`);
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
        if (
          Math.abs(this.x - state.originalX) <= 20 &&
          Math.abs(this.y - state.originalY) <= 20
        ) {
          console.log(`Element ${element.id} hit test passed, reverting`);
          this.revert();
          state.setPointX = this.x;
          state.setPointY = this.y;
          store.commit('setShowTooltip', false);
        } else {
          state.setPointX = this.x;
          state.setPointY = this.y;
        }
      },
    })[0];

    console.log(
      `Adding Draggable for element ${element.id} to draggableElements array`,
    );
    draggableElements.push(draggable);
  });

  console.log('Returning draggableElements');
  return draggableElements;
}

export function destroyDraggable(draggableElements: Draggable[]) {
  console.log('Destroying draggable elements');
  draggableElements.forEach((draggable) => {
    console.log(`Killing Draggable for element ${draggable.target.id}`);
    draggable.kill();
  });
}
