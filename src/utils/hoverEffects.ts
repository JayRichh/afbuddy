import { Ref, ref } from 'vue';
import { gsap, Sine } from 'gsap';
import { Store } from 'vuex';
import type { State } from './store/types';
import { config } from './config';
// import { throttle } from 'lodash';

export function setupHoverEffects(store: Store<State>, document: HTMLBodyElement) {
  const originalPositions = new Map<HTMLElement, { x: number; y: number }>();
  const currentElement: Ref<HTMLElement | null> = ref(null);
  const isLatched: Ref<boolean> = ref(false);
  const originalElementCenterX: Ref<number> = ref(0);
  const originalElementCenterY: Ref<number> = ref(0);
  const isSelectElement: Ref<boolean> = ref(false);

  const resetToOriginalPosition = (element: HTMLElement) => {
    if (originalPositions.has(element)) {
      const { x, y } = originalPositions.get(element)!;
      gsap.to(element, {
        x: x,
        y: y,
        duration: 0.1,
        ease: Sine.easeInOut,
        onUpdate: () => {
          checkAndUpdateMasks(element);
        },
        onComplete: () => {
          checkAndUpdateMasks(element);
          //reset element to original position
          gsap.set(element, {
            x: x,
            y: y,
          });
          store.dispatch('updateTooltip', {
            text: '',
            x: 0,
            y: 0,
            visible: false,
            isCodeEditorPreview: false,
          });
        },
      });

      isLatched.value = false;
      currentElement.value = null;
      isSelectElement.value = false;
    }
  };

  const updateOriginalCenterPosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    originalElementCenterX.value = rect.left + rect.width / 2;
    originalElementCenterY.value = rect.top + rect.height / 2;
  };

  const getElement = (event: MouseEvent, isSelect: boolean) => {
    const elements = document.querySelectorAll<HTMLElement>(isSelect ? 'select' : '.magnet');
    let targetElement = null as HTMLElement | null;

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        targetElement = element;
      }
    });

    return targetElement;
  };

  const checkAndUpdateMasks = (element: HTMLElement) => {
    const rect = element?.getBoundingClientRect();

    const rightEdge = rect?.right ?? 0;
    const boundary = 60;
    const offset = -10;

    const exposure = Math.max(0, rightEdge - boundary - offset);

    const totalWidth = (rect?.width ?? 0) - offset;

    const peelPercent = totalWidth ? (exposure / totalWidth) * 100 : 0;

    const peelOffset = peelPercent + (peelPercent / totalWidth) * 15;

    const ariaLabel = element?.getAttribute('aria-label');
    const blackMask = document?.querySelector(`#${ariaLabel}mask`) as HTMLElement;
    const whiteMask = document?.querySelector(`#${ariaLabel}`) as HTMLElement;
    if (blackMask && whiteMask) {
      blackMask.style.clipPath = `inset(0 0 0 ${100 - peelOffset}%)`;
      whiteMask.style.clipPath = `inset(0 ${peelOffset}% 0 0)`;
    }
  };

  const updatePositionToMouse = (element: HTMLElement, event: MouseEvent) => {
    if (!isLatched || !element) {
      return;
    }

    const { clientX: x, clientY: y } = event;
    const deltaX = x - originalElementCenterX.value;
    const deltaY = y - originalElementCenterY.value;

    if (
      Math.abs(deltaX) <= config.magnetRadius.right &&
      Math.abs(deltaY) <= config.magnetRadius.bottom
    ) {
      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.1,
        ease: Sine.easeInOut,
        onUpdate: () => {
          checkAndUpdateMasks(element);
        },
        onComplete: () => {
          checkAndUpdateMasks(element);
        },
      });
    } else {
      resetToOriginalPosition(element);
    }
  };

  const isWithinMagnetRadius = (element: HTMLElement, event: MouseEvent) => {
    const { clientX: x, clientY: y } = event;
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;

    const deltaX = x - elementCenterX;
    const deltaY = y - elementCenterY;

    return (
      Math.abs(deltaX) <= config.magnetRadius.right &&
      Math.abs(deltaY) <= config.magnetRadius.bottom
    );
  };

  const saveOriginalPositionIfAbsent = (element: HTMLElement) => {
    if (!originalPositions.has(element)) {
      const x = gsap.getProperty(element, 'x');
      const y = gsap.getProperty(element, 'y');
      originalPositions.set(element, { x: x as number, y: y as number });
    }
  };

  const isMouseOutsideWindow = (event: MouseEvent) => {
    const { clientX: x, clientY: y } = event;
    return x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight;
  };
  const dispatchUpdateTooltip = (element: HTMLElement, event: MouseEvent, isVisible: boolean) => {
    const { clientX: x, clientY: y } = event;
    if (!element) {
      return;
    }

    let adjustedX = x;
    let adjustedY = y;
    let tooltipText = '';
    // let fontStyling = '';

    if (element.id === 'theme-selector') {
      adjustedX = x - element.offsetWidth / 2;

      const estimatedTooltipHeight = 170;
      adjustedY = y - estimatedTooltipHeight;
    }

    if (element.id === 'font-selector') {
      const selectedFont = store.state.font;
      tooltipText = `${selectedFont}`;
      // fontStyling = `font-family: ${selectedFont};`;
    } else {
      tooltipText = element.getAttribute('tooltip-text') || '';
    }

    const currentTooltipX = store.state.tooltipX ?? 0;
    const currentTooltipY = store.state.tooltipY ?? 0;

    const diffX = adjustedX - currentTooltipX;
    const diffY = adjustedY - currentTooltipY;

    gsap.to(store.state, {
      tooltipX: `+=${diffX}`,
      tooltipY: `+=${diffY}`,
      duration: 0.1,
      ease: Sine.easeInOut,
      onUpdate: () => {
        if (store.state.tooltipX !== adjustedX || store.state.tooltipY !== adjustedY) {
          store.dispatch('updateTooltip', {
            text: isVisible ? tooltipText : '',
            x: adjustedX,
            y: adjustedY,
            visible: isVisible,
            isCodeEditorPreview: element.id === 'theme-selector',
            // style: fontStyling,
          });
        }
      },
      onComplete: () => {
        store.dispatch('updateTooltip', {
          text: isVisible ? tooltipText : '',
          x: adjustedX,
          y: adjustedY,
          visible: isVisible,
          isCodeEditorPreview: element.id === 'theme-selector',
          // style: fontStyling,
        });
      },
    });
  };

  const handleEvent = (event: Event) => {
    switch (event.type) {
      case 'mouseenter': {
        const element = getElement(event as MouseEvent, false);
        const selectElement = getElement(event as MouseEvent, true);

        if (element) {
          updateOriginalCenterPosition(element);
          if (!isLatched.value) {
            checkAndUpdateMasks(currentElement.value as HTMLElement);
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
          dispatchUpdateTooltip(selectElement, event as MouseEvent, true);
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
          if (movingElement.getBoundingClientRect()) {
            const rect = movingElement?.getBoundingClientRect();
            originalElementCenterX.value = rect?.left + rect?.width / 2;
            originalElementCenterY.value = rect?.top + rect?.height / 2;
          }
          dispatchUpdateTooltip(currentElement.value as HTMLElement, event as MouseEvent, true);
          saveOriginalPositionIfAbsent(movingElement);
          checkAndUpdateMasks(movingElement);
          currentElement.value = movingElement;
        }

        if (isLatched.value && currentElement.value) {
          saveOriginalPositionIfAbsent(currentElement.value);
          updatePositionToMouse(currentElement.value, event as MouseEvent);
          checkAndUpdateMasks(currentElement.value);
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
  };

  const elements = document.querySelectorAll('.magnet, select, .container');

  elements.forEach((element) => {
    ['mouseenter', 'mouseout', 'mousemove', 'mouseleave'].forEach((eventType) => {
      element.removeEventListener(eventType, handleEvent);
      element.addEventListener(eventType, handleEvent);
    });

    ['mouseleave', 'mousemove'].forEach((eventType) => {
      document.removeEventListener(eventType, handleEvent);
      document.addEventListener(eventType, handleEvent);
    });

    ['mouseleave', 'mousemove'].forEach((eventType) => {
      window.removeEventListener(eventType, handleEvent);
      window.addEventListener(eventType, handleEvent);
    });
  });

  window.addEventListener('mouseleave', () => {
    if (currentElement.value) {
      resetToOriginalPosition(currentElement.value);
      dispatchUpdateTooltip(
        currentElement.value as HTMLElement,
        new MouseEvent('mousemove'),
        false,
      );
      isLatched.value = false;
      currentElement.value = null;
    }
  });
}
