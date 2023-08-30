<template>
  <div class="code-controls-container">
    <div class="button-group">
      <button class="control-btn" @click="saveToLocalStorage">
        Save Code 💾
      </button>
      <button class="control-btn" @click="loadFromLocalStorage">
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
          <div v-if="hoveredScript === script" class="script-tooltip">
            {{ script.content }}
            <div class="tooltip-date">{{ script.date }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

type Script = {
  id: number;
  date: string;
  content: string;
};

export default defineComponent({
  data() {
    return {
      scripts: [] as Script[],
      hoveredScript: null as Script | null,
      searchTerm: '',
    };
  },
  computed: {
    filteredScripts() {
      if (!this.searchTerm) return this.scripts;
      return this.scripts.filter((script) =>
        script.content.includes(this.searchTerm),
      );
    },
  },
  methods: {
    // saveToLocalStorage() {
    // Logic to save the current script to localStorage
    // Emit the save-code event to the parent component to get the current script
    //   this.$emit('save-code');
    // },
    // loadFromLocalStorage() {
    // Logic to load scripts from localStorage
    // Emit the load-code event to the parent component to set the loaded script
    //   this.$emit('load-code');
    // },
    deleteScript(script: Script) {
      // Logic to delete the selected script from localStorage and the scripts array
    },
    renameScript(script: Script) {
      // Logic to rename the selected script
    },
    showPreview(script: Script, event: MouseEvent) {
      this.hoveredScript = script;
      this.$emit('show-tooltip', {
        content: script.content,
        x: event.pageX,
        y: event.pageY,
      });
    },
    hidePreview() {
      this.hoveredScript = null;
      this.$emit('hide-tooltip');
    },
    loadScriptIntoMainEditor(script: Script) {
      this.$emit('load-script-content', script.content);
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
  z-index: 10;
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
