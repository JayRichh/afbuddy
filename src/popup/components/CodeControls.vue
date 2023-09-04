<template>
  <div class="code-controls-container">
    <div class="button-group">
      <button class="control-btn" @click="saveJsonToLocalStorage">
        Save Code 💾
      </button>
      <button class="control-btn" @click="loadJsonFromLocalStorage">
        Load Code 📂
      </button>
    </div>
    <div class="history-panel">
      <input type="text" placeholder="Search scripts..." v-model="searchTerm" />
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
            <button class="load-btn action-btn">Load</button>
            <button class="delete-btn action-btn">Delete</button>
            <button class="rename-btn action-btn">Rename</button>
          </div>
        </li>
      </ul>
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
      return this.jsonObjects.filter((script: Script) =>
        script.content.includes(this.searchTerm),
      );
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: calc(100% - 50px);
  background-color: rgba(255, 255, 255, 0.8);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.control-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: linear-gradient(45deg, #ffd3b6, #b2ebf2);
  color: #333;
  cursor: pointer;
  transition: background 0.3s ease;
  text-align: center;
}

.control-btn:hover {
  background: linear-gradient(45deg, #ffb299, #80d8ff);
}

.history-panel {
  margin-top: 1rem;
  max-height: 200px;
  overflow: auto;
}

.script-tooltip {
  position: absolute;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 0.5rem;
  max-width: 300px;
  z-index: 3;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  text-overflow: ellipsis;
}

.script-info {
  display: flex;
  align-items: center;
}

.script-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.script-icon {
  margin-right: 0.5rem;
}

.script-date {
  font-size: 0.8rem;
  color: #888;
}

.load-btn,
.delete-btn,
.rename-btn {
  background: #f9f9f9;
  border: 1px solid #ccc;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.action-btn:hover {
  background: #e6e6e6;
}

.tooltip-date {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.5rem;
}
</style>
