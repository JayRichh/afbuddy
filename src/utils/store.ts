import { getThemes } from '../popup/themesList';
import { NavItems } from '../utils/config';
import { createStore } from 'vuex';
import { userAgents } from '../../src/utils/userAgents';

export default createStore({
  state: {
    selectedLanguage: 'en',
    rememberLanguage: false,
    tooltipText: '',
    tooltipX: 0,
    tooltipY: 0,
    showTooltip: false,
    theme: localStorage.getItem('theme') || 'default',
    jsonViewerTheme: 'Github',
    themeData: {},
    isCodeEditorPreview: false,
    currentComponent: '',
    crazyModeEnabled: false,
    autoFormat: true as boolean,
    selectedThemeKey: 'active4d',
    themesArray: [],
    themeNamesArray: [],
    themeList: {},
    userAgents: userAgents,
    navItems: NavItems,
  },
  mutations: {
    setAutoFormat(state, autoFormat: boolean) {
      state.autoFormat = autoFormat;
    },
    setJsonViewerTheme(state, theme) {
      state.jsonViewerTheme = theme;
    },
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
    setSelectedLanguage(state, language: string) {
      state.selectedLanguage = language;
      localStorage.setItem('language', language);
    },
    setRememberLanguage(state, remember: boolean) {
      state.rememberLanguage = remember;
      localStorage.setItem('rememberLanguage', remember.toString());
    },
    setSelectedThemeKey(state, key) {
      state.selectedThemeKey = key;
    },
    setThemesArray(state, themes) {
      state.themesArray = themes;
    },
    setThemeNamesArray(state, names) {
      state.themeNamesArray = names;
    },
    setThemeList(state, list) {
      state.themeList = list;
    },
  },
  actions: {
    async initializeStore({ dispatch, commit }) {
      await dispatch('fetchThemes');
      commit('setSelectedLanguage', localStorage.getItem('language'));
      commit(
        'setRememberLanguage',
        localStorage.getItem('rememberLanguage') === 'true',
      );
    },
    async fetchThemes({ commit }) {
      const { themeNamesArray, themeList, themesArray } = await getThemes();
      commit('setThemesArray', themesArray);
      commit('setThemeNamesArray', themeNamesArray);
      commit('setThemeList', themeList);
    },
  },
  getters: {
    jsonViewerTheme: (state) => state.jsonViewerTheme,
    autoFormat: (state) => state.autoFormat,
  },
});
