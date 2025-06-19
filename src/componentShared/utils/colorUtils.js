/**
 * Converts a hex color string to RGB format ("r, g, b")
 *
 * @param {string} hex - Hex color (with or without # prefix)
 * @returns {string} RGB values as "r, g, b" string
 */
export const hexToRgb = (hex) => {
  // Default color if none provided
  if (!hex) return '82, 121, 111'; // #52796f in RGB

  // Remove the # if present
  const cleanHex = hex.startsWith('#') ? hex.substring(1) : hex;

  // Handle shorthand hex (e.g., #abc)
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r}, ${g}, ${b}`;
  }

  // Handle regular hex
  try {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  } catch (e) {
    return '82, 121, 111'; // Default on error
  }
};

/**
 * Get contrasting text color (black or white) based on background color
 *
 * @param {string} hexColor - Hex color
 * @returns {string} '#ffffff' or '#000000' depending on which provides better contrast
 */
export const getContrastColor = (hexColor) => {
  // Default to black if no color provided
  if (!hexColor) return '#000000';

  const hex = hexColor.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance - standard formula for perceived brightness
  // See: https://www.w3.org/TR/WCAG20-TECHS/G18.html
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
};
