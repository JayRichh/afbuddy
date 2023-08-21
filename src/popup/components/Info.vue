<template>
  <div class="info-container">
    <p>
      This application allows users to spoof their geolocation, customize their
      browsing experience, and more. Use each section on the left navbar to
      access different functionalities.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Info",
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
