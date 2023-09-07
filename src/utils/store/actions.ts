/* eslint-disable @typescript-eslint/no-unused-vars */
import { PIDState } from '../pidstate';
import { MyActionContext } from './types';
import { getTheme, getThemes } from './data/themesList';
import { NavItem, NavItems } from '../config';
import { State } from './types';

export default {
  async initializeDraggableElements({ commit }: MyActionContext) {
    const elements = Array.from(document.querySelectorAll('.draggable')) as HTMLElement[];
    commit('setDraggableElements', elements);
  },
  async initializeStore({ dispatch }: MyActionContext) {
    await dispatch('updateCurrentComponent', 'ThemeSelector');
  },
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
  applyTheme({ commit, dispatch }: MyActionContext, payload: any) {
    commit('updateState', {
      themeData: payload.themeData,
      tooltipTheme: payload.tooltipTheme,
    });
    dispatch('createEditor', { theme: payload.themeData });
  },
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
  updateState({ commit }: MyActionContext, payload: Partial<State>) {
    commit('updateState', payload);
  },
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
  applySelectedTheme({ commit }: MyActionContext, selectedThemeKey: string) {
    commit('setSelectedThemeKey', selectedThemeKey);
  },
  setDefaultTheme({ commit }: MyActionContext) {
    commit('setSelectedThemeKey', 'GitHub');
  },
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
  updateCurrentComponent({ commit }: MyActionContext, payload: string) {
    commit('setCurrentComponent', payload);
  },
  updateFeedbackMessage({ commit }: MyActionContext, payload: string) {
    commit('setFeedbackMessage', payload);
  },
  saveLanguage(
    { commit }: MyActionContext,
    payload: { selectedLanguage: string; rememberLanguage: boolean },
  ) {
    commit('setLanguage', payload.selectedLanguage);
    commit('setRememberLanguage', payload.rememberLanguage);
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
  updateNavItems({ commit }: MyActionContext, payload: typeof NavItems) {
    commit('setNavItems', payload);
  },
  updateMonacoTheme({ commit }: MyActionContext, payload: string) {
    commit('setMonacoTheme', payload);
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
  updateMonacoContainer({ commit }: MyActionContext, payload: HTMLElement | null) {
    commit('setMonacoContainer', payload);
  },
};
