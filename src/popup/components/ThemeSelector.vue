<template>
  <div class="theme-selector-container">
    <Tooltip
      v-if="showTooltip"
      :x="tooltipX"
      :y="tooltipY"
      :theme="selectedTheme.base"
      :themeData="selectedTheme"
      :visible="showTooltip"
    ></Tooltip>
    <div class="label-button-wrapper">
      <label for="theme-select" class="theme-label">Select Theme:</label>
      <div class="button-group">
        <button @click="applySelectedTheme" class="primary-btn">Apply</button>
        <button @click="setDefaultTheme" class="secondary-btn">Default</button>
      </div>
    </div>
    <select
      id="theme-select"
      v-model="selectedThemeKey"
      @mouseover="handleThemeMouseOver"
      @mousemove="adjustTooltipPosition"
      @mouseout="handleMouseOut"
    >
      <option v-for="theme in themeNamesArray" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import Tooltip from './Tooltip.vue';
import { getThemes, Theme } from '../themesList';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useStore, mapState } from 'vuex';

export default defineComponent({
  name: 'ThemeSelector',
  components: {
    Tooltip,
  },
  props: {
    currentTheme: String,
  },
  computed: {
    ...mapState(['themeNamesArray']),
  },
  setup(props) {
    const store = useStore();
    const selectedThemeKey = ref(
      props.currentTheme || store.state.selectedThemeKey,
    );
    const showTooltip = ref(false);
    const tooltipX = ref(0);
    const tooltipY = ref(0);

    const selectedTheme = computed(() => {
      const theme: Theme = store.state.themesArray[selectedThemeKey.value];
      return {
        base: theme.base,
        inherit: theme.inherit,
        rules: theme.rules.map((rule) => ({ ...rule })),
        colors: { ...theme.colors },
      } as monaco.editor.IStandaloneThemeData;
    });

    onMounted(async () => {
      if (!store.state.themesArray.length) {
        const { themesArray, themeNamesArray, themeList } = await getThemes();
        store.commit('setThemesArray', themesArray);
        store.commit('setThemeNamesArray', themeNamesArray);
        store.commit('setThemeList', themeList);
      }
      applySelectedTheme();
    });

    function handleThemeMouseOver(event: MouseEvent) {
      showTooltip.value = true;
    }

    function adjustTooltipPosition(event: MouseEvent) {
      tooltipX.value = event.clientX + 10;
      tooltipY.value = event.clientY + 10;
    }

    function handleMouseOut() {
      showTooltip.value = false;
    }

    function applySelectedTheme() {
      const themeName = selectedTheme.value.base;
      const themeData = selectedTheme.value;
      monaco.editor.defineTheme(themeName, themeData);
      monaco.editor.setTheme(themeName);
      store.commit('setThemeData', themeData);
      store.commit('setTooltipEditorTheme', selectedTheme.value.base);

      chrome.runtime.sendMessage({
        action: 'sendMonacoTheme',
        theme: themeData,
      });
    }

    function setDefaultTheme() {
      selectedThemeKey.value = 'active4d';
      applySelectedTheme();
    }

    return {
      themeList: computed(() => store.state.themeList),
      selectedThemeKey,
      showTooltip,
      tooltipX,
      tooltipY,
      selectedTheme,
      handleThemeMouseOver,
      adjustTooltipPosition,
      handleMouseOut,
      applySelectedTheme,
      setDefaultTheme,
    };
  },
});
</script>

<style scoped lang="scss">
.theme-selector-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  margin: 0;
  width: calc(100% - 20px);
  background-color: #f4f4f4;
  border-radius: 0.5rem;
  box-sizing: border-box;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  z-index: 10;
}

.label-button-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.theme-label {
  text-transform: uppercase;
  font-weight: bold;
  padding: 0;
  margin-bottom: 0;
  color: #555;
  display: block;
  text-align: left;
}

select {
  width: 80%;
  padding: 10px;
  border: 1px lightgray solid;
  border-radius: 5px;
  background-color: #f3f3f3;
  transition: box-shadow 0.3s ease-in-out;
  cursor: pointer;
  max-width: 300px;
  box-sizing: border-box;
  font-size: 1.1em;
  font-weight: bold;
  color: #555;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('../../../assets/dropdown-arrow.svg');
  background-repeat: no-repeat;
  background-position: 95% center;
}

.button-group {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 10px 0px;
}

.primary-btn,
.secondary-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  font-weight: bold;
  transition:
    box-shadow 0.3s ease-in-out,
    transform 0.3s ease-in-out;
  border: 2px solid transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.primary-btn {
  background-color: #4caf50;
  color: white;

  &:hover,
  &:active,
  &:focus {
    box-shadow:
      0 0 10px #4caf50,
      0 0 20px #4caf50,
      0 0 30px #4caf50,
      0 0 40px #4caf50;
  }
}

.secondary-btn {
  background-color: #f44336;
  color: white;

  &:hover,
  &:active,
  &:focus {
    box-shadow:
      0 0 10px #f44336,
      0 0 20px #f44336,
      0 0 30px #f44336,
      0 0 40px #f44336;
  }
}
</style>
