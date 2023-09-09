import { State } from './types';
import { Theme } from './data/themesList';
import { PIDState } from '../pidstate';
import * as monaco from 'monaco-editor';

export default {
  // PIDState
  setPIDState(
    state: State,
    { ariaLabel, pidState }: { ariaLabel: string; pidState: PIDState },
  ) {
    state.PIDStateMap?.set(ariaLabel, pidState);
  },
  updatePIDState(
    state: State,
    { ariaLabel, pidState }: { ariaLabel: string; pidState: PIDState },
  ) {
    const stateToUpdate = state.PIDStateMap?.get(ariaLabel);
    if (stateToUpdate) {
      Object.keys(pidState).forEach((key) => {
        (stateToUpdate as any)[key] = (pidState as any)[key];
      });
    }
  },

  // General
  updateState(state: State, payload: Partial<State>) {
    Object.keys(payload).forEach((key) => {
      (state as any)[key] = (payload as any)[key];
    });
  },

  // Navigation
  setNavItems(state: State, payload: any) {
    state.navItems = payload;
  },

  // Draggable Elements
  setDraggableElements(state: State, payload: HTMLElement[]) {
    console.log('payload', payload, ' setting draggable elements');
    state.draggableElements = payload;
  },

  // Tooltip
  setTooltipVisible(state: State, value: boolean) {
    state.showTooltip = value;
  },
  setTooltipText(state: State, payload: string) {
    state.tooltipText = payload;
  },
  setTooltipX(state: State, payload: number) {
    state.tooltipX = payload;
  },
  setTooltipY(state: State, payload: number) {
    state.tooltipY = payload;
  },

  // Component
  setCurrentComponent(state: State, payload: string) {
    state.currentComponent = payload;
  },

  // Theme
  setThemes(state: State, payload: any) {
    state.themes = payload;
  },
  setThemeData(state: State, payload: Theme) {
    state.themeData = payload;
  },
  setTooltipTheme(state: State, payload: object) {
    state.tooltipTheme = payload;
  },
  setSelectedThemeKey(state: State, payload: string) {
    state.selectedThemeKey = payload;
  },
  // Monaco Editor
  updateMonacoTheme(state: State, payload: string) {
    state.monacoTheme = payload;
  },
  setMonacoContainer(state: State, payload: HTMLElement) {
    if (payload) {
      state.monacoContainer = payload;
    }
  },
  setEditorInstance(state: State, payload: monaco.editor.IStandaloneCodeEditor) {
    if (payload) {
      state.editorInstance = payload;
    }
  },

  // JSON Objects
  setJsonObjects(state: State, payload: object) {
    state.jsonObjects = payload;
  },

  // Geolocation
  setTimeZone(state: State, payload: string) {
    state.timeZone = payload;
  },
  setLocale(state: State, payload: string) {
    state.locale = payload;
  },
  setLatitude(state: State, payload: number) {
    state.latitude = payload;
  },
  setLongitude(state: State, payload: number) {
    state.longitude = payload;
  },
  setDefaultView(state: State, payload: string) {
    state.defaultView = payload;
  },

  // Feedback Message
  setFeedbackMessage(state: State, payload: string) {
    state.feedbackMessage = payload;
  },

  // Language
  setLanguage(state: State, payload: string) {
    state.language = payload;
  },
  setRememberLanguage(state: State, payload: boolean) {
    state.rememberLanguage = payload;
  },

  // Modal
  setShowModal(state: State, payload: boolean) {
    state.showModal = payload;
  },

  // Crazy Mode
  setCrazyModeEnabled(state: State, payload: boolean) {
    state.crazyModeEnabled = payload;
  },

  // Tab
  setTabWidth(state: State, payload: number) {
    state.tabWidth = payload;
  },
  setTabManagementEnabled(state: State, payload: boolean) {
    state.tabManagementEnabled = payload;
  },
  setTabSetPoint(state: State, payload: number) {
    state.tabSetPoint = payload;
  },

  // User Agent
  setUserAgent(state: State, payload: string) {
    state.userAgent = payload;
  },
};
