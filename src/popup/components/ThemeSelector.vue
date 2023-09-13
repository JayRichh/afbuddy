<template>
  <div class="theme-selector-container">
    <!-- <Tooltip
      v-if="showTooltip"
      :x="tooltipX"
      :y="tooltipY"
      :theme="selectedThemeKey"
      :visible="showTooltip"
    ></Tooltip> -->

    <label for="font-selector" class="font-label">Select Font:</label>
    <select id="font-selector" v-model="selectedFont" @change="applyFont">
      <option
        v-for="(font, index) in fonts"
        :key="index"
        :value="font"
        :selected="font === currentFont"
      >
        {{ font }}
      </option>
    </select>

    <label for="theme-selector" class="theme-label">Select Theme:</label>
    <select
      id="theme-selector"
      class="hover"
      v-model="selectedThemeKey"
      @change="applySelectedTheme"
    >
      <option
        v-for="(theme, index) in themeNamesArray"
        :key="index"
        :value="theme"
        :selected="theme === currentTheme"
      >
        {{ theme }}
      </option>
    </select>

    <div class="button-group">
      <button class="button-group-item button-group-item--left" @click="setDefaultTheme">
        Default
      </button>
      <button class="button-group-item button-group-item--right" @click="applySelectedTheme">
        Apply
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, Ref, watch } from 'vue';
import Tooltip from './Tooltip.vue';
import { useStore } from 'vuex';
import Fonts from './Fonts.vue';

export default defineComponent({
  name: 'ThemeSelector',
  components: {
    Tooltip,
  },
  props: {
    currentTheme: String,
    currentFont: String,
  },
  setup(props: any) {
    const store = useStore();
    const themeNamesArray = computed(() => store.state.themeNamesArray);
    const selectedThemeKey = ref(store.state.selectedThemeKey || props.currentTheme);

    const showTooltip = ref(false);
    const tooltipX = ref(0);
    const tooltipY = ref(0);

    const fonts = computed(() => Object.keys(store.state.fonts));
    const selectedFont = ref(store.state.font || fonts.value[0]);

    onMounted(async () => {
      if (!selectedThemeKey.value) {
        selectedThemeKey.value = 'github-dark';
      }
      await store.dispatch('applySelectedTheme');
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

    function applyFont() {
      if (selectedFont.value) {
        document.documentElement.style.setProperty('--editor-font', selectedFont.value);
        store.dispatch('updateFont', selectedFont.value);
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

    watch(selectedFont, () => {
      applyFont();
    });

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
  height: 100%;
  margin: 60px 0 0 0;
  width: 100%;
}

select {
  color: #555;
  border-radius: 5px;
  width: 87.5%;
  margin-bottom: 20px;
  padding: 5px;
  font-size: 1.1em;
  font-weight: 500;

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

#theme-selector {
  margin-bottom: 4rem;
}

label {
  text-align: left;
  color: #555;
  width: 85%;
  font-weight: 500;
  left: 0;
  margin: 0;
  padding: 0;
  bottom: -0.2rem;
  position: relative;
}

.button-group {
  margin-top: 1rem;
  bottom: 1rem;
  position: absolute;
}

.button-group-item {
  cursor: pointer;
  text-transform: uppercase;
  height: 38px;
  width: 90px;
  margin: 0 5px;
  border: none;
  border-radius: 0.25rem;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  .button-group-item--left {
    background-color: #dc3545;
    color: white;
    border: 1px solid darken(#dc3545, 10%);
    &:hover,
    &:active {
      background-color: darken(#dc3545, 10%);
      border-color: darken(#dc3545, 20%);
    }
  }

  .button-group-item--right {
    background-color: #007bff;
    color: white;
    border: 1px solid darken(#007bff, 10%);
    &:hover,
    &:active {
      background-color: darken(#007bff, 10%);
      border-color: darken(#007bff, 20%);
    }
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
}

.button-group-item--left {
  background-color: #dc3545;
  color: white;
}

.button-group-item--right {
  background-color: #007bff;
  color: white;
}
</style>
