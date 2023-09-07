export function calculateRotation() {
  const now = new Date();
  const hours = now.getUTCHours();

  const sunRotation = (hours <= 12 ? hours : 24 - hours) * 30;
  const moonRotation =
    ((hours + 12) % 24 <= 12 ? (hours + 12) % 24 : 36 - ((hours + 12) % 24)) * 30;

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

export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
