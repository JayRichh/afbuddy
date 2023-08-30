import { createI18n } from 'vue-i18n';

export const messages = {
  en: {
    Navbar: 'Navbar',
    'Theme Selector': 'Theme Selector',
    'Tab Manager': 'Tab Manager',
    'Code Controls': 'Code Controls',
    Geolocation: 'Geolocation',
    'User Agents': 'User Agents',
    Info: 'Info',
    Tooltip: 'Tooltip',
    'Doom Player': 'Doom Player',
    'Select Language': 'Select Language',
    English: 'English',
    Norwegian: 'Norwegian',
    About: 'About',
    Contact: 'Contact',
    Projects: 'Projects',
    'Select Theme': 'Select Theme',
    Apply: 'Apply',
    Default: 'Default',
  },
  no: {
    Navbar: 'Navigasjonslinje',
    'Theme Selector': 'Tema Velger',
    'Tab Manager': 'Tab Manager',
    'Code Controls': 'Kode Kontroller',
    Geolocation: 'Geolokalisering',
    'User Agents': 'Brukeragenter',
    Info: 'Info',
    Tooltip: 'Verktøytips',
    'Doom Player': 'Doom Spiller',
    'Select Language': 'Velg Språk',
    English: 'Engelsk',
    Norwegian: 'Norsk',
    About: 'Om',
    Contact: 'Kontakt',
    Projects: 'Prosjekter',
    'Select Theme': 'Velg Tema',
    Apply: 'Bruk',
    Default: 'Standard',
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: messages,
});

export default i18n;
