<template>
  <div class="tab-width-container">
    <div class="input-group">
      <label for="tabWidth">Tab Width (Default: {{ defaultTabWidth }}):</label>
      <input type="number" v-model="tabWidth" id="tabWidth" min="1" max="10" />
      <span class="current-value">{{ tabWidth }}</span>
    </div>

    <div class="button-group">
      <button @click="setTabWidthValue">Set Tab Width</button>
      <button @click="resetTabWidth">Reset to Default</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  data() {
    return {
      tabWidth: 4,
      defaultTabWidth: 4,
    };
  },
  methods: {
    setTabWidthValue() {
      this.$emit("set-tab-width", this.tabWidth);
    },
    resetTabWidth() {
      this.tabWidth = this.defaultTabWidth;
    },
  },
});
</script>
<style scoped lang="scss">
.tab-width-container {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: auto;
  max-height: 100%;
  width: 100%;
  padding: 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  box-sizing: border-box;
  overflow: auto;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

label {
  font-size: 1rem;
  color: #80d8ff;
}

input[type="number"] {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

input[type="number"]:hover,
input[type="number"]:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.current-value {
  font-size: 1rem;
  color: #333;
  margin-left: 0.5rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: linear-gradient(45deg, #ffd3b6, #b2ebf2);
  color: #333;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: linear-gradient(45deg, #ffb299, #80d8ff);
}
</style>


<style scoped lang="scss">
.tab-width-container {
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
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

label {
  font-size: 1rem;
  color: #333;
  flex: 1;
}

input[type="number"] {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  flex: 2;
  transition: border-color 0.3s ease;
}

input[type="number"]:hover,
input[type="number"]:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.current-value {
  font-size: 1rem;
  color: #333;
  flex: 1;
  text-align: center;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: linear-gradient(45deg, #ffd3b6, #b2ebf2);
  color: #333;
  cursor: pointer;
  transition: background 0.3s ease;
  flex: 1;
}

button:hover {
  background: linear-gradient(45deg, #ffb299, #80d8ff);
}
</style>
