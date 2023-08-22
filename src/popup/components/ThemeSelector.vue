<template>
  <Tooltip
    v-if="showTooltip"
    :content="tooltipText"
    :x="tooltipX"
    :y="tooltipY"
    :isCodeEditorPreview="true"
    :themeData="themeCache[selectedTheme] || {}"
    :theme="selectedTheme"
    :visible="showTooltip"
  ></Tooltip>
  <div class="theme-selector-container">
    <label for="theme-select" class="theme-label">Select Theme:</label>
    <select
      id="theme-select"
      :value="selectedTheme"
      @change="applySelectedTheme"
      @mouseover="handleThemeMouseOver"
      @mousemove="adjustTooltipPosition"
      @mouseout="handleMouseOut"
    >
      <option v-for="theme in themes" :value="theme" :key="theme">
        {{ theme }}
      </option>
    </select>

    <div class="button-group">
      <button @click="applySelectedTheme" class="primary-btn">
        Apply
      </button>
      <button @click="setDefaultTheme" class="secondary-btn">
        Default
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from "vue";
import { themeList } from "../../popup/themes";
import Tooltip from "./Tooltip.vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

interface Props {
  currentTheme: string;
  currentThemeData: monaco.editor.IStandaloneThemeData;
}

interface Data {
  themes: string[];
  selectedTheme: string;
  showTooltip: boolean;
  tooltipText: string;
  tooltipX: number;
  tooltipY: number;
  themeCache: Record<string, monaco.editor.IStandaloneThemeData>;
  themeListArr: string[];
}

export default defineComponent({
  components: {
    Tooltip,
  },
  props: {
    currentTheme: String,
    currentThemeData: Object as () => monaco.editor.IStandaloneThemeData,
  },
  data(): Data {
    return {
      themes: themeList,
      selectedTheme: "",
      showTooltip: false,
      tooltipText: "",
      tooltipX: 0,
      tooltipY: 0,
      themeCache: {},
      themeListArr: [],
    };
  },
  async mounted() {
    this.themes = JSON.parse(JSON.stringify(themeList));
    console.log(this.themes);
    console.log({ EventTarget });

    chrome.storage.local.get("selectedTheme", (data) => {
      if (data && data.selectedTheme) {
        // If a theme is found in local storage
        this.selectedTheme = data.selectedTheme;
        this.applySelectedTheme();
      } else {
        this.setDefaultTheme();
      }
    });
  },
  methods: {
    async handleThemeMouseOver(event: MouseEvent): Promise<void> {
      this.showTooltip = true;
      const target = event.target as HTMLOptionElement;

      if (target && target.value) {
        const cachedTheme = this.themeCache[target.value];
        let url = chrome.runtime.getURL(
          `/assets/themes/${encodeURIComponent(target.value)}.json`
        );

        if (cachedTheme) {
          this.$emit("showThemeTooltip", {
            x: event.pageX,
            y: event.pageY,
            theme: target.value,
            themeData: cachedTheme,
          });
          return;
        }

        const response: string = await new Promise((resolve) => {
          chrome.runtime.sendMessage(
            { contentScriptQuery: "getdata", url: url },
            (response: string) => {
              resolve(response);
            }
          );
        });

        if (response) {
          const themeData: monaco.editor.IStandaloneThemeData = JSON.parse(
            response
          );
          this.themeCache[target.value] = themeData;
          this.$emit("showThemeTooltip", {
            x: event.pageX,
            y: event.pageY,
            theme: target.value,
            themeData,
          });
        } else {
          console.error("Error fetching theme data");
        }
      }
    },

    adjustTooltipPosition(event: MouseEvent): void {
      this.tooltipX = event.clientX + 10;
      this.tooltipY = event.clientY + 10;
    },
    handleMouseOut(): void {
      this.$emit("hideThemeTooltip");
      this.showTooltip = false;
    },
    handleComponentChange(componentName: string) {
      this.$emit("changeComponent", componentName);
    },
    evalInIframe(code: string) {
      eval(code);
    },
    formatTitle(componentName: string) {
      return componentName
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    },

    async applyTooltipTheme(theme: string): Promise<void> {
      console.log("theme:", theme);
      let url = chrome.runtime.getURL(
        `/assets/themes/${encodeURIComponent(theme)}.json`
      );
      console.log(url);

      try {
        const cachedTheme = this.themeCache[theme];
        if (cachedTheme) {
          this.$emit("applyTooltipTheme", cachedTheme);
          return;
        }
      } catch (error) {
        console.error("error:", error);
      }

      try {
        const response = await fetch(url);
        const themeData: monaco.editor.IStandaloneThemeData = await response.json();

        // ensure that the theme data is correctly applied to the Monaco editor
        if (
          themeData &&
          themeData.base &&
          themeData.colors &&
          themeData.rules
        ) {
          this.themeCache[theme] = themeData;
          this.$emit("applyTooltipTheme", themeData);
          monaco.editor.defineTheme(this.selectedTheme, themeData);
          monaco.editor.setTheme(this.selectedTheme);
        } else {
          console.error("Invalid theme data received: ", themeData);
        }
      } catch (error) {
        console.error("Error fetching theme data. Error: ", error);
      }
    },
    async applySelectedTheme() {
      try {
        await this.setToStorage("selectedTheme", this.selectedTheme);
        this.$emit("applySelectedTheme", this.selectedTheme);
        this.$emit("applyTooltipTheme", this.selectedTheme);
      } catch (error) {
        console.error("Error applying selected theme. Error: ", error);
      }
    },
    getFromStorage(key: string): Promise<any> {
      return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
          resolve(result[key]);
        });
      });
    },
    setDefaultTheme() {
      this.selectedTheme = this.themes[0];
      console.log("selectedTheme:", this.selectedTheme);
      this.applySelectedTheme();
    },
    setTabWidth(width: number) {
      chrome.runtime.sendMessage({ action: "setTabWidth", width: width });
    },
    saveCode() {
      chrome.runtime.sendMessage({ action: "saveCode" });
    },
    loadCode() {
      chrome.runtime.sendMessage({ action: "loadCode" });
    },

    async setToStorage(key: string, value: any): Promise<boolean> {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(true);
          }
        });
      });
    },
  },
});
</script>

