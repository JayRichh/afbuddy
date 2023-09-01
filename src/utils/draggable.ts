/* eslint-disable @typescript-eslint/no-unused-vars */
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { calculatePID, PIDStateMap, PIDState } from './pidstate';
import { NavItem, NavItems } from './config';
import { useStore, Store } from 'vuex';
import store from './store';

gsap.registerPlugin(Draggable);

export function setupDraggable(elements: HTMLElement[], store: Store<any>) {
  const draggableElements: Draggable[] = [];

  elements.forEach((element) => {
    const item = NavItems.find(
      (item) =>
        item.id === element.id ||
        element.classList.contains('draggable') ||
        element.classList.contains('magnetic'),
    );
    if (!item) {
      console.error(`Item not found for ${element.id}`);
      return;
    }

    const state = PIDStateMap.get(item.ariaLabel) || initializePIDState(item);
    if (!state) {
      console.error(`State not found for ${item.ariaLabel}`);
      return;
    }

    attachMouseMoveListener(element, (event) => {
      calculatePID(event, item, state, {}, element);
      store.commit('setTooltipText', item.ariaLabel);
    });

    attachMouseHoverListener(element, state);

    const onDrag = (
      event: MouseEvent,
      item: NavItem,
      _element: HTMLElement,
    ) => {
      store.commit('setTooltipX', event.clientX);
      store.commit('setTooltipY', event.clientY);
      store.commit('setCurrentComponent', item.componentName);
    };

    const draggable = createDraggable(element, item, state, store);
    draggableElements.push(draggable);
  });

  return draggableElements;
}

function initializePIDState(item: NavItem): PIDState | null {
  const initialState: PIDState = {
    originalX: 0,
    originalY: 0,
    previousErrorX: 0,
    previousErrorY: 0,
    setPointX: 0,
    setPointY: 0,
    integralX: 0,
    integralY: 0,
  };
  PIDStateMap.set(item.ariaLabel, initialState);
  return PIDStateMap.get(item.ariaLabel) || null;
}

function attachMouseMoveListener(
  element: HTMLElement,
  handler: (event: MouseEvent) => void,
) {
  element.addEventListener('mouseover', handler);
}

function attachMouseHoverListener(element: HTMLElement, state: PIDState) {
  element.addEventListener('mouseover', function () {
    gsap.to(element, {
      x: state.setPointX + 10,
      y: state.setPointY + 10,
      duration: 0.5,
    });
  });
}

function createDraggable(
  element: HTMLElement,
  item: NavItem,
  state: PIDState,
  store: Store<any>,
): Draggable {
  const onDrag = (event: MouseEvent, item: NavItem, _element: HTMLElement) => {
    store.commit('setTooltipX', event.clientX);
    store.commit('setTooltipY', event.clientY);
    store.commit('setCurrentComponent', item.componentName);
    store.commit('setTooltipText', item.ariaLabel);
    store.commit('setTooltipVisible', true);
  };

  element.addEventListener('mouseover', function () {
    store.commit('setShowTooltip', true);
  });

  element.addEventListener('mouseout', function () {
    store.commit('setShowTooltip', false);
  });

  return Draggable.create(element, {
    type: 'x,y',
    edgeResistance: 0.65,
    bounds: document.body,
    throwProps: true,
    onDrag: function (event: MouseEvent) {
      onDrag(event, item, element);
      calculatePID(event, item, state, {}, element);
    },
    onDragEnd: function (this: Draggable) {
      handleDragEnd(this, state);
    },
    snap: {
      x: function (endValue) {
        return Math.round(endValue / 50) * 50;
      },
      y: function (endValue) {
        return Math.round(endValue / 50) * 50;
      },
    },
  })[0];
}

function handleDragEnd(draggable: Draggable, state: PIDState) {
  const distanceX = Math.abs(draggable.x - state.originalX);
  const distanceY = Math.abs(draggable.y - state.originalY);
  if (distanceX > 20 || distanceY > 20) {
    const rubberBandX = (1.0 - 1.0 / ((distanceX * 0.55) / 640 + 1.0)) * 640;
    const rubberBandY = (1.0 - 1.0 / ((distanceY * 0.55) / 640 + 1.0)) * 640;
    gsap.to(draggable.target, {
      x: rubberBandX,
      y: rubberBandY,
      duration: 0.5,
    });
    state.setPointX = rubberBandX;
    state.setPointY = rubberBandY;
  } else {
    state.setPointX = draggable.x;
    state.setPointY = draggable.y;
  }
}

export function destroyDraggable(draggableElements: Draggable[]) {
  draggableElements.forEach((draggable) => {
    draggable.kill();
  });
}
