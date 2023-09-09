<template>
  <div class="theme-selector-container">
    <Tooltip
      v-if="showTooltip"
      :x="tooltipX"
      :y="tooltipY"
      :theme="selectedThemeKey"
      :visible="showTooltip"
    ></Tooltip>

    <label for="theme-selector" class="theme-label">Select Theme:</label>
    <select id="theme-selector" v-model="selectedThemeKey" @change="applySelectedTheme">
      <option
        v-for="(theme, index) in themeNamesArray"
        :key="index"
        :value="theme"
        :selected="theme === currentTheme"
      >
        {{ theme }}
      </option>
    </select>
    <span size="small" type="secondary">
      {{ selectedThemeKey }}
    </span>

    <div class="label-button-wrapper">
      <div class="button-group-wrapper">
        <button class="button-group-item button-group-item--right" @click="applySelectedTheme">
          Apply
        </button>
        <button class="button-group-item button-group-item--left" @click="setDefaultTheme">
          Default
        </button>
      </div>
    </div>

    <div class="font-selector-container">
      <label for="font-selector" class="font-label">Select Font:</label>
      <select id="font-selector" v-model="selectedFont" @change="applyFont">
        <option v-for="font in fonts" :key="font" :value="font" :selected="font === font">
          {{ font }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import Fonts from './Fonts.vue';
import { defineComponent, onMounted, computed, ref } from 'vue';
import Tooltip from './Tooltip.vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ThemeSelector',
  components: {
    Tooltip,
  },
  props: {
    currentTheme: String,
  },
  setup(props: any) {
    const store = useStore();
    const themes = computed(() => store.state.themes);
    const themeNamesArray = computed(() => themes.value.themeNamesArray);
    const selectedThemeKey = ref(props.currentTheme);
    const showTooltip = ref(false);
    const tooltipX = ref(0);
    const tooltipY = ref(0);

    const fonts = ref(['Roboto', 'Roboto Italic', 'Roboto Slab']);
    const selectedFont = ref(fonts.value[0]);
    const currentFont = computed(() => store.state.font);

    onMounted(async () => {
      if (!selectedThemeKey.value) {
        selectedThemeKey.value = 'github-dark';
      }
      await store.dispatch('applySelectedTheme', selectedThemeKey.value);
      setDefaultTheme();
    });

    async function applySelectedTheme() {
      if (selectedThemeKey.value) {
        const themeData = await store.dispatch('getTheme', selectedThemeKey.value);
        if (themeData) {
          store.dispatch('applyTheme', {
            theme: themeData,
          });
        }
      }
      if (selectedFont.value) {
        document.documentElement.style.setProperty('--editor-font', selectedFont.value);
      }
    }

    async function applyFont() {
      if (selectedFont.value) {
        // document.documentElement.style.setProperty('--editor-font', selectedFont.value);
        console.log('selectedFont.value', selectedFont.value);
      }
    }

    async function setDefaultTheme() {
      const defaultTheme = selectedThemeKey.value;
      const themeData = await store.dispatch('getTheme', defaultTheme);
      if (themeData) {
        store.dispatch('applyTheme', {
          theme: themeData,
        });
      }
    }

    return {
      selectedThemeKey,
      showTooltip,
      tooltipX,
      tooltipY,
      applySelectedTheme,
      setDefaultTheme,
      themeNamesArray,
      fonts,
      selectedFont,
      applyFont,
    };
  },
});
</script>

<style scoped lang="scss">
.theme-selector-container,
.font-selector-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-direction: flex-end;
  height: 100%;
  bottom: 0;
  margin: 60px 0 0 0;
  width: 100%;
}

select {
  color: #555;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 75%;
  margin-bottom: 20px;
  font-size: 1.1em;
  font-weight: bold;

  &:focus {
    outline: none;
  }

  &:hover {
    cursor: pointer;
  }

  &:active {
    cursor: pointer;
  }
}

label {
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 10px;
  left: 0;
  text-align: left;
  width: 75%;
  color: #555;
  position: inherit;
}

.theme-label {
  text-transform: uppercase;
  font-weight: bold;
  color: #555;
  display: block;
  font-size: 1.2em;
  text-align: left;
}

.button-group-item {
  cursor: pointer;
  font-weight: bold;
  transition: all 0.1s ease cubic-bezier(0.25, 0.1, 0.25, 1);
  text-transform: uppercase;
  height: 40px;
  width: 100px;
  margin: 0 10px;

  &:hover {
    transform: scale(1.1);
    transition: all 0.3s ease;
  }
  &:active {
    transform: scale(0.9);
    transition: all 0.3s ease;
  }
  &:focus {
    outline: none;
  }
}

.button-group-item--left {
  background-color: #4caf50;
  color: white;
}

.button-group-item--right {
  background-color: #f44336;
  color: white;
}
</style>
