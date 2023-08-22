export function calculateRotation() {
  const now = new Date();
  const hours = now.getUTCHours();

  const sunRotation = (hours <= 12 ? hours : 24 - hours) * 30;
  const moonRotation =
    ((hours + 12) % 24 <= 12 ? (hours + 12) % 24 : 36 - ((hours + 12) % 24)) *
    30;

  return { sunRotation, moonRotation };
}
