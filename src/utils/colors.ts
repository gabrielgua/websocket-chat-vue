const colors = [
  "sky-600",
  "red-400",
  "pink-400",
  "teal-400",
  "orange-800",
  "yellow-400",
  "emerald-400",
  "violet-800",
  "rose-900",
];

export function getRadomColor() {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}
