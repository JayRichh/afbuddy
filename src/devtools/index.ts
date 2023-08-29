chrome.devtools.panels.create(
  'DevTools',
  'assets/icons/logo-bg-48.png',
  'devtools/app/index.html',
  () => {
    console.log('DevTools loaded');
  },
);
