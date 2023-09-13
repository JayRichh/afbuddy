<template>
  <div class="user-agent-container">
    <div v-for="agent in userAgents" :key="agent.title" class="agent-card">
      <label :for="agent.title" class="input-label">{{ agent.title }}:</label>
      <div class="input-group">
        <select :id="agent.title" v-model="selectedAgents[agent.title]" class="select-input">
          <option v-for="value in agent.values" :key="value.title" :value="value.value">
            {{ value.title }} ({{ value.platform }})
          </option>
        </select>
      </div>
    </div>
    <div class="button-group">
      <button class="button-group-item button-group-item--left" @click="setUserAgent">Set</button>
      <button class="button-group-item button-group-item--right" @click="resetUserAgent">
        Reset
      </button>
    </div>
    <div v-if="feedbackMessage" class="feedback-message">
      {{ feedbackMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import userAgents from '../../../src/utils/store/data/userAgents';
import { useStore } from 'vuex';

export default defineComponent({
  data() {
    return {
      userAgents,
      selectedAgents: this.initializeSelectedAgents(),
      feedbackMessage: '',
    };
  },
  setup() {
    const store = useStore();
    return { store };
  },
  methods: {
    setUserAgent() {
      let message = 'User agent set to:\n';
      for (const agentTitle in this.selectedAgents) {
        message += `${agentTitle}: ${this.selectedAgents[agentTitle]}\n`;
      }
      this.feedbackMessage = message;
      this.store.dispatch('setUserAgent', this.selectedAgents);
    },
    resetUserAgent() {
      this.feedbackMessage = 'User agent reset to default';
      this.store.dispatch('resetUserAgent');
    },
    initializeSelectedAgents() {
      const agents: { [key: string]: string } = {};
      for (const agent of userAgents) {
        agents[agent.title] = agent.values[0].value;
      }
      return agents;
    },
  },
});
</script>

<style scoped lang="scss">
.user-agent-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 60px 0 0 0;
  width: 100%;
  overflow-y: auto;
}

.agent-card {
  width: 85%;
  margin-bottom: 1rem;
}

.input-label {
  text-align: left;
  color: #555;
  width: 85%;
  font-weight: 500;
  left: 0;
  margin: 0;
  padding: 0;
  bottom: -0.2rem;
  position: relative;
}

.input-group {
  width: 87.5%;
  margin-bottom: 20px;
}

.select-input {
  color: #555;
  border-radius: 5px;
  width: 87.5%;
  padding: 5px;
  font-size: 1.1em;
  font-weight: 500;
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
}

.button-group-item--right {
  background-color: #007bff;
  color: white;
}
</style>
