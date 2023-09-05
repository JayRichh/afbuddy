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
    <select id="theme-selector" v-model="selectedThemeKey">
      <option v-for="theme in themeNamesArray" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
    <span size="small" type="secondary">
      {{ selectedThemeKey }}
    </span>

    <div class="label-button-wrapper">
      <div class="button-group-wrapper">
        <button
          class="button-group-item button-group-item--right"
          @click="applySelectedTheme"
        >
          Apply
        </button>
        <button
          class="button-group-item button-group-item--left"
          @click="setDefaultTheme"
        >
          Default
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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

    const selectedThemeKey = ref('');
    const showTooltip = ref(false);
    const tooltipX = ref(0);
    const tooltipY = ref(0);

    onMounted(async () => {
      if (selectedThemeKey.value) {
        await store.dispatch('applySelectedTheme', selectedThemeKey.value);
      }
    });

    function handleThemeMouseOver(event: MouseEvent) {
      if (!store.state.monacoContainer || !store.state.editorInstance) {
        console.error('Monaco container or editor instance is not set');
        return;
      }
      showTooltip.value = true;
      store.dispatch('createEditor', {
        monacoContainer: store.state.monacoContainer,
        editorInstance: store.state.editorInstance,
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
      if (themeData) {
        store.dispatch('applyTheme', {
          theme: themeData,
        });
      }
    }

    async function setDefaultTheme() {
      const defaultTheme = 'GitHub';
      const themeData = await store.getters.getThemeData(defaultTheme);
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
.theme-selector-container {
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
