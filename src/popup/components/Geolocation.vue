<template>
  <div class="geo-container">
    <div class="input-group">
      <label for="timeZone" class="input-label">TimeZone:</label>
      <input
        type="text"
        id="timeZone"
        placeholder="Asia/Kolkata"
        v-model="timeZone"
        class="text-input"
        aria-label="Time Zone"
      />
    </div>

    <div class="input-group">
      <label for="locale" class="input-label">Locale:</label>
      <input
        type="text"
        id="locale"
        placeholder="en-US"
        v-model="locale"
        class="text-input"
        aria-label="Locale"
      />
    </div>

    <div class="input-group">
      <label for="latitude" class="input-label">Latitude:</label>
      <input
        type="text"
        id="latitude"
        placeholder="19.0760"
        v-model="latitude"
        class="text-input"
        aria-label="Latitude"
      />
    </div>

    <div class="input-group">
      <label for="longitude" class="input-label">Longitude:</label>
      <input
        type="text"
        id="longitude"
        placeholder="72.8777"
        v-model="longitude"
        class="text-input"
        aria-label="Longitude"
      />
    </div>

    <div class="checkbox-group">
      <div class="checkbox-wrapper">
        <input type="checkbox" id="defaultGeo" v-model="useDefault" class="checkbox-input" />
        <label for="defaultGeo" class="checkbox-label">Use Browser's Default Geolocation</label>
      </div>
    </div>

    <div class="button-group">
      <button
        @click="setGeolocation"
        class="button-group-item button-group-item--right"
        type="button"
      >
        Spoof
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Geolocation',
  setup() {
    const store = useStore();
    const timeZone = ref('');
    const locale = ref('');
    const latitude = ref('');
    const longitude = ref('');
    const useDefault = ref(false);

    const setGeolocation = () => {
      store.dispatch('setGeolocation', {
        timeZone: timeZone.value,
        locale: locale.value,
        latitude: latitude.value,
        longitude: longitude.value,
        useDefault: useDefault.value,
      });
    };

    return {
      timeZone,
      locale,
      latitude,
      longitude,
      useDefault,
      setGeolocation,
    };
  },
});
</script>

<style scoped lang="scss">
.geo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  width: 100%;
  height: 100%;
}

.input-group {
  width: 85%;
  margin-bottom: 0.4rem;
}

.input-label,
.checkbox-label {
  text-align: left;
  color: #555;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.text-input {
  color: #555;
  border-radius: 5px;
  width: 70%;
  padding: 5px;
  font-size: 1.1em;
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.button-group {
  margin-top: 0.4rem;
}

.button-group-item {
  cursor: pointer;
  text-transform: uppercase;
  height: 38px;
  width: 45%;
  margin: 0 5px;
  border: none;
  border-radius: 0.25rem;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.button-group-item--right {
  background-color: #007bff;
  color: white;
}
</style>
