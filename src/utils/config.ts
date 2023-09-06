import { ref } from 'vue';

export interface NavItem {
  id: number | string;
  position: { x: number; y: number };
  componentName: string;
  iconSrc: string;
  iconMaskSrc: string;
  altText: string;
  ariaLabel: string;
  selected?: boolean;
  crazyMode?: boolean;
}

export const NavItems = [
  {
    id: '1',
    componentName: 'Doom',
    iconSrc: require('../../assets/icons/doom.png'),
    iconMaskSrc: require('../../assets/icons/doomWhite.png'),
    altText: 'doom-icon',
    ariaLabel: 'Doom',
    selected: false,
    crazyMode: true,
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    componentName: 'ThemeSelector',
    iconSrc: require('../../assets/icons/theme.png'),
    iconMaskSrc: require('../../assets/icons/themeWhite.png'),
    altText: 'theme-icon',
    ariaLabel: 'ThemeSelector',
    selected: true,
    crazyMode: false,
    position: { x: 0, y: 0 },
  },
  {
    id: '3',
    componentName: 'TabManager',
    iconSrc: require('../../assets/icons/tabclose.png'),
    iconMaskSrc: require('../../assets/icons/tabcloseWhite.png'),
    altText: 'tabclose-icon',
    ariaLabel: 'TabManager',
    selected: false,
    crazyMode: false,
    position: { x: 0, y: 0 },
  },
  {
    id: '4',
    componentName: 'Json',
    iconSrc: require('../../assets/icons/json.png'),
    iconMaskSrc: require('../../assets/icons/jsonWhite.png'),
    altText: 'json-icon',
    ariaLabel: 'Json',
    selected: true,
    crazyMode: false,
    position: { x: 0, y: 0 },
  },
  {
    id: '5',
    componentName: 'CodeControls',
    iconSrc: require('../../assets/icons/history.png'),
    iconMaskSrc: require('../../assets/icons/historyWhite.png'),
    altText: 'code-icon',
    ariaLabel: 'CodeControls',
    selected: false,
    crazyMode: false,
    position: { x: 0, y: 0 },
  },
  {
    id: '6',
    componentName: 'Geolocations',
    iconSrc: require('../../assets/icons/geolocation.png'),
    iconMaskSrc: require('../../assets/icons/geolocationWhite.png'),
    altText: 'geolocation-icon',
    ariaLabel: 'Geolocations',
    selected: false,
    crazyMode: false,
    position: { x: 0, y: 0 },
  },
  {
    id: '7',
    componentName: 'UserAgents',
    iconSrc: require('../../assets/icons/userAgent.png'),
    iconMaskSrc: require('../../assets/icons/userAgentWhite.png'),
    altText: 'user-agent-icon',
    ariaLabel: 'UserAgents',
    selected: false,
    crazyMode: false,
    position: { x: 0, y: 0 },
  },
  {
    id: '8',
    componentName: 'Info',
    iconSrc: require('../../assets/icons/information.png'),
    iconMaskSrc: require('../../assets/icons/informationWhite.png'),
    altText: 'info-icon',
    ariaLabel: 'Info',
    selected: false,
    crazyMode: false,
    position: { x: 0, y: 0 },
  },
];

interface NavbarOptions {
  particleIntensity: number;
  opacity: number;
  length: number;
  scale: number;
  rotation: number;
  hueRotate: number;
  pulseScale: number;
  transitionDuration: string;
  pulseDuration: string;
  Kp: number;
  Ki: number;
  Kd: number;
  maxDetachDistance: number;
  maxMovement: number;
  size: {
    width: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
  };
  rate: {
    quantity: number;
  };
  particles: {
    opacity: number;
    shape: string;
    size: number;
  };
}

//* High Range:
//? Kp: 1.0, Ki: 0.5, Kd: 0.1
//? Kp: 1.2, Ki: 0.6, Kd: 0.12
//? Kp: 1.5, Ki: 0.7, Kd: 0.15

//* Low Range:
//? Kp: 0.1, Ki: 0.05, Kd: 0.005
//? Kp: 0.2, Ki: 0.1, Kd: 0.01
//? Kp: 0.3, Ki: 0.15, Kd: 0.015

export const config: NavbarOptions = {
  particleIntensity: 0.5,
  opacity: 0.7,
  length: 10,
  scale: 1.1,
  rotation: 3,
  hueRotate: 10,
  pulseScale: 1.05,
  transitionDuration: '0.3s',
  pulseDuration: '1s',
  Kp: 0.01,
  Ki: 0.001,
  Kd: 0.0005,
  maxDetachDistance: 20,
  maxMovement: 10,
  size: {
    width: 100,
    height: 10,
  },
  position: {
    x: 50,
    y: 100,
  },
  rate: {
    quantity: 0.5,
  },
  particles: {
    opacity: 0.5 + Math.random() * 0.5,
    shape: 'circle',
    size: 1 + Math.random() * 2,
  },
};

config.particleIntensity = Math.round(config.particleIntensity);
config.opacity = Math.round(config.opacity);
config.length = Math.round(config.length);

export const particleOptions = ref<NavbarOptions>(config);
