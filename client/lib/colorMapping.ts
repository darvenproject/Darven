// Color name to hex code mapping for visual swatches
export const colorToHex: Record<string, string> = {
  // I. The Whites
"White": "#FFFFFF",
  "Paper White": "#F2F2F2",
  "Off White": "#FAF9F6", // Unified from Off-White
  "Merino White": "#F2F0E6",
  "Coconut White": "#F9F1E2",
  "Cream": "#FFFDD0",
  
  // II. Pale Tints
  "Dark Cream": "#F3E5AB",
  "Ice Green": "#87D8C3",
  "Pista Green": "#B9D9B2",
  "Spring Wood": "#F1EBD9",
  "Westar": "#D5D1C9",
  
  // III. Light Neutrals
  "Silver Sand": "#BFC1C2",
  "Silver Grey": "#C0C0C0",
  "Ash Grey": "#B2BEB5",
  "Light Sand": "#D8D1C5",
  "Biscotti": "#E3DAC9",
  "Cement": "#A5A5A5",
  
  // IV. The Biscuits & Browns
  "Beige": "#FFFACD",
  "Warm Biscuit": "#E1C699",
  "Fawn": "#E5AA70",
  "Desert Biscuit": "#D2B48C",
  "Millbrook": "#594433",
  "Paco": "#7E7166",
  "Paco Brown": "#7E7166",
  "Cocoa Bean": "#481C14",
  
  // V. Soft Pastels & Muted
  "Lilac": "#C8A2C8",
  "Light Onion": "#E0B0FF",
  "Mint Green": "#98FF98",
  "Zinc": "#7D7F7D",
  
  // VI. Mid-Neutrals
  "Dune": "#A89B8C",
  "Birch": "#96897B",
  "Light Brown": "#AD8A66",
  "Gray": "#8E8E8E", // Standardized spelling
  "Grey": "#8E8E8E",
  "Mirage": "#5D5E60",
  "Iron Gray": "#52595D",
  
  // VII. Sunset Earth
  "Desert Gold": "#C2A463",
  "Coral Reef": "#F29191",
  "Coral Tree": "#A75949",
  "Dark Yellow": "#D4AF37",
  "Maroon": "#800000",
  "Ironstone": "#86483E",
  
  // VIII. Muted Earth
  "Light Mehandi": "#8B864E",
  "Pesto": "#7C7C44",
  "Metallic Bronze": "#4D4433",
  "Metallic Brown": "#5E503F",
  "Spicy Mix": "#8D5E4C",
  "Cedar": "#3D3622",
  
  // IX. Rich Browns
  "Dune Brown": "#7A6A53",
  "Lisbon Brown": "#635447",
  "Peanut Brown": "#795C34",
  
  // X. Deep Naturals
  "Dark Olive": "#3D3F32",
  "Cedar Brown": "#3B1E1E",
  
  // XI. Royal Tones
  "Royal Grey": "#5D5E60",
  "Royal Blue": "#4169E1",
  "Ship Cove": "#788BA5",
  "Dark Rust": "#8B0200",
  "Dark Plum": "#674172",
  
  // XII. Forest Deeps
  "Rangitoto": "#2E332D",
  "Timber Green": "#1B302B",
  "Forest Green": "#228B22",
  "Emerald Green": "#046307",
  
  // XIII. The Regals
  "Imperial Maroon": "#560319",
  "Indigo Blue": "#00416A",
  "Dark Teal": "#003333",
  
  // XIV. The Navies
  "Orient": "#25465F",
  "Navy Blue": "#1A2232",
  "Navy": "#1A2232",
  "Navy Tuna": "#343642",
  
  // XV. The Charcoals
  "Black": "#1B1B1B",
  "Dark Grey": "#363636",
  "Charcoal Grey": "#333333",
  "Charade": "#2D313A",
  
  // XVI. Midnight
  "Heavy Metal": "#2B3228",
  "Congo Purple": "#59373E",
  "Firefly": "#0D1C2E",
  "Pearl Black": "#1C1C1C",
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
