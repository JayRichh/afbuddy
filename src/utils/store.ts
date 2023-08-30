import { createStore } from 'vuex';

export default createStore({
  state: {
    selectedLanguage: this.commit('loadFromLocalStorage', 'language') || 'en',
    rememberLanguage:
      this.commit('loadFromLocalStorage', 'rememberLanguage') === 'true',
    tooltipText: '',
    tooltipX: 0,
    tooltipY: 0,
    showTooltip: false,
    theme: '',
    themeData: {},
    isCodeEditorPreview: false,
    currentComponent: '',
    crazyModeEnabled: false,
  },
  mutations: {
    setTooltipText(state, text) {
      state.tooltipText = text;
    },
    setTooltipX(state, x) {
      state.tooltipX = x;
    },
    setTooltipY(state, y) {
      state.tooltipY = y;
    },
    setShowTooltip(state, show) {
      state.showTooltip = show;
    },
    setTheme(state, theme) {
      state.theme = theme;
    },
    setThemeData(state, themeData) {
      state.themeData = themeData;
    },
    setIsCodeEditorPreview(state, isCodeEditorPreview) {
      state.isCodeEditorPreview = isCodeEditorPreview;
    },
    setCurrentComponent(state, currentComponent) {
      state.currentComponent = currentComponent;
    },
    setCrazyModeEnabled(state, crazyModeEnabled) {
      state.crazyModeEnabled = crazyModeEnabled;
    },
    setSelectedLanguage(state, language) {
      this.commit('setSelectedLanguage', language);
      this.commit('saveToLocalStorage', { key: 'language', value: language });
    },
    setRememberLanguage(state, remember) {
      commit('setRememberLanguage', remember);
      this.commit('saveToLocalStorage', {
        key: 'rememberLanguage',
        value: remember.toString(),
      });
    },
    saveToLocalStorage(_, { key, value }) {
      localStorage.setItem(key, value);
    },
  },
});
