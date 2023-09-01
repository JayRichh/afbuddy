<template>
  <div class="info-container">
    <p>
      This application allows users to spoof their geolocation, customize their
      browsing experience, and more. Use each section on the left navbar to
      access different functionalities.
    </p>
  </div>
  <div class="language-selector">
    <label for="language-select">{{ $t('Select Language') }}:</label>
    <select
      v-model="selectedLanguage"
      id="language-select"
      @change="saveLanguage"
    >
      <option value="en">{{ $t('English') }}</option>
      <option value="no">{{ $t('Norwegian') }}</option>
    </select>
  </div>
  <div>
    <input
      type="checkbox"
      id="remember-language"
      v-model="rememberLanguage"
      @change="saveLanguage"
    />
    <label for="remember-language">Remember Language</label>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { mapState } from 'vuex';

export default defineComponent({
  computed: {
    ...mapState(['selectedLanguage', 'rememberLanguage']),
  },
  methods: {
    saveLanguage() {
      this.$store.dispatch('saveLanguage', {
        selectedLanguage: this.selectedLanguage,
        rememberLanguage: this.rememberLanguage,
      });
    },
  },
});
</script>

<style scoped lang="scss">
.info-container {
  padding: 5px 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  margin: 0;
  width: calc(100% - 20px);
}

h2 {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

p {
  color: #888;
  line-height: 1.4;
  margin-bottom: 1rem;
}
</style>
