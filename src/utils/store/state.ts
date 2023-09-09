import { Theme, themeList } from './data/themesList';
import { NavItems } from '../config';
import { PIDStateMap } from '../pidstate';
import { userAgents } from './data/userAgents';
import * as monaco from 'monaco-editor';

const state = {
  PIDStateMap: PIDStateMap,
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
  fonts: {
    'DejaVu Sans Mono': { params: {} },
    'JetBrains Mono': { params: {} },
    'Source Code Pro': { params: {} },
    Roboto: { params: {} },
    'Roboto Slab': { params: {} },
  },
  font: '',
  fontSizes: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
  fontSize: 0,
};

export default state;
