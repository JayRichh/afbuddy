<template>
  <div class="user-agent-container">
    <div v-for="agent in userAgents" :key="agent.title" class="agent-card">
      <h3>{{ agent.title }}</h3>
      <div class="input-group">
        <select :id="agent.title" v-model="selectedAgents[agent.title]">
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
import { defineComponent, ref } from "vue";
import userAgents from "../../../src/utils/userAgents";

export default defineComponent({
  data() {
    return {
      userAgents,
      selectedAgents: this.initializeSelectedAgents(),
      feedbackMessage: "",
    };
  },
  methods: {
    setUserAgent() {
      let message = "User agent set to:\n";
      for (const agentTitle in this.selectedAgents) {
        message += `${agentTitle}: ${this.selectedAgents[agentTitle]}\n`;
      }
      this.feedbackMessage = message;
    },
    resetUserAgent() {
      this.feedbackMessage = "User agent reset to default";
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  padding: 0 10px;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  box-sizing: border-box;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.feedback-message {
  margin-top: 1rem;
  color: #4caf50;
  font-weight: bold;
}

label {
  font-size: 1rem;
}

select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  appearance: none;
  background: url("../../../assets/dropdown-arrow.svg") no-repeat right 0.5rem
    center;
  padding-right: 2rem;
  background-size: 1rem;
  background-color: #fff;
  cursor: pointer;
}

option {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
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

button:active {
  transform: scale(0.98);
}

button:hover {
  background: linear-gradient(45deg, #ffb299, #80d8ff);
}

.agent-card {
  padding: 0;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: row;
}

h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px 0 0 8px;
  background-color: #f6f8fa;
  color: #333;
  font-weight: bold;
  flex: 1;
}

/*
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
h3.android::before {
  content: url("~@/assets/android-icon.svg");
  display: inline-block;
  width: 24px;
  height: 24px;
}
*/

.feedback-message {
  margin-top: 1rem;
  color: #4caf50;
  font-weight: bold;
}
</style>
