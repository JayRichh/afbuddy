<template>
  <div class="tab-manager-container">
    <div class="input-group">
      <label for="tabWidth" class="input-label">Tab Width (Default: {{ defaultTabWidth }}):</label>
      <div class="input-wrapper">
        <button class="inc-dec-button" @click="decrementTabWidth">-</button>
        <input type="number" v-model="tabWidth" id="tabWidth" class="number-input" />
        <button class="inc-dec-button" @click="incrementTabWidth">+</button>
      </div>
    </div>

    <label class="tab-management-label">Tab Management:</label>
    <div class="checkbox-group">
      <label for="enableTabManagement">Enable:</label>
      <input type="checkbox" id="enableTabManagement" v-model="tabManagementEnabled" />
    </div>

    <div v-if="tabManagementEnabled" class="excludetab-container">
      <label for="excludeTabs">Exclude Specific Tabs:</label>
      <input type="checkbox" id="excludeTabs" v-model="excludeTabs" />

      <label for="tabSetPoint">Set Tab Limit:</label>
      <input type="number" id="tabSetPoint" v-model="tabSetPoint" min="1" max="10" />
    </div>

    <label class="data-tree-label">Data Tree / Lookup:</label>
    <ul class="data-tree">
      <li v-for="keyword in filteredKeywords" :key="keyword">
        {{ keyword }}
      </li>
    </ul>

    <div class="button-group">
      <button class="button-group-item button-group-item--left" @click="setTabWidthValue">
        Set Tab Width
      </button>
      <button class="button-group-item button-group-item--right" @click="resetAllValues">
        Reset to Default
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'TabManager',
  setup() {
    const store = useStore();
    const tabWidth = ref(store.state.tabWidth);
    const tabManagementEnabled = ref(store.state.tabManagementEnabled);
    const tabSetPoint = ref(store.state.tabSetPoint);
    const excludeTabs = ref(store.state.excludeTabs);
    const defaultTabWidth = ref(store.state.defaultTabWidth);

    const lookupKeyword = ref('');
    const filteredKeywords = computed(() => {
      return ['dev', 'prod', 'db-manager', 'appdesigner']; // Replace
    });

    const setTabWidthValue = () => {
      store.commit('updateTabWidth', tabWidth.value);
    };

    const setTabManagementEnabled = () => {
      store.commit('updateTabManagementEnabled', tabManagementEnabled.value);
    };

    const setTabSetPoint = () => {
      store.commit('updateTabSetPoint', tabSetPoint.value);
    };

    const setExcludeTabs = () => {
      store.commit('updateExcludeTabs', excludeTabs.value);
    };

    const resetAllValues = () => {
      store.commit('resetAllValues');
    };

    const incrementTabWidth = () => {
      tabWidth.value++;
    };

    const decrementTabWidth = () => {
      tabWidth.value--;
    };

    return {
      tabWidth,
      tabManagementEnabled,
      tabSetPoint,
      excludeTabs,
      setTabWidthValue,
      setTabManagementEnabled,
      setTabSetPoint,
      setExcludeTabs,
      resetAllValues,
      incrementTabWidth,
      decrementTabWidth,
      defaultTabWidth,
      lookupKeyword,
      filteredKeywords,
    };
  },
});
</script>

<style scoped lang="scss">
.tab-manager-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: auto;
  margin: 80px 0 0 0;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  padding: 0 0 1rem 0;
  overflow-x: hidden;
}

.excludetab-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 85%;
  margin-bottom: 1rem;
}

.input-label,
.tab-management-label,
.data-tree-label {
  text-align: left;
  color: #555;
  width: 85%;
  font-weight: 500;
  font-size: 1.1em;
  margin-bottom: -0.2rem;
}

input[type='checkbox'] {
  appearance: none;
  background-color: #f2f2f2;
  border: 1px solid #d1d1d1;
  cursor: pointer;
  height: 20px;
  margin-right: 10px;
  width: 20px;

  &:checked {
    background-color: #007bff;
    border: 1px solid #0056b3;
  }
}

input:not([type='checkbox']) {
  color: #555;
  border-radius: 5px;
  width: 87.5%;
  margin-bottom: 1rem;
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

#tabWidth {
  width: 70%;
  padding: 5px;
  font-size: 1.1em;
  font-weight: 500;
  border-radius: 5px;
}

.checkbox-group,
.data-tree {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 85%;
  margin-bottom: 1rem;
}

.input-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.number-input {
  width: 70%;
  padding: 5px;
  font-size: 1.1em;
  font-weight: 500;
  border-radius: 5px;
}

.inc-dec-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  width: 40px;
  height: 38px;
  cursor: pointer;
  text-transform: uppercase;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.button-group {
  margin-top: 1rem;
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
}

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
</style>
