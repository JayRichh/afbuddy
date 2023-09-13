import { Theme } from './data/themesList';
import { NavItems } from '../config';
import { PIDState } from '../pidstate';
import { userAgents } from './data/userAgents';
import * as monaco from 'monaco-editor';
import { ActionContext, Store } from 'vuex';

export interface State {
  monacoEditor: monaco.editor.IStandaloneCodeEditor | null;
  selectedThemeKey: string;
  themesArray: Record<string, Theme>;
  themeNamesArray: string[];
  themeList: Record<string, string>;
  PIDStateMap?: Map<string, PIDState>;
  draggableElements?: HTMLElement[];
  tooltipText?: string;
  tooltipX?: number;
  tooltipY?: number;
  currentComponent?: string;
  jsonObjects?: object;
  timeZone?: string;
  locale?: string;
  latitude?: number;
  longitude?: number;
  defaultView?: string;
  feedbackMessage?: string;
  language?: string;
  rememberLanguage?: boolean;
  monacoTheme?: string;
  showModal?: boolean;
  jsonViewerTheme?: string;
  autoFormat?: boolean;
  monacoContainer?: HTMLElement | null;
  editorInstance?: monaco.editor.IStandaloneCodeEditor | null;
  navItems?: typeof NavItems;
  crazyModeEnabled?: boolean;
  tabWidth?: number;
  tabManagementEnabled?: boolean;
  tabSetPoint?: number;
  themeData?: Theme;
  themes?: {
    themesArray?: Record<string, Theme>;
    themeNamesArray?: string[];
    themeList?: Record<string, string>;
  };
  selectedTheme?: Theme;
  isCodeEditorPreview?: boolean;
  showTooltip?: boolean;
  tooltipTheme?: object;
  userAgents?: typeof userAgents;
  userAgent?: string;
  fonts?: {
    'DejaVu Sans Mono'?: { params: Record<string, unknown> };
    'JetBrains Mono'?: { params: Record<string, unknown> };
    'Source Code Pro'?: { params: Record<string, unknown> };
    'Roboto'?: { params: Record<string, unknown> };
    'Roboto Slab'?: { params: Record<string, unknown> };
  };
  font?: string;
  fontSizes?: number[];
  fontSize?: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface TooltipPayload {
  text: string;
  x: number;
  y: number;
  visible: boolean;
  isCodeEditorPreview?: boolean;
}

export interface HoverEffectsOptions {
  store: Store<State>;
  document: HTMLBodyElement;
}

export type MyActionContext = ActionContext<State, State>;
