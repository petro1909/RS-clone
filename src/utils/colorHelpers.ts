export const hex2rgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

export const rgb2hsl = (rgb: { r: number, g: number, b: number }) => {
  const r = +rgb.r / 255;
  const g = +rgb.g / 255;
  const b = +rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = h;
  const l = h;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  s = l >= 0.5 ? d / (2 - (max + min)) : d / (max + min);
  switch (max) {
    case r:
      h = ((g - b) / d + 0) * 60;
      break;
    case g:
      h = ((b - r) / d + 2) * 60;
      break;
    case b:
      h = ((r - g) / d + 4) * 60;
      break;
    default: break;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const isLight = (hex: string) => {
  const rgb = hex2rgb(hex);
  const { h, l } = rgb2hsl(rgb);
  return ((h < 55 && l >= 50) || (h >= 55 && l >= 75));
};
