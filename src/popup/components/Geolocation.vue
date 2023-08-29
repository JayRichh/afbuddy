<template>
  <div class="geo-container">
    <form @submit.prevent="emitData">
      <div class="input-group">
        <label for="timezone">TimeZone:</label>
        <input
          type="text"
          id="timezone"
          placeholder="Asia/Kolkata"
          v-model="timezone"
          aria-label="Time Zone"
        />
      </div>

      <div class="input-group">
        <label for="locale">Locale:</label>
        <input
          type="text"
          id="locale"
          placeholder="en-US"
          v-model="locale"
          aria-label="Locale"
        />
      </div>

      <div class="input-group">
        <label for="latitude">Latitude:</label>
        <input
          type="text"
          id="latitude"
          placeholder="19.0760"
          v-model="latitude"
          aria-label="Latitude"
        />
      </div>

      <div class="input-group">
        <label for="longitude">Longitude:</label>
        <input
          type="text"
          id="longitude"
          placeholder="72.8777"
          v-model="longitude"
          aria-label="Longitude"
        />
      </div>

      <div class="checkbox-group">
        <input type="checkbox" id="defaultGeo" v-model="useDefault" />
        <label style="cursor: pointer; font-size: 1rem" for="defaultGeo"
          >Use Browser's Default Geolocation</label
        >
      </div>

      <button type="submit">Spoof Location</button>
    </form>

    <p v-if="feedbackMessage" class="feedback">{{ feedbackMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  data() {
    return {
      timezone: '',
      locale: '',
      latitude: '',
      longitude: '',
      useDefault: false,
      feedbackMessage: '',
    };
  },
  methods: {
    emitData() {
      this.$emit('spoofLocation', {
        timezone: this.timezone,
        locale: this.locale,
        latitude: this.latitude,
        longitude: this.longitude,
        useDefault: this.useDefault,
      });
      this.feedbackMessage = 'Location spoofed successfully!';
    },
  },
});
</script>

<style scoped lang="scss">
.geo-container {
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
  margin: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-x: hidden;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

label {
  color: #888;
  font-size: 1rem;
}

input[type='text'] {
  padding: 0.5rem;
  border: 2px solid #b2ebf2;
  border-radius: 4px;
  color: #333;
  transition: border-color 0.3s ease;
}

input[type='text']:focus {
  border-color: #00bcd4;
  outline: none;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input[type='checkbox'] {
  appearance: none;
  width: 20px;
  height: 20px;
  background-color: #b2ebf2;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
}

input[type='checkbox']:checked::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: #ffd3b6;
  border-radius: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.feedback {
  color: #4caf50;
  font-weight: bold;
}
</style>
