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
    <label for="theme-select" class="theme-label">Select Theme:</label>
    <select
      id="theme-select"
      v-model="selectedThemeKey"
      @mouseover="handleThemeMouseOver"
      @mousemove="adjustTooltipPosition"
      @mouseout="handleMouseOut"
    >
      <option v-for="(name, key) in themeList" :value="key" :key="key">
        {{ name }}
      </option>
    </select>
    <div class="button-group">
      <button @click="applySelectedTheme" class="primary-btn">Apply</button>
      <button @click="setDefaultTheme" class="secondary-btn">Default</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import Tooltip from "./Tooltip.vue";
import { getThemes, Theme } from "../themesList";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export default defineComponent({
  components: {
    Tooltip,
  },
  props: {
    currentTheme: String,
  },
  async setup(props) {
    const { themesArray, themeNamesArray, themeList } = await getThemes();
    const selectedThemeKey = ref(props.currentTheme || "active4d");
    const showTooltip = ref(false);
    const tooltipX = ref(0);
    const tooltipY = ref(0);

    const selectedTheme = computed(() => {
      const theme: Theme = themesArray[selectedThemeKey.value];
      return {
        base: theme.base,
        inherit: theme.inherit,
        rules: theme.rules.map((rule) => ({ ...rule })),
        colors: { ...theme.colors },
      } as monaco.editor.IStandaloneThemeData;
    });

    onMounted(() => {
      console.log("mounted themeselector");
      if (!props.currentTheme) {
        setDefaultTheme();
      }
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
    }

    function setDefaultTheme() {
      selectedThemeKey.value = "active4d";
      applySelectedTheme();
    }

    return {
      themeList,
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
button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #5d9cec;
  cursor: pointer;
  margin-top: 1em;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
}

button:hover {
  background-color: #666;
  box-shadow: 0 0 3px #555;
}

button:active {
  transform: scale(0.98);
}

template > .theme-selector-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  margin: 0;
  width: calc(100% - 20px);
  background-color: #f4f4f4;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: "Courier New", monospace;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  z-index: 10;
}

.theme-selector-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  margin: 0;
  width: calc(100% - 20px);
  background-color: #f4f4f4;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: "Courier New", monospace;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  z-index: 10;
}

select {
  padding: 10px;
  outline: none;
  border-radius: 5px;
  border: 1px lightgray solid;
  background-color: #f3f3f3;
  transition: box-shadow 0.3s ease-in-out;
  cursor: pointer;
  width: 80%;
  max-width: 300px;
  box-sizing: border-box;
  font-size: 1.1em;
  font-weight: bold;
  color: #555;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("../../../assets/dropdown-arrow.svg");
  background-repeat: no-repeat;
  background-position: 95% center;
}

option {
  padding: 10px;
  border-radius: 5px;
  border: 1px lightgray solid;
  background-color: #f3f3f3;
  transition: box-shadow 0.3s ease-in-out;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
}

select:hover {
  box-shadow: 0 0 3px #555;
}

select:focus {
  box-shadow: 0 0 5px #555;
}

button:focus {
  outline: none;
  box-shadow: 0 0 5px #555;
}

label {
  font-size: 1.1em;
  font-weight: bold;
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

.primary-btn {
  background-color: #4caf50; /* Green background */
  color: white;
  margin-right: 10px;
  padding: 10px 25px;
  cursor: pointer;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  font-weight: bold;
  font-size: 1.1em;
  margin-right: 10px;

  &:hover {
    transform: scale(1.02) translateY(-1px) translateX(1px) !important;
  }

  &:active {
    transform: scale(0.98) !important;
  }
}

.secondary-btn {
  background-color: #ff5722; /* Orange background */
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  font-weight: bold;
  font-size: 1.1em;
  margin-left: 10px;

  &:hover {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: scale(1.02) translateY(-1px) translateX(1px) !important;
  }

  &:active {
    transform: scale(0.98) !important;
  }
}

.button-group {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 10px 0px;
}
</style>
