/* eslint-disable @typescript-eslint/no-unused-vars */
import { PIDState } from '../pidstate';
import { MyActionContext } from './types';
import { getTheme, getThemes } from './data/themesList';
import { NavItem, NavItems } from '../config';
import { State } from './types';

export default {
  updateState({ commit }: MyActionContext, payload: Partial<State>) {
    commit('updateState', payload);
  },

  // PID Actions
  updatePIDState(
    { commit }: MyActionContext,
    payload: { ariaLabel: string; pidState: PIDState },
  ) {
    commit('setPIDState', payload);
  },
  resetPIDState({ commit }: MyActionContext, ariaLabel: string) {
    commit('setPIDState', {
      ariaLabel,
      pidState: {
        originalX: 0,
        originalY: 0,
        previousErrorX: 0,
        previousErrorY: 0,
        setPointX: 0,
        setPointY: 0,
        integralX: 0,
        integralY: 0,
        lastTime: 0,
      },
    });
  },

  // Initialization Actions
  async initializeDraggableElements({ commit }: MyActionContext) {
    const elements = Array.from(document.querySelectorAll('.draggable')) as HTMLElement[];
    commit('setDraggableElements', elements);
  },
  async initializeStore({ dispatch }: MyActionContext) {
    await dispatch('updateCurrentComponent', 'ThemeSelector');
  },
  initializePIDState({ commit }: MyActionContext, item: NavItem) {
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

  // THEME ACTIONS
  async updateThemes({ commit }: MyActionContext) {
    const themes = await getThemes();
    commit('setThemes', themes);
  },
  async getTheme({ commit }: MyActionContext, themeName: string) {
    const themeData = await getTheme(themeName);
    if (!themeData) {
      throw new Error(`Theme ${themeName} not found`);
    }
    return themeData;
  },
  applySelectedTheme({ commit }: MyActionContext, selectedThemeKey: string) {
    commit('setSelectedThemeKey', selectedThemeKey);
  },

  applyTheme({ commit, dispatch }: MyActionContext, payload: any) {
    commit('updateState', {
      themeData: payload.themeData,
      tooltipTheme: payload.tooltipTheme,
    });
    dispatch('createEditor', { theme: payload.themeData });
  },

  // MONACO ACTIONS
  createEditor(
    { commit }: MyActionContext,
    payload: {
      monacoContainer: HTMLElement | null;
      editorInstance: monaco.editor.IStandaloneCodeEditor | null;
    },
  ) {
    if (payload.monacoContainer && payload.editorInstance) {
      commit('setMonacoContainer', payload.monacoContainer);
      commit('setEditorInstance', payload.editorInstance);
    }
  },
  setMonacoContainer({ commit }: MyActionContext, payload: HTMLElement | null) {
    commit('setMonacoContainer', payload);
  },
  setEditorInstance(
    { commit }: MyActionContext,
    payload: monaco.editor.IStandaloneCodeEditor | null,
  ) {
    commit('setEditorInstance', payload);
  },
  updateMonacoTheme({ commit }: MyActionContext, payload: string) {
    commit('setMonacoTheme', payload);
  },
  updateMonacoContainer({ commit }: MyActionContext, payload: HTMLElement | null) {
    commit('setMonacoContainer', payload);
  },

  // JSON Actions
  saveJsonToLocalStorage({ commit, state }: MyActionContext) {
    localStorage.setItem('jsonObjects', JSON.stringify(state.jsonObjects));
    commit('updateState', { jsonObjects: state.jsonObjects });
  },
  loadJsonFromLocalStorage({ commit }: MyActionContext) {
    const loadedData = JSON.parse(localStorage.getItem('jsonObjects') || '{}');
    commit('updateState', { jsonObjects: loadedData });
  },
  formatJSON({ commit }: MyActionContext, json: string) {
    try {
      const parsedJson = JSON.parse(json);
      commit('updateState', {
        jsonObjects: JSON.stringify(parsedJson, null, 2),
      });
    } catch (e) {
      console.log('🍕');
    }
  },

  // GeoLocation Actions
  setGeolocation({ commit }: MyActionContext, payload: any) {
    commit('updateState', {
      timeZone: payload.timeZone,
      locale: payload.locale,
      latitude: payload.latitude,
      longitude: payload.longitude,
      defaultView: payload.defaultView,
    });
  },
  resetGeolocation({ commit }: MyActionContext) {
    commit('updateState', {
      timeZone: '',
      locale: '',
      latitude: 0,
      longitude: 0,
    });
  },

  //Language Actions
  saveLanguage(
    { commit }: MyActionContext,
    payload: { selectedLanguage: string; rememberLanguage: boolean },
  ) {
    commit('setLanguage', payload.selectedLanguage);
    commit('setRememberLanguage', payload.rememberLanguage);
  },

  // State Update Actions
  updateTooltip(
    { commit }: MyActionContext,
    payload: { text: string; x: number; y: number; visible?: boolean },
  ) {
    commit('setTooltipText', payload.text);
    commit('setTooltipX', payload.x);
    commit('setTooltipY', payload.y);
    if (payload.visible !== undefined) {
      commit('setTooltipVisible', payload.visible);
    }
  },
  updateCurrentComponent({ commit }: MyActionContext, componentName) {
    commit('setCurrentComponent', componentName);
  },
  updateFeedbackMessage({ commit }: MyActionContext, payload: string) {
    commit('setFeedbackMessage', payload);
  },
  updateNavItems({ commit }: MyActionContext, payload: typeof NavItems) {
    commit('setNavItems', payload);
  },
  updateIsCodeEditorPreview({ commit }: MyActionContext, payload: boolean) {
    commit('setIsCodeEditorPreview', payload);
  },
  updateShowTooltip({ commit }: MyActionContext, payload: boolean) {
    commit('setShowTooltip', payload);
  },
  updateJsonViewerTheme({ commit }: MyActionContext, payload: string) {
    commit('setJsonViewerTheme', payload);
  },
  updateAutoFormat({ commit }: MyActionContext, payload: boolean) {
    commit('setAutoFormat', payload);
  },
};
function dispatch(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}
