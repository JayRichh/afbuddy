<template>
  <div>
    <iframe
      ref="doomIframe"
      frameborder="0"
      :src="iframeSrc"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";

export default {
  name: "DoomPlayer",
  setup() {
    const doomIframe = ref(null);
    // const iframeSrc =
      // "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Foriginal%2F2X%2F2%2F24b00b14f118580763440ecaddcc948f8cb94f14.jsdos&anonymous=1";
    const iframeSrc = 
    "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos&anonymous=1";

    onMounted(() => {
      doomIframe.value.focus();
    });

    return {
      doomIframe,
      iframeSrc,
    };
  },
};
</script>

<style scoped>
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
