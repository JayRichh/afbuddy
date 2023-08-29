<template>
  <div class="tab-manager-container">
    <div class="input-group">
      <label for="tabWidth" class="input-label"
        >Tab Width (Default: {{ defaultTabWidth }}):</label
      >
      <div class="input-wrapper">
        <input
          type="number"
          v-model="tabWidth"
          id="tabWidth"
          min="1"
          max="10"
          class="number-input"
        />
        <button class="increment-button" @click="tabWidth++">+</button>
        <button class="decrement-button" @click="tabWidth--">-</button>
        <div class="input-line"></div>
      </div>
    </div>

    <div class="checkbox-group">
      <h3>Tab Management</h3>
      <label for="enableTabManagement">Enable:</label>
      <input
        type="checkbox"
        id="enableTabManagement"
        v-model="enableTabManagement"
      />

      <div v-if="enableTabManagement">
        <label for="excludeTabs">Exclude Specific Tabs:</label>
        <input type="checkbox" id="excludeTabs" v-model="excludeTabs" />

        <label for="tabSetPoint">Set Tab Limit:</label>
        <input
          type="number"
          id="tabSetPoint"
          v-model="tabSetPoint"
          min="1"
          max="10"
        />
      </div>
    </div>

    <div class="button-group">
      <button @click="setTabWidthValue">Set Tab Width</button>
      <button @click="resetAllValues">Reset to Default</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  data() {
    return {
      tabWidth: 4,
      defaultTabWidth: 4,
      enableTabManagement: false,
      excludeTabs: false,
      tabSetPoint: 4,
    };
  },
  methods: {
    setTabWidthValue() {
      this.$emit('set-tab-width', this.tabWidth);
    },
    resetAllValues() {
      this.tabWidth = this.defaultTabWidth;
      this.enableTabManagement = false;
      this.excludeTabs = false;
      this.tabSetPoint = 4;
    },
  },
});
</script>

<style scoped lang="scss">
.tab-manager-container {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: auto;
  max-width: 400px;
  padding: 1rem;
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
  overflow: hidden;
}

.input-group {
  position: relative;
  margin: 15px 0;
  .input-label {
    font-size: 16px;
    color: #333;
  }
  .input-wrapper {
    position: relative;
    .number-input {
      width: 80%;
      padding: 10px;
      font-size: 18px;
      border: none;
      border-bottom: 2px solid #ccc;
      transition: all 0.3s ease;
      outline: none;
      &:focus {
        border-color: black;
      }
    }
    .increment-button,
    .decrement-button {
      padding: 10px;
      background-color: white;
      border: 2px solid #e6e0e4;
      color: black;
      transition: all 0.3s ease;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
      }
      &:active {
        transform: scale(1);
      }
    }
    .input-line {
      position: absolute;
      .input-line {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: black;
        transition: all 0.3s ease;
        &.active {
          width: 100%;
        }
      }
    }
  }
}
</style>
