<template>
  <div class="user-agent-container">
    <div v-for="agent in userAgents" :key="agent.title" class="agent-card">
      <h3>{{ agent.title }}</h3>
      <div class="input-group">
        <select
          :id="agent.title"
          v-model="selectedAgents[agent.title]"
          @change="changeUserAgent(agent.title)"
        >
          <option
            v-for="value in agent.values"
            :key="value.title"
            :value="value.value"
          >
            {{ value.title }} ({{ value.platform }})
          </option>
        </select>
      </div>
    </div>

    <div class="button-group">
      <button @click="setUserAgent">Set User Agent</button>
      <button @click="resetUserAgent">Reset to Default</button>
    </div>
    <div v-if="feedbackMessage" class="feedback-message">
      {{ feedbackMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import userAgents from '../../../src/utils/userAgents';
// import { setUserAgent } from '../../../src/background/index';

export default defineComponent({
  data() {
    return {
      userAgents,
      selectedAgents: this.initializeSelectedAgents(),
      feedbackMessage: '',
    };
  },
  methods: {
    setUserAgent() {
      let message = 'User agent set to:\n';
      for (const agentTitle in this.selectedAgents) {
        message += `${agentTitle}: ${this.selectedAgents[agentTitle]}\n`;
      }
      this.feedbackMessage = message;
    },
    resetUserAgent() {
      this.feedbackMessage = 'User agent reset to default';
    },
    // changeUserAgent(agentTitle: string) {
    //   setUserAgent(this.selectedAgents[agentTitle]);
    // },
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
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
}

.agent-card {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  padding: 10px;
  background-color: #f6f8fa;
  color: #333;
  font-weight: bold;
}

.input-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  appearance: none;
  background: url('../../../assets/dropdown-arrow.svg') no-repeat right 0.5rem
    center;
  padding-right: 2rem;
  background-size: 1rem;
  background-color: #fff;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: linear-gradient(45deg, #ffd3b6, #b2ebf2);
  color: #333;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:active {
  transform: scale(0.98);
}

button:hover {
  background: linear-gradient(45deg, #ffb299, #80d8ff);
}

.feedback-message {
  margin-top: 1rem;
  color: #4caf50;
  font-weight: bold;
}

option {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}
</style>
