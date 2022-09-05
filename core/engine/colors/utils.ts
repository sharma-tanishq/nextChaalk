/**
 * @param hex A string in usual hex format eg: '#1e1e1e'
 * @param alpha The Transparency value, 0.0 to 1.0
 * @returns 4 part color info array [r, g, b, a],
 * normalised between 0 to 1
 */
export const hexToNormalizedRgb = (hex: string, alpha = 1.0) => {
  /** Change '#abc' form to '#abcabc' form */
  if (hex.length === 4) hex = `${hex}${hex[1]}${hex[2]}${hex[3]}`;

  const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex);

  if (alpha < 0 || alpha > 1) {
    console.error("Incorrect Alpha Value, Correcting to 1.0");
    alpha = 1.0;
  }

  return result
    ? ([
        (alpha * parseInt(result[1], 16)) / 255,
        (alpha * parseInt(result[2], 16)) / 255,
        (alpha * parseInt(result[3], 16)) / 255,
        alpha,
      ] as [number, number, number, number])
    : null;
};

export const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const rgbaToHex = (arg: number[]) => {
  const r = (arg.length > 0 ? arg[0] : "00").toString(16);
  const g = (arg.length > 1 ? arg[1] : "00").toString(16);
  const b = (arg.length > 2 ? arg[2] : "00").toString(16);
  return `#${r}${g}${b}`;
};
