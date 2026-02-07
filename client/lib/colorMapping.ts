// Color name to hex code mapping for visual swatches
export const colorToHex: Record<string, string> = {
  // I. The Whites
  "Paper White": "#F2F2F2",
  "Off-White": "#FAF9F6",
  "Coconut White": "#F9F1E2",
  "Cream": "#FFFDD0",
  
  // II. Pale Tints
  "Dark Cream": "#F3E5AB",
  "Ice Green": "#87D8C3",
  "Pista Green": "#B9D9B2",
  "Spring Wood": "#F1EBD9",
  "Westar": "#E0DED7",
  
  // III. Light Neutrals
  "Silver Sand": "#BFC1C2",
  "Silver Grey": "#C0C0C0",
  "Ash Grey": "#B2BEB5",
  "Light Sand": "#D8D1C5",
  "Biscotti": "#E3DAC9",
  
  // IV. The Biscuits
  "Beige": "#FFFACD",
  "Warm Biscuit": "#E1C699",
  "Fawn": "#E5AA70",
  "Desert Biscuit": "#D2B48C",
  "Cement": "#8B8C8B",
  
  // V. Soft Pastels
  "Lilac": "#C8A2C8",
  "Light Onion": "#E0B0FF",
  "Mint Green": "#98FF98",
  "Zinc": "#92898A",
  
  // VI. Mid-Neutrals
  "Dune": "#A39689",
  "Birch": "#918476",
  "Light Brown": "#AD8A66",
  "Grey": "#808080",
  "Mirage": "#5C5D66",
  "Iron Gray": "#52595D",
  
  // VII. Sunset Earth
  "Desert Gold": "#C2A463",
  "Coral Reef": "#F27E63",
  "Coral Tree": "#A86B6B",
  "Dark Yellow": "#9B870C",
  
  // VIII. Muted Earth
  "Light Mehandi": "#8B864E",
  "Pesto": "#798230",
  "Metallic Bronze": "#49371B",
  "Ironstone": "#86483C",
  
  // IX. Rich Browns
  "Dune Brown": "#7B6652",
  "Lisbon Brown": "#5D4B41",
  "Peanut Brown": "#795C34",
  "Spicy Mix": "#8B5F4D",
  "Cedar": "#4B3A26",
  
  // X. Deep Naturals
  "Dark Olive": "#556B2F",
  "Paco Brown": "#463D3E",
  "Cocoa Bean": "#48211A",
  "Cedar Brown": "#3B1E1E",
  
  // XI. Royal Tones
  "Royal Grey": "#5D5E60",
  "Royal Blue": "#4169E1",
  "Ship Cove": "#788BBA",
  "Dark Rust": "#8B0200",
  "Dark Plum": "#674172",
  
  // XII. Forest Deeps
  "Rangitoto": "#2E3222",
  "Timber Green": "#163330",
  "Forest Green": "#228B22",
  "Emerald Green": "#046307",
  
  // XIII. The Regals
  "Maroon": "#800000",
  "Imperial Maroon": "#560319",
  "Indigo Blue": "#00416A",
  "Dark Teal": "#003333",
  
  // XIV. The Navies
  "Orient": "#253455",
  "Navy Blue": "#000080",
  "Navy": "#000033",
  "Navy Tuna": "#353545",
  
  // XV. The Charcoals
  "Dark Grey": "#363636",
  "Charcoal Grey": "#333333",
  "Charade": "#2C2D3C",
  
  // XVI. Midnight
  "Heavy Metal": "#2B3228",
  "Congo Purple": "#28212C",
  "Firefly": "#0E2A30",
  "Pearl Black": "#1C1C1C",
  
  // XVII. Absolute
  "Obsidian Night": "#000000",
}

// Function to get hex color or return a default color
export const getColorHex = (colorName: string): string => {
  return colorToHex[colorName] || "#CCCCCC"; // Default to light gray if not found
}

// Function to determine if text should be light or dark based on background
export const getTextColorForBackground = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return dark text for light backgrounds, light text for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
