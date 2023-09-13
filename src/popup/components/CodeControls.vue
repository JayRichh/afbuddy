<template>
  <div class="code-controls-container">
    <label for="search-scripts" class="search-label">Search Scripts:</label>
    <input id="search-scripts" type="text" placeholder="Search scripts..." v-model="searchTerm" />

    <label class="history-label">Script History:</label>
    <ul id="history">
      <li v-for="script in filteredScripts" :key="script.id">
        <div
          class="script-info"
          @mouseover="showPreview(script, $event)"
          @mouseleave="hidePreview"
          @click="loadScriptIntoMainEditor(script)"
        >
          <span class="script-icon">📄</span>
          <span class="script-date">{{ script.date }}</span>
        </div>
        <div class="script-actions">
          <button class="action-btn load-btn">Load</button>
          <button class="action-btn delete-btn">Delete</button>
          <button class="action-btn rename-btn">Rename</button>
        </div>
      </li>
    </ul>

    <div class="button-group">
      <button class="button-group-item button-group-item--left" @click="saveJsonToLocalStorage">
        Save Code 💾
      </button>
      <button class="button-group-item button-group-item--right" @click="loadJsonFromLocalStorage">
        Load Code 📂
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

type Script = {
  id: number;
  date: string;
  content: string;
};

export default defineComponent({
  setup() {
    const store = useStore();
    return { store };
  },
  computed: {
    jsonObjects: function () {
      return this.store.state.jsonObjects;
    },
    searchTerm: function () {
      return this.store.state.searchTerm;
    },
    filteredScripts() {
      if (!this.searchTerm) return this.jsonObjects;
      return this.jsonObjects.filter((script: Script) => script.content.includes(this.searchTerm));
    },
  },
  methods: {
    saveJsonToLocalStorage() {
      this.store.dispatch('saveJsonToLocalStorage', this.jsonObjects);
    },
    loadJsonFromLocalStorage() {
      this.store.dispatch('loadJsonFromLocalStorage');
    },
    showPreview(script: Script, event: MouseEvent) {
      this.store.dispatch('updateTooltipText', script.content);
      this.store.dispatch('updateTooltipX', event.pageX);
      this.store.dispatch('updateTooltipY', event.pageY);
    },
    hidePreview() {
      this.store.dispatch('updateTooltipText', '');
    },
    loadScriptIntoMainEditor(script: Script) {
      // Logic to load script into main editor
    },
  },
});
</script>

<style scoped lang="scss">
.code-controls-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 60px 0 0 0;
  width: 100%;
}

.search-label,
.history-label {
  text-align: left;
  color: #555;
  width: 85%;
  font-weight: 500;
  margin-bottom: 1rem;
}

input {
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

.action-btn {
  background: #f9f9f9;
  border: 1px solid #ccc;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.action-btn:hover {
  background: #e6e6e6;
}
</style>
