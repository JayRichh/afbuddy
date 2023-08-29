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
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: messages,
});

export default i18n;
