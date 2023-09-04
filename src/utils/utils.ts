export function generateNonce(): string {
  const array = new Uint8Array(12);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...funcArgs: Parameters<T>) => ReturnType<T> | undefined {
  let lastCall = 0;
  return function (...args: Parameters<T>): ReturnType<T> | undefined {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

export const getIp = () =>
  fetch(
    'http://ip-api.com/json?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,proxy,query',
  )
    .then((response) => response.json())
    .then((ipData) => {
      chrome.storage.local.set({ ipData });
      return ipData;
    });
