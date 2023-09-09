/* eslint-disable @typescript-eslint/no-unused-vars */
import { Draggable } from 'gsap/Draggable';
import { Store } from 'vuex';
import type { State } from './store/types';
import { ref, Ref, inject } from 'vue';
// import { initialPIDState } from './pidstate';

export function setupDraggable(
  store: Store<State>,
  iconMaskStyles: Ref<Record<string, string>>,
) {
  console.log('setupDraggable iconMaskStyles:', iconMaskStyles);

  const elements = Array.from(document.querySelectorAll('.draggable')) as HTMLElement[];
  console.log('setupDraggable iconMaskStyles after inject:', iconMaskStyles);

  elements.forEach((element: HTMLElement) => {
    Draggable.create(element, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: window,
      throwProps: true,
      onDragStart: function () {
        // let state = store.getters.getPIDState(element.getAttribute('aria-label') || '');
        // if (!state) {
        //   state = { ...initialPIDState };
        //   store.commit('setPIDState', {
        //     ariaLabel: element.getAttribute('aria-label') || '',
        //     pidState: state,
        //   });
        // }
        // store.commit('updatePIDState', {
        //   ariaLabel: element.getAttribute('aria-label') || '',
        //   pidState: {
        //     ...state,
        //     originalX: this.x,
        //     originalY: this.y,
        //     setPointX: this.x,
        //     setPointY: this.y,
        //   },
        // });
      },
      onDrag: function () {
        const x = this.x;
        console.log(`Dragging: x = ${x}`);
        if (iconMaskStyles && iconMaskStyles.value) {
          if (x > 0 && x <= 60) {
            const clipPathValue = `inset(0 ${60 - x}px 0 0)`;
            console.log(`Setting clipPathValue: ${clipPathValue}`);
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
        const throwProps = this.getThrowProps();
        const direction = throwProps.velocityX > 0 ? 1 : -1;
        this.tween = this.tween.to(this.target, {
          x: '+=' + throwProps.velocityX * direction * 0.8,
          y: '+=' + throwProps.velocityY * direction * 0.8,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      },

      // if (element.classList.contains('icon-container')) {
      //   const x = this.x;
      //   let maskPosition;
      //   if (x > 0 && x <= 60) {
      //     maskPosition = `${x}px 0px`;
      //   } else if (x > 60) {
      //     maskPosition = `100% 0px`;
      //   } else {
      //     maskPosition = `0% 0px`;
      //   }
      //   iconMaskStyles.value[
      //     element.id
      //   ] = `mask-position: ${maskPosition}; -webkit-mask-position: ${maskPosition};`;
      // } else {
      //   iconMaskStyles.value[
      //     element.id
      //   ] = `mask-position: 0% 0px; -webkit-mask-position: 0% 0px;`;
      // const state = store.getters.getPIDState(element.getAttribute('aria-label') || '');
      // if (state) {
      //   store.commit('updatePIDState', {
      //     ariaLabel: element.getAttribute('aria-label') || '',
      //     pidState: {
      //       ...state,
      //       setPointX: this.x,
      //       setPointY: this.y,
      //     },
      //   });
      // }
      // }
      onDragEnd: function () {
        // const state = store.getters.getPIDState(element.getAttribute('aria-label') || '');
        // if (state) {
        //   store.commit('updatePIDState', {
        //     ariaLabel: element.getAttribute('aria-label') || '',
        //     pidState: {
        //       ...state,
        //       setPointX: this.x,
        //       setPointY: this.y,
        //     },
        //   });
        // }
      },
    });
  });
}
