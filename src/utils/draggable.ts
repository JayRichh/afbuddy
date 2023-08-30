import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { calculatePID, PIDStateMap, PIDState } from './pidstate';
import { NavItem, NavItems } from './config';
import { useStore } from 'vuex';

gsap.registerPlugin(Draggable);
export function setupDraggable(
  elements: HTMLElement[], // Array of HTML elements that should be draggable
  onDrag: (event: MouseEvent, item: NavItem, element: HTMLElement) => void, // Callback function to be called when an element is dragged
) {
  const store = useStore();
  const draggableElements: Draggable[] = []; // Array to store the Draggable instances
  elements.forEach((element, index) => {
    const item = NavItems[index]; // Get the corresponding navigation item
    const state = PIDStateMap.get(item.ariaLabel) as PIDState; // Get the state of the PID controller for the current item
    const draggable = Draggable.create(element, {
      // Create a Draggable instance for the current element
      type: 'x,y', // Enable dragging in both x and y directions
      edgeResistance: 0.65, // Resistance when dragging beyond the bounds
      bounds: document.body, // Set the bounds to the body of the document
      throwProps: true, // Enable momentum-based continuation of movement after releasing the mouse
      onDrag: function (event: MouseEvent) {
        // Function to be called when the element is dragged
        onDrag(event, item, element); // Call the provided callback function
        calculatePID(event, item, state, {}, element); // Calculate the PID controller output
        store.commit('setTooltipX', event.clientX);
        store.commit('setTooltipY', event.clientY);
        store.commit('setCurrentComponent', item.componentName);
      },
      onDragEnd: function () {
        // Function to be called when the dragging ends
        if (this.hitTest(element, 20)) {
          // If the element is within 20 pixels of the mouse pointer
          this.revert(); // Revert the element to its original position
          state.setPointX = state.originalX; // Reset the set point of the PID controller
          state.setPointY = state.originalY;
          store.commit('setShowTooltip', false);
        }
      },
    })[0];
    draggableElements.push(draggable); // Add the Draggable instance to the array
  });
  return draggableElements; // Return the array of Draggable instances
}

export function destroyDraggable(draggableElements: Draggable[]) {
  draggableElements.forEach((draggable) => {
    draggable.kill();
  });
}
