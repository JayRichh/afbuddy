import { NavItems } from '../utils/config';
import { createStore } from 'vuex';
import { userAgents } from '../../src/utils/userAgents';
import { getThemes } from 'src/popup/themesList';

interface State {
  tooltipText: string;
  tooltipX: number;
  tooltipY: number;
  currentComponent: string;
  jsonObjects: object;
  timeZone: string;
  locale: string;
  latitude: number;
  longitude: number;
  defaultView: string;
  feedbackMessage: string;
  language: string;
  rememberLanguage: boolean;
  monacoTheme: string;
  showModal: boolean;
  jsonViewerTheme: string;
  autoFormat: boolean;
  monacoContainer: any;
  editorInstance: any;
  navItems: typeof NavItems;
  crazyModeEnabled: boolean;
  tabWidth: number;
  tabManagementEnabled: boolean;
  tabSetPoint: number;
  themeData: object;
  themes: any[];
  isCodeEditorPreview: boolean;
  showTooltip: boolean;
  tooltipTheme: object;
  userAgents: typeof userAgents;
  userAgent: string;
  draggableElements: HTMLElement[];
}

export default createStore<State>({
  state: {
    // Common
    draggableElements: [],
    tooltipText: '',
    tooltipX: 0,
    tooltipY: 0,
    currentComponent: '',

    // CodeControls.vue
    jsonObjects: {},

    // Geolocation.vue
    timeZone: '',
    locale: '',
    latitude: 0,
    longitude: 0,
    defaultView: '',
    feedbackMessage: '',

    // Info.vue
    language: 'English',
    rememberLanguage: false,

    // Json.vue
    monacoTheme: '',
    showModal: false,
    jsonViewerTheme: '',
    autoFormat: false,
    monacoContainer: null,
    editorInstance: null,

    // Navbar.vue
    navItems: NavItems,
    crazyModeEnabled: false,

    // TabManager.vue
    tabWidth: 0,
    tabManagementEnabled: false,
    tabSetPoint: 0,

    // ThemeSelector.vue
    themeData: {},
    themes: [],

    // Tooltip.vue
    isCodeEditorPreview: false,
    showTooltip: false,
    tooltipTheme: {},

    // UserAgents.vue
    userAgents: userAgents,
    userAgent: '',
  },
  getters: {
    // common
    getDraggableElements: (state) => state.draggableElements,
    getTooltipText: (state) => state.tooltipText,
    getTooltipX: (state) => state.tooltipX,
    getTooltipY: (state) => state.tooltipY,
    getCurrentComponent: (state) => state.currentComponent,
    // Component-specific getters
    getJsonObjects: (state) => state.jsonObjects,
    getTimeZone: (state) => state.timeZone,
    getLocale: (state) => state.locale,
    getLatitude: (state) => state.latitude,
    getLongitude: (state) => state.longitude,
    getDefaultView: (state) => state.defaultView,
    getFeedbackMessage: (state) => state.feedbackMessage,
    getLanguage: (state) => state.language,
    getMonacoTheme: (state) => state.monacoTheme,
    getShowModal: (state) => state.showModal,
    getCrazyMode: (state) => state.crazyModeEnabled,
    getTabWidth: (state) => state.tabWidth,
    getTabManagementEnabled: (state) => state.tabManagementEnabled,
    getTabSetPoint: (state) => state.tabSetPoint,
    getThemeData: (state) => state.themeData,
    getTooltipTheme: (state) => state.tooltipTheme,
    getUserAgent: (state) => state.userAgent,
    getMonacoContainer: (state) => state.monacoContainer,
    getEditorInstance: (state) => state.editorInstance,
  },
  mutations: {
    updateState(state: State, payload: Partial<State>) {
      Object.keys(payload).forEach((key) => {
        (state as any)[key] = (payload as any)[key];
      });
    },
    // Common
    setDraggableElements(state, payload: HTMLElement[]) {
      state.draggableElements = payload;
    },
    setTooltipText(state, payload) {
      state.tooltipText = payload;
    },
    setTooltipX(state, payload) {
      state.tooltipX = payload;
    },
    setTooltipY(state, payload) {
      state.tooltipY = payload;
    },
    setCurrentComponent(state, payload) {
      state.currentComponent = payload;
    },
    setThemes(state, payload) {
      state.themes = payload;
    },
    setShowTooltip(state, value) {
      state.showTooltip = value;
    },

    setMonacoContainer(state, payload: HTMLElement | null) {
      if (payload) {
        state.monacoContainer = payload;
      } else {
        console.error('Invalid monacoContainer');
      }
    },

    setEditorInstance(
      state,
      payload: monaco.editor.IStandaloneCodeEditor | null,
    ) {
      if (payload) {
        state.editorInstance = payload;
      } else {
        console.error('Invalid editorInstance');
      }
    },

    // Component-specific mutations
    setJsonObjects(state, payload) {
      state.jsonObjects = payload;
    },
    setTimeZone(state, payload) {
      state.timeZone = payload;
    },
    setLocale(state, payload) {
      state.locale = payload;
    },
    setLatitude(state, payload) {
      state.latitude = payload;
    },
    setLongitude(state, payload) {
      state.longitude = payload;
    },
    setDefaultView(state, payload) {
      state.defaultView = payload;
    },
    setFeedbackMessage(state, payload) {
      state.feedbackMessage = payload;
    },
    setLanguage(state, payload) {
      state.language = payload;
    },
    setRememberLanguage(state, payload) {
      state.rememberLanguage = payload;
    },
    setMonacoTheme(state, payload) {
      state.monacoTheme = payload;
    },
    setShowModal(state, payload) {
      state.showModal = payload;
    },
    setCrazyModeEnabled(state, payload: boolean) {
      state.crazyModeEnabled = payload;
    },
    setTabWidth(state, payload) {
      state.tabWidth = payload;
    },
    setTabManagementEnabled(state, payload) {
      state.tabManagementEnabled = payload;
    },
    setTabSetPoint(state, payload) {
      state.tabSetPoint = payload;
    },
    setThemeData(state, payload) {
      state.themeData = payload;
    },
    setTooltipTheme(state, payload) {
      state.tooltipTheme = payload;
    },
    setUserAgent(state, payload) {
      state.userAgent = payload;
    },
  },
  actions: {
    async initializeDraggableElements({ commit }) {
      const elements = Array.from(
        document.querySelectorAll('.global-draggable'),
      ) as HTMLElement[];
      commit('setDraggableElements', elements);
    },
    async initializeStore({ dispatch }) {
      await dispatch('updateThemes');
    },
    async updateThemes({ commit }) {
      const themes = await getThemes();
      commit('updateState', { themes });
    },
    applyTheme({ commit, dispatch }, payload: any) {
      commit('updateState', {
        themeData: payload.themeData,
        tooltipTheme: payload.tooltipTheme,
      });
      dispatch('createEditor', { theme: payload.themeData });
    },
    createEditor(
      { commit },
      payload: {
        monacoContainer: HTMLElement | null;
        editorInstance: monaco.editor.IStandaloneCodeEditor | null;
      },
    ) {
      if (payload.monacoContainer && payload.editorInstance) {
        commit('setMonacoContainer', payload.monacoContainer);
        commit('setEditorInstance', payload.editorInstance);
      } else {
        console.error('Invalid parameters for createEditor');
      }
    },
    updateState({ commit }, payload: Partial<State>) {
      commit('updateState', payload);
    },
    saveJsonToLocalStorage({ commit, state }) {
      localStorage.setItem('jsonObjects', JSON.stringify(state.jsonObjects));
      commit('updateState', { jsonObjects: state.jsonObjects });
    },
    loadJsonFromLocalStorage({ commit }) {
      const loadedData = JSON.parse(
        localStorage.getItem('jsonObjects') || '{}',
      );
      commit('updateState', { jsonObjects: loadedData });
    },
    formatJSON({ commit }, json: string) {
      try {
        const parsedJson = JSON.parse(json);
        commit('updateState', {
          jsonObjects: JSON.stringify(parsedJson, null, 2),
        });
      } catch (e) {
        console.error('Invalid JSON', e);
      }
    },
    setGeolocation({ commit }, payload: any) {
      commit('updateState', {
        timeZone: payload.timeZone,
        locale: payload.locale,
        latitude: payload.latitude,
        longitude: payload.longitude,
        defaultView: payload.defaultView,
      });
    },
    resetGeolocation({ commit }) {
      commit('updateState', {
        timeZone: '',
        locale: '',
        latitude: 0,
        longitude: 0,
      });
    },

    applySelectedTheme({ commit }, selectedThemeKey) {
      // Logic to apply theme
      commit('setSelectedThemeKey', selectedThemeKey);
    },
    setDefaultTheme({ commit }) {
      commit('setSelectedThemeKey', 'defaultTheme');
    },
    // Common
    updateTooltipText({ commit }, payload) {
      commit('setTooltipText', payload);
    },
    updateTooltipX({ commit }, payload) {
      commit('setTooltipX', payload);
    },
    updateTooltipY({ commit }, payload) {
      commit('setTooltipY', payload);
    },
    updateCurrentComponent({ commit }, payload) {
      commit('setCurrentComponent', payload);
    },
    updateFeedbackMessage({ commit }, payload) {
      commit('setFeedbackMessage', payload);
    },
    saveLanguage({ commit }, payload) {
      commit('setLanguage', payload.selectedLanguage);
      commit('setRememberLanguage', payload.rememberLanguage);
    },

    setMonacoContainer({ commit }, payload) {
      commit('setMonacoContainer', payload);
    },
    setEditorInstance({ commit }, payload) {
      commit('setEditorInstance', payload);
    },

    updateNavItems({ commit }, payload) {
      commit('setNavItems', payload);
    },
    updateMonacoTheme({ commit }, payload) {
      commit('setMonacoTheme', payload);
    },
    updateIsCodeEditorPreview({ commit }, payload) {
      commit('setIsCodeEditorPreview', payload);
    },
    updateShowTooltip({ commit }, payload) {
      commit('setShowTooltip', payload);
    },
    updateJsonViewerTheme({ commit }, payload) {
      commit('setJsonViewerTheme', payload);
    },
    updateAutoFormat({ commit }, payload) {
      commit('setAutoFormat', payload);
    },
    updateMonacoContainer({ commit }, payload) {
      commit('setMonacoContainer', payload);
    },
  },
});
