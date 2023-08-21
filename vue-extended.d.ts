declare module 'vue/types/vue' {
  interface Vue {
    $style: {
      [key: string]: string | number;
      '--sun-rotation-deg': string;
      '--moon-rotation-deg': string;
    }
  }
}
