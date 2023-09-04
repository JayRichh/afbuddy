import { Theme, themeList } from './data/themesList';
import { NavItems } from '../config';
import { PIDState } from '../pidstate';
import { userAgents } from './data/userAgents';
import * as monaco from 'monaco-editor';

const state = {
  PIDStateMap: new Map<string, PIDState>(),
  draggableElements: [] as HTMLElement[],
  tooltipText: '',
  tooltipX: 0,
  tooltipY: 0,
  currentComponent: '',
  jsonObjects: {} as object,
  timeZone: '',
  locale: '',
  latitude: 0,
  longitude: 0,
  defaultView: '',
  feedbackMessage: '',
  language: '',
  rememberLanguage: false,
  monacoTheme: '',
  showModal: false,
  jsonViewerTheme: '',
  autoFormat: false,
  monacoContainer: null as HTMLElement | null,
  editorInstance: null as monaco.editor.IStandaloneCodeEditor | null,
  navItems: NavItems,
  crazyModeEnabled: false,
  tabWidth: 0,
  tabManagementEnabled: false,
  tabSetPoint: 0,
  themeData: {} as Theme,
  themes: {
    themesArray: themeList as unknown as Record<string, Theme>,
    themeNamesArray: Object.keys(themeList),
    themeList: themeList as unknown as Record<string, string>,
  },
  selectedTheme: {} as Theme,
  isCodeEditorPreview: false,
  showTooltip: false,
  tooltipTheme: {} as object,
  userAgents: userAgents,
  userAgent: '',
};

export default state;
