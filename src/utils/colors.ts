const colorsText = [
  "text-sky-600",
  "text-red-400",
  "text-pink-400",
  "text-teal-400",
  "text-orange-800",
  "text-yellow-400",
  "text-emerald-400",
  "text-violet-800",
  "text-rose-900",
];

const colorsBg = [
  "bg-sky-600",
  "bg-red-400",
  "bg-pink-400",
  "bg-teal-400",
  "bg-orange-800",
  "bg-yellow-400",
  "bg-emerald-400",
  "bg-violet-800",
  "bg-rose-900",
];

const colorsRing = [
  "ring-sky-600",
  "ring-red-400",
  "ring-pink-400",
  "ring-teal-400",
  "ring-orange-800",
  "ring-yellow-400",
  "ring-emerald-400",
  "ring-violet-800",
  "ring-rose-900",
];

export function getRadomColor(type: "text" | "bg" | "ring") {
  let colors: string[] = [];

  switch (type) {
    case "text":
      colors = colorsText;
      break;
    case "bg":
      colors = colorsBg;
      break;
    case "ring":
      colors = colorsRing;
      break;
  }

  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}
