import { State } from './types';

export default {
  // PID
  getPIDState: (state: State) => (ariaLabel: string) => state.PIDStateMap?.get(ariaLabel),

  // Draggable Elements
  getDraggableElements: (state: State) => state.draggableElements,

  // Tooltip
  getTooltipText: (state: State) => state.tooltipText,
  getTooltipX: (state: State) => state.tooltipX,
  getTooltipY: (state: State) => state.tooltipY,
  getTooltipTheme: (state: State) => state.tooltipTheme,
  getIsCodeEditorPreview: (state: State) => state.isCodeEditorPreview,

  // Component
  getCurrentComponent: (state: State) => state.currentComponent,

  // JSON Objects
  getJsonObjects: (state: State) => state.jsonObjects,

  // Geolocation
  getTimeZone: (state: State) => state.timeZone,
  getLocale: (state: State) => state.locale,
  getLatitude: (state: State) => state.latitude,
  getLongitude: (state: State) => state.longitude,
  getDefaultView: (state: State) => state.defaultView,

  // Feedback Message
  getFeedbackMessage: (state: State) => state.feedbackMessage,

  // Language
  getLanguage: (state: State) => state.language,
  getRememberLanguage: (state: State) => state.rememberLanguage,

  // Monaco
  getMonacoTheme: (state: State) => state.monacoTheme,
  getMonacoContainer: (state: State) => state.monacoContainer,
  getEditorInstance: (state: State) => state.editorInstance,

  // Modal
  getShowModal: (state: State) => state.showModal,

  // Crazy Mode
  getCrazyMode: (state: State) => state.crazyModeEnabled,

  // Tab
  getTabWidth: (state: State) => state.tabWidth,
  getTabManagementEnabled: (state: State) => state.tabManagementEnabled,
  getTabSetPoint: (state: State) => state.tabSetPoint,

  // Theme
  getTheme: (state: State) => state.themeData,
  getSelectedTheme: (state: State) => state.selectedTheme,

  // User Agent
  getUserAgent: (state: State) => state.userAgent,
};
