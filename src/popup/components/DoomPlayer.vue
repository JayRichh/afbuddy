<template>
  <div>
    <iframe ref="doomIframe" frameborder="0" :src="iframeSrc" allowfullscreen></iframe>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';

export default {
  name: 'DoomPlayer',
  setup() {
    const doomIframe = ref(new HTMLIFrameElement());
    // const iframeSrc =
    // "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Foriginal%2F2X%2F2%2F24b00b14f118580763440ecaddcc948f8cb94f14.jsdos&anonymous=1";
    const iframeSrc =
      'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos&anonymous=1';

    onMounted(() => {
      doomIframe.value.contentWindow?.document.addEventListener('keydown', (event) => {
        switch (event.key) {
          case 'ArrowUp':
            doomIframe.value.contentWindow?.document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'w',
              }),
            );
            break;
          case 'ArrowDown':
            doomIframe.value.contentWindow?.document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 's',
              }),
            );
            break;
          case 'ArrowLeft':
            doomIframe.value.contentWindow?.document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'a',
              }),
            );
            break;
          case 'ArrowRight':
            doomIframe.value.contentWindow?.document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'd',
              }),
            );
            break;
          case ' ':
            doomIframe.value.contentWindow?.document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: ' ',
              }),
            );
            break;
          case 'Enter':
            doomIframe.value.contentWindow?.document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'Enter',
              }),
            );
            break;
          case 'Escape':
            doomIframe.value.contentWindow?.document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'Escape',
              }),
            );
          case 'f':
            doomIframe.value.contentWindow?.document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'f',
              }),
            );
          case 'e':
            doomIframe.value.contentWindow?.document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'e',
              }),
            );
            break;
          default:
            break;
        }
      });

      doomIframe.value.contentWindow?.document.addEventListener(
        'fullscreenchange',
        () => {
          if (!doomIframe.value.contentWindow?.document.fullscreenElement) {
            doomIframe.value.contentWindow?.document
              .querySelector('canvas')
              ?.requestFullscreen();
          }
        },
      );

      doomIframe.value.contentWindow?.document
        .querySelector('canvas')
        ?.requestFullscreen();
    });

    return {
      doomIframe,
      iframeSrc,
    };
  },
};
</script>

<style scoped>
div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 60px;
  box-sizing: border-box;
}

iframe {
  width: 100%;
  height: calc(100% - 60px);
  border: none;
}
</style>
