/* eslint-disable @typescript-eslint/no-unused-vars */
import { Draggable } from 'gsap/Draggable';
import { Store } from 'vuex';
import type { State } from './store/types';
import { ref, Ref, inject } from 'vue';
// import { initialPIDState } from './pidstate';
export function setupDraggable(store: Store<State>, iconMaskStyles: Ref<Record<string, string>>) {
  console.log('setupDraggable iconMaskStyles:', iconMaskStyles);

  const elements = document?.querySelectorAll('.draggable');
  console.log('setupDraggable iconMaskStyles after inject:', iconMaskStyles);

  if (elements) {
    Array.from(elements).forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      Draggable.create(htmlElement, {
        type: 'x,y',
        edgeResistance: 0.65,
        bounds: window,
        throwProps: true,
        onDragStart: function () {},

        onDrag: function () {
          const x = this.x;
          console.log(`Dragging: x = ${x}`);
          if (iconMaskStyles && iconMaskStyles.value) {
            if (x > 0 && x <= 60) {
              const clipPathValue = `inset(0 ${x}px 0 0)`;
              iconMaskStyles.value[element.id] = clipPathValue;
            } else {
              delete iconMaskStyles.value[element.id];
            }
          }
        },

        onThrowUpdate: function () {
          const x = this.x;
          if (x > 0 && x <= 60) {
            const maskPosition = `${x}px 0px`;
            iconMaskStyles.value[
              element.id
            ] = `mask-position: ${maskPosition}; -webkit-mask-position: ${maskPosition};`;
          } else {
            delete iconMaskStyles.value[element.id];
          }
        },

        onDragEnd: function () {},
      });
    });
  }
}
