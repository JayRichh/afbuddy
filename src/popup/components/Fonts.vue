<template>
  <div>
    <select v-model="selectedFont" @change="applyFont">
      <option v-for="font in fonts" :key="font" :value="font">
        {{ font }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Fonts',
  setup() {
    const fonts = ref(['Roboto', 'Roboto Italic', 'Roboto Slab']);
    const selectedFont = ref(fonts.value[0]);

    const applyFont = () => {
      document.documentElement.style.setProperty('--editor-font', selectedFont.value);
    };

    return {
      fonts,
      selectedFont,
      applyFont,
    };
  },
});
</script>
