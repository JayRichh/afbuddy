import { Ref } from 'vue';
import { Store } from 'vuex';
import type { State } from './store/types';
// import { throttle } from 'lodash';

export function handleEvent(
  event: Event,
  store: Store<State>,
  currentElement: Ref<HTMLElement | null>,
  isLatched: Ref<boolean>,
  originalElementCenterX: Ref<number>,
  originalElementCenterY: Ref<number>,
  isSelectElement: Ref<boolean>,
  resetToOriginalPosition: (element: HTMLElement) => void,
  updateOriginalCenterPosition: (element: HTMLElement) => void,
  getElement: (event: MouseEvent, isSelect: boolean) => HTMLElement | null,
  isMouseOutsideWindow: (event: MouseEvent) => boolean,
  dispatchUpdateTooltip: (element: HTMLElement, event: MouseEvent, isVisible: boolean) => void,
  saveOriginalPositionIfAbsent: (element: HTMLElement) => void,
  updatePositionToMouse: (element: HTMLElement, event: MouseEvent) => void,
  isWithinMagnetRadius: (element: HTMLElement, event: MouseEvent) => boolean,
) {
  switch (event.type) {
    case 'mouseenter': {
      const element = getElement(event as MouseEvent, false);
      const selectElement = getElement(event as MouseEvent, true);

      if (element) {
        updateOriginalCenterPosition(element);
        if (!isLatched.value) {
          currentElement.value = element;
          isLatched.value = true;
          updatePositionToMouse(element, event as MouseEvent);
          saveOriginalPositionIfAbsent(element);
        }
      }

      if (selectElement && !isLatched.value) {
        selectElement.style.cursor = 'pointer';
        isSelectElement.value = true;
        store.dispatch('applySelectedTheme');
        saveOriginalPositionIfAbsent(selectElement);
        currentElement.value = selectElement;
      }
      break;
    }

    case 'mousemove': {
      if (isMouseOutsideWindow(event as MouseEvent)) {
        if (currentElement.value) {
          resetToOriginalPosition(currentElement.value);
          dispatchUpdateTooltip(currentElement.value as HTMLElement, event as MouseEvent, false);
          isLatched.value = false;
          currentElement.value = null;
        }
        break;
      }

      const movingElement = getElement(event as MouseEvent, false) as HTMLElement;
      if (movingElement && movingElement !== currentElement.value) {
        dispatchUpdateTooltip(currentElement.value as HTMLElement, event as MouseEvent, true);
        saveOriginalPositionIfAbsent(movingElement);
        currentElement.value = movingElement;
      }

      if (isLatched.value && currentElement.value) {
        saveOriginalPositionIfAbsent(currentElement.value);
        updatePositionToMouse(currentElement.value, event as MouseEvent);
        dispatchUpdateTooltip(currentElement.value as HTMLElement, event as MouseEvent, true);
      }
      break;
    }

    case 'mouseout': {
      if (isMouseOutsideWindow(event as MouseEvent)) {
        if (currentElement.value) {
          resetToOriginalPosition(currentElement.value);
          dispatchUpdateTooltip(currentElement.value as HTMLElement, event as MouseEvent, false);
          isLatched.value = false;
          currentElement.value = null;
        }
        break;
      }

      if (
        currentElement.value &&
        !isWithinMagnetRadius(currentElement.value, event as MouseEvent)
      ) {
        resetToOriginalPosition(currentElement.value);
        dispatchUpdateTooltip(currentElement.value as HTMLElement, event as MouseEvent, false);
        isLatched.value = false;
        currentElement.value = null;
      }
      break;
    }

    case 'mouseleave': {
      if (isMouseOutsideWindow(event as MouseEvent)) {
        if (currentElement.value) {
          resetToOriginalPosition(currentElement.value);
          dispatchUpdateTooltip(currentElement.value as HTMLElement, event as MouseEvent, false);
          isLatched.value = false;
          currentElement.value = null;
        }
        break;
      }

      if (
        currentElement.value &&
        !isWithinMagnetRadius(currentElement.value, event as MouseEvent)
      ) {
        resetToOriginalPosition(currentElement.value);
        store.dispatch('updateTooltip', {
          text: '',
          x: 0,
          y: 0,
          visible: false,
          isCodeEditorPreview: false,
        });
      }
      break;
    }
  }
}
