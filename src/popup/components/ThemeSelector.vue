<template>
  <div class="theme-selector-container">
    <Tooltip
      v-if="showTooltip"
      :x="tooltipX"
      :y="tooltipY"
      :theme="selectedThemeKey"
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
    const state = ref({
      monacoContainer: null,
      editorInstance: null,
    });
    const store = useStore();
    const selectedThemeKey = ref(
      props.currentTheme || store.state.selectedThemeKey,
    );
    const showTooltip = ref(false);
    const tooltipX = ref(0);
    const tooltipY = ref(0);

    onMounted(async () => {
      await store.dispatch('updateThemes');
      applySelectedTheme();
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
      store.dispatch('applyTheme', {
        theme: selectedThemeKey.value,
      });
    }

    function adjustTooltipPosition(event: MouseEvent) {
      tooltipX.value = event.clientX + 10;
      tooltipY.value = event.clientY + 10;
    }

    function handleMouseOut() {
      showTooltip.value = false;
    }

    function applySelectedTheme() {
      const themeName = selectedThemeKey.value;
      console.log('themeName', themeName, store.state.themeList[themeName]);
      store.dispatch('applyTheme', {
        theme: themeName,
        themeData: store.state.themeList[themeName],
      });
    }

    function setDefaultTheme() {
      selectedThemeKey.value = store.state.themeList[0];
      applySelectedTheme();
    }

    return {
      themeList: computed(() => store.state.themeList),
      selectedThemeKey,
      showTooltip,
      tooltipX,
      tooltipY,
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
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  margin: 0;
  width: calc(100% - 40px);
  flex-direction: column;
  background-color: #f4f4f4;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  z-index: 10;
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

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
