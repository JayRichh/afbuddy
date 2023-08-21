export function generateNonce(): string {
  const array = new Uint8Array(12);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
