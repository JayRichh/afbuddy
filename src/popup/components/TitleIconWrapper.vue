<template>
  <div class="title-icon-wrapper">
    <h1>{{ title }}</h1>
    <img
      class="icon"
      :src="iconSrc"
      alt="Icon"
      @click="handleIconClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, Prop } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    iconSrc: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleIconClick() {
      this.$emit('brushClick');
    },
  },
});
</script>

<style scoped lang="scss">
.title-icon-wrapper {
  display: flex;
  align-items: center;

  h1 {
    margin-right: 10px;
    font-size: 24px;
    font-family: "Montserrat", sans-serif;
  }

  .icon {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
}
</style>
