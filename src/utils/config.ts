import { ref } from 'vue';

export function calculateRotation() {
  const now = new Date();
  const hours = now.getUTCHours();

  const sunRotation = (hours <= 12 ? hours : 24 - hours) * 30;
  const moonRotation =
    ((hours + 12) % 24 <= 12 ? (hours + 12) % 24 : 36 - ((hours + 12) % 24)) *
    30;

  return { sunRotation, moonRotation };
}

// export const calculateDistance = (
//   x1: number,
//   y1: number,
//   x2: number,
//   y2: number,
// ) => {
//   const dx = x1 - x2;
//   const dy = y1 - y2;
//   return Math.sqrt(dx * dx + dy * dy);
// };

export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

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
    componentName: 'DoomPlayer',
    iconSrc: require('../../assets/icons/doom.png'),
    iconMaskSrc: require('../../assets/icons/doomWhite.png'),
    altText: 'doom-icon',
    ariaLabel: 'DoomPlayer',
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
    position: { x: 0, y: 0 },
  },
  {
    id: '3',
    componentName: 'Tab Management',
    iconSrc: require('../../assets/icons/tabclose.png'),
    iconMaskSrc: require('../../assets/icons/tabcloseWhite.png'),
    altText: 'tabclose-icon',
    ariaLabel: 'Tab Management',
    selected: false,
    position: { x: 0, y: 0 },
  },
  {
    id: '4',
    componentName: 'CodeControls',
    iconSrc: require('../../assets/icons/history.png'),
    iconMaskSrc: require('../../assets/icons/historyWhite.png'),
    altText: 'code-icon',
    ariaLabel: 'CodeControls',
    selected: false,
    position: { x: 0, y: 0 },
  },
  {
    id: '5',
    componentName: 'Geolocations',
    iconSrc: require('../../assets/icons/geolocation.png'),
    iconMaskSrc: require('../../assets/icons/geolocationWhite.png'),
    altText: 'geolocation-icon',
    ariaLabel: 'Geolocations',
    selected: false,
    position: { x: 0, y: 0 },
  },
  {
    id: '6',
    componentName: 'UserAgents',
    iconSrc: require('../../assets/icons/userAgent.png'),
    iconMaskSrc: require('../../assets/icons/userAgentWhite.png'),
    altText: 'user-agent-icon',
    ariaLabel: 'UserAgents',
    selected: false,
    position: { x: 0, y: 0 },
  },
  {
    id: '7',
    componentName: 'Info',
    iconSrc: require('../../assets/icons/information.png'),
    iconMaskSrc: require('../../assets/icons/informationWhite.png'),
    altText: 'info-icon',
    ariaLabel: 'Info',
    selected: false,
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
  Kp: 0.5,
  Ki: 0.1,
  Kd: 0.01,
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
