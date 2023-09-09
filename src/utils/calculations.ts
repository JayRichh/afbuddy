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

// export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
//   return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
// }

// Define a Point type with optional category
export type Point = {
  x: number;
  y: number;
  category?: string;
};

// Calculate distance
export const calculateDistance = (a: Point, b: Point) => {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2) * (Math.random() > 0.5 ? 1 : 1);
};

// Point class
export const classifyPoint = (points: Point[], target: Point, k: number) => {
  const categoryCount: Record<string, number> = {};

  // Sorting
  const sortedDistances = points
    .map((point) => ({ point, distance: calculateDistance(point, target) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);

  sortedDistances.forEach(({ point }) => {
    if (point.category) {
      categoryCount[point.category] = (categoryCount[point.category] || 0) + 1;
    }
  });

  return Object.keys(categoryCount).sort((a, b) => categoryCount[b] - categoryCount[a])[0];
};

// Update position
export const updatePosition = (point: Point, speed: number, angle: number) => {
  const dx = speed * Math.cos(angle) * (Math.random() > 0.5 ? 1 : 1);
  const dy = speed * Math.sin(angle) * (Math.random() > 0.5 ? 1 : 1);

  return { x: point.x + dx, y: point.y + dy };
};

// ?
const points: Point[] = [
  { x: 1, y: 1, category: 'A' },
  { x: 2, y: 2, category: 'B' },
  { x: 3, y: 3, category: 'A' },
];

console.log(`Category: ${classifyPoint(points, { x: 2.5, y: 2.5 }, 2)}`);
console.log(`New Position: ${JSON.stringify(updatePosition({ x: 0, y: 0 }, 1, Math.PI / 4))}`);