<style scoped lang="scss">
template {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #5d9cec;
  cursor: pointer;
  margin-top: 1em;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
}

button:hover {
  background-color: #666;
  box-shadow: 0 0 3px #555;
}

button:active {
  transform: scale(0.98);
}

.theme-selector-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
  
}

select {
  padding: 10px;
  outline: none;
  border-radius: 5px;
  border: 1px lightgray solid;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #f3f3f3;
  transition: box-shadow 0.3s ease-in-out;
  background-image: url("../../../assets/dropdown-arrow.svg");
  background-repeat: no-repeat;
  background-position: 95% center;
  padding-right: 35px;
  cursor: pointer;
}

option {
  padding: 10px;
  border-radius: 5px;
  border: 1px lightgray solid;
  background-color: #f3f3f3;
  transition: box-shadow 0.3s ease-in-out;
  cursor: pointer;
}

select:hover {
  box-shadow: 0 0 3px #555;
}

select:focus {
  box-shadow: 0 0 5px #555;
}

button:focus {
  outline: none;
  box-shadow: 0 0 5px #555;
}

label {
  font-size: 1.1em;
  font-weight: bold;
}

.theme-label {
  text-transform: uppercase;
  font-weight: bold;
  padding: 0;
  margin-bottom: 0;
  color: #555;
  display: block;
  text-align: left;

}

.primary-btn {
  background-color: #4caf50; /* Green background */
  color: white;
  margin-right: 10px;
  &::after {
    content: "✓";
  }

  &::hover {
    transform: scale(1.02) translateY(-1px) translateX(1px) !important;
  }

  &::active {
    transform: scale(0.98) !important;
  }
}

.secondary-btn {
  background-color: #ff5722; /* Orange background */
  color: white;

  &::after {
    content: "x";
  }

  &::hover {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: scale(1.02) translateY(-1px) translateX(1px) !important;
  }

  &::active {
    transform: scale(0.98) !important;
  }
}

.button-group {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}
</style>
