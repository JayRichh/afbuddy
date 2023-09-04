export function listenForKonamiCode(callback: () => void) {
  let input = '';
  const secret = '38384040373937396665';
  window.addEventListener('keyup', (e: KeyboardEvent) => {
    input += '' + e.keyCode;
    if (input === secret) {
      callback();
      input = '';
    }
  });
}
