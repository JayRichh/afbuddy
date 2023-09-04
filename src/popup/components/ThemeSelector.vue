<template>
  <div class="theme-selector-container">
    <Tooltip
      v-if="showTooltip"
      :x="tooltipX"
      :y="tooltipY"
      :theme="selectedThemeKey"
      :visible="showTooltip"
    ></Tooltip>

    <n-space vertical>
      <n-label for="theme-selector" class="theme-label">Select Theme:</n-label>
      <n-select
        id="theme-selector"
        v-model:value="selectedThemeKey"
        :options="themeNamesArray"
        @mouseover="handleThemeMouseOver"
        @mousemove="adjustTooltipPosition"
        @mouseout="handleMouseOut"
      >
      </n-select>
      <n-text size="small" type="secondary">
        {{ selectedThemeKey }}
      </n-text>
    </n-space>

    <div class="label-button-wrapper">
      <div class="button-group-wrapper">
        <NButton
          type="primary"
          @click="applySelectedTheme"
          class="button-group-item button-group-item--right"
          >Apply</NButton
        >
        <NButton
          type="error"
          @click="setDefaultTheme"
          class="button-group-item button-group-item--left"
          >Default</NButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue';
import Tooltip from './Tooltip.vue';
import { useStore, mapState } from 'vuex';
import { NButton, NButtonGroup, NSelect, NText } from 'naive-ui';

export default defineComponent({
  name: 'ThemeSelector',
  components: {
    NSelect,
    Tooltip,
    NButton,
    NButtonGroup,
    NText,
  },
  props: {
    currentTheme: String,
  },
  async setup(props: any) {
    const store = useStore();

    const state = ref({
      monacoContainer: null,
      editorInstance: null,
    });
    const selectedThemeKey = ref(props.currentTheme || store.state.selectedThemeKey);
    const showTooltip = ref(false);
    const tooltipX = ref(0);
    const tooltipY = ref(0);
    const themes = computed(() => store.state.themes);
    const themeNamesArray = computed(() => {
      return Object.keys(themes.value).map((key) => ({
        label: themes.value[key]?.base,
        value: key,
      }));
    });

    onMounted(async () => {
      if (selectedThemeKey.value) {
        await store.dispatch('applySelectedTheme', selectedThemeKey.value);
      }
    });

    function handleThemeMouseOver(event: MouseEvent) {
      if (!state.value.monacoContainer || !state.value.editorInstance) {
        console.error('Monaco container or editor instance is not set');
        return;
      }
      showTooltip.value = true;
      store.dispatch('createEditor', {
        monacoContainer: state.value.monacoContainer,
        editorInstance: state.value.editorInstance,
      });
      if (selectedThemeKey.value) {
        store.dispatch('applyTheme', {
          theme: selectedThemeKey.value,
        });
      }
    }

    function adjustTooltipPosition(event: MouseEvent) {
      tooltipX.value = event.clientX + 10;
      tooltipY.value = event.clientY + 10;
    }

    function handleMouseOut() {
      showTooltip.value = false;
    }

    async function applySelectedTheme() {
      const themeName = selectedThemeKey.value;
      const themeData = await store.getters.getThemeData(themeName);
      console.log('themeName', themeName, themeData);
      if (themeName && themeData) {
        store.dispatch('applyTheme', {
          theme: themeName,
          themeData: themeData,
        });
      }
    }

    async function setDefaultTheme() {
      const defaultThemeData = await store.getters.getThemeData('GitHub');
      if (defaultThemeData) {
        selectedThemeKey.value = defaultThemeData;
        store.dispatch('applySelectedTheme', selectedThemeKey.value);
      }
    }

    return {
      themeList: computed(async () => await store.getters.getThemeData),
      selectedThemeKey,
      showTooltip,
      tooltipX,
      tooltipY,
      handleThemeMouseOver,
      adjustTooltipPosition,
      handleMouseOut,
      applySelectedTheme,
      setDefaultTheme,
      themeNamesArray,
    };
  },
});
</script>

<style scoped lang="scss">
.button-group-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.button-group-item {
  flex: 1;
}

.button-group-item--left {
  margin-right: 10px;
}

.button-group-item--right {
  margin-left: 10px;
}

button:hover {
  background-color: #666;
  box-shadow: 0 0 3px #555;
}

button:active {
  transform: scale(0.98);
}

.label-button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.theme-selector-container {
  display: flex;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  margin: 0;
  width: 100%;
  flex-direction: column;
  background-color: #f4f4f4;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  z-index: 1;
}

select {
  color: #555;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('../../../assets/dropdown-arrow.svg');
  background-repeat: no-repeat;
  background-position: 95% center;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
  width: 100%;
  font-size: 1.1em;
}

.label-button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}

label {
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 10px;
}

.theme-label {
  text-transform: uppercase;
  font-weight: bold;
  padding: 0;
  margin-bottom: 0;
  color: #555;
  display: block;
  font-size: 1.2em;
  font-weight: 600;
  text-align: left;
}

.primary-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  transition:
    box-shadow 0.3s ease-in-out,
    transform 0.3s ease-in-out;
  font-weight: bold;
  font-size: 1.1em;
  border: 2px solid transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &:active {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #4caf50;
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
  padding: 10px 20px;
  cursor: pointer;
  transition:
    box-shadow 0.3s ease-in-out,
    transform 0.3s ease-in-out;
  font-weight: bold;
  font-size: 1.1em;
  border: 2px solid transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &:active {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #f44336;
    box-shadow:
      0 0 10px #f44336,
      0 0 20px #f44336,
      0 0 30px #f44336,
      0 0 40px #f44336;
  }
}
</style>
