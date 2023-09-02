import { NavItem, NavItems } from '../utils/config';
import { getThemes } from '../popup/themesList';
import { createStore } from 'vuex';
import { userAgents } from '../../src/utils/userAgents';
import { Theme, themeList } from 'src/popup/themesList';
import * as monaco from 'monaco-editor';
import { PIDState } from './pidstate';

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
  themeData: Theme;
  themes: {
    themesArray: Record<string, Theme>;
    themeNamesArray: string[];
    themeList: Record<string, string>;
  };
  selectedTheme: Theme;
  isCodeEditorPreview: boolean;
  showTooltip: boolean;
  tooltipTheme: object;
  userAgents: typeof userAgents;
  userAgent: string;
  draggableElements: HTMLElement[];
  PIDStateMap: Map<string, PIDState>;
}

export default createStore<State>({
  state: {
    // Common
    PIDStateMap: new Map(),

    draggableElements: [],
    tooltipText: 'ayo',
    tooltipX: 0,
    tooltipY: 0,
    currentComponent: 'ThemeSelector',

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
    themes: {
      themesArray: themeList as unknown as Record<string, Theme>,
      themeNamesArray: Object.keys(themeList),
      themeList: themeList as unknown as Record<string, string>,
    },
    themeData: {} as Theme,
    selectedTheme: {} as Theme,

    // Tooltip.vue
    isCodeEditorPreview: false,
    showTooltip: false,
    tooltipTheme: {},

    // UserAgents.vue
    userAgents: userAgents,
    userAgent: '',
  },
  getters: {
    getPIDState: (state) => (ariaLabel: string) =>
      state.PIDStateMap.get(ariaLabel),
    // common
    getDraggableElements: async (state) => state.draggableElements,
    getTooltipText: async (state) => state.tooltipText,
    getTooltipX: async (state) => state.tooltipX,
    getTooltipY: async (state) => state.tooltipY,
    getCurrentComponent: async (state) => state.currentComponent,
    // Component-specific getters
    getJsonObjects: async (state) => state.jsonObjects,
    getTimeZone: async (state) => state.timeZone,
    getLocale: async (state) => state.locale,
    getLatitude: async (state) => state.latitude,
    getLongitude: async (state) => state.longitude,
    getDefaultView: async (state) => state.defaultView,
    getFeedbackMessage: async (state) => state.feedbackMessage,
    getLanguage: async (state) => state.language,
    getMonacoTheme: async (state) => state.monacoTheme,
    getShowModal: async (state) => state.showModal,
    getCrazyMode: async (state) => state.crazyModeEnabled,
    getTabWidth: async (state) => state.tabWidth,
    getTabManagementEnabled: async (state) => state.tabManagementEnabled,
    getTabSetPoint: async (state) => state.tabSetPoint,
    getThemeData: async (state) => state.themeData,
    getTooltipTheme: async (state) => state.tooltipTheme,
    getUserAgent: async (state) => state.userAgent,
    getSelectedTheme: async (state) => state.selectedTheme,
    getMonacoContainer: async (state) => state.monacoContainer,
    getEditorInstance: async (state) => state.editorInstance,
  },
  mutations: {
    setPIDState(state, { ariaLabel, pidState }) {
      state.PIDStateMap.set(ariaLabel, pidState);
    },

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
      if (!this.state.themes.themesArray) {
        await dispatch('updateThemes');
        await dispatch('updateCurrentComponent', 'ThemeSelector');
      }
    },
    async updateThemes({ commit }) {
      const themes = await getThemes();
      commit('setThemes', themes);
    },
    initializePIDState({ commit }, item: NavItem) {
      const initialState: PIDState = {
        originalX: 0,
        originalY: 0,
        previousErrorX: 0,
        previousErrorY: 0,
        setPointX: 0,
        setPointY: 0,
        integralX: 0,
        integralY: 0,
        lastTime: 0,
      };
      commit('setPIDState', {
        ariaLabel: item.ariaLabel,
        pidState: initialState,
      });
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
      commit('setSelectedThemeKey', selectedThemeKey);
    },
    setDefaultTheme({ commit }) {
      commit('setSelectedThemeKey', 'GitHub');
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
