import { State } from './types';
import { Theme } from './data/themesList';
import { PIDState } from '../pidstate';
import * as monaco from 'monaco-editor';

export default {
  setPIDState(
    state: State,
    { ariaLabel, pidState }: { ariaLabel: string; pidState: PIDState },
  ) {
    state.PIDStateMap.set(ariaLabel, pidState);
  },
  updateState(state: State, payload: Partial<State>) {
    Object.keys(payload).forEach((key) => {
      (state as any)[key] = (payload as any)[key];
    });
  },
  setNavItems(state: State, payload: any) {
    state.navItems = payload;
  },
  setDraggableElements(state: State, payload: HTMLElement[]) {
    console.log('payload', payload, ' setting draggable elements');
    state.draggableElements = payload;
  },
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
  setCurrentComponent(state: State, payload: string) {
    state.currentComponent = payload;
  },
  setThemes(state: State, payload: any) {
    state.themes = payload;
  },
  setMonacoContainer(state: State, payload: HTMLElement | null) {
    if (payload) {
      state.monacoContainer = payload;
    }
  },
  setEditorInstance(
    state: State,
    payload: monaco.editor.IStandaloneCodeEditor | null,
  ) {
    if (payload) {
      state.editorInstance = payload;
    }
  },
  setJsonObjects(state: State, payload: object) {
    state.jsonObjects = payload;
  },
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
  setFeedbackMessage(state: State, payload: string) {
    state.feedbackMessage = payload;
  },
  setLanguage(state: State, payload: string) {
    state.language = payload;
  },
  setRememberLanguage(state: State, payload: boolean) {
    state.rememberLanguage = payload;
  },
  setMonacoTheme(state: State, payload: string) {
    state.monacoTheme = payload;
  },
  setShowModal(state: State, payload: boolean) {
    state.showModal = payload;
  },
  setCrazyModeEnabled(state: State, payload: boolean) {
    state.crazyModeEnabled = payload;
  },
  setTabWidth(state: State, payload: number) {
    state.tabWidth = payload;
  },
  setTabManagementEnabled(state: State, payload: boolean) {
    state.tabManagementEnabled = payload;
  },
  setTabSetPoint(state: State, payload: number) {
    state.tabSetPoint = payload;
  },
  setThemeData(state: State, payload: Theme) {
    state.themeData = payload;
  },
  setTooltipTheme(state: State, payload: object) {
    state.tooltipTheme = payload;
  },
  setUserAgent(state: State, payload: string) {
    state.userAgent = payload;
  },
};
