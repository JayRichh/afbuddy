import { Theme } from './data/themesList';
import { NavItems } from '../config';
import { PIDState } from '../pidstate';
import { userAgents } from './data/userAgents';
import * as monaco from 'monaco-editor';
import { ActionContext } from 'vuex';

export interface State {
  PIDStateMap: Map<string, PIDState>;
  draggableElements: HTMLElement[];
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
  monacoContainer: HTMLElement | null;
  editorInstance: monaco.editor.IStandaloneCodeEditor | null;
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
}

export type MyActionContext = ActionContext<State, State>;
