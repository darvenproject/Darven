// Color name to hex code mapping for visual swatches
export const colorToHex: Record<string, string> = {
  // White Tones
  "Paper White": "#F2F2F2",
  "Off-White": "#FAF9F6",
  "Coconut White": "#F9F1E2",
  "Cream": "#FFFDD0",
  
  // Pale Tint
  "Spring Wood": "#F1EBD9",
  "Westar": "#E0DED7",
  
  // Pastel
  "Dark Cream": "#F3E5AB",
  "Ice Green": "#DADBD3",
  "Pista Green": "#93C572",
  "Mint Green": "#98FF98",
  "Lilac": "#C8A2C8",
  "Light Onion": "#E0B0FF",
  
  // Light Grey
  "Silver Sand": "#BFC1C2",
  "Silver Grey": "#C0C0C0",
  "Ash Grey": "#B2BEB5",
  
  // Beige/Sand
  "Biscotti": "#E3DAC9",
  "Light Sand": "#D8D1C5",
  "Beige": "#F5F5DC",
  "Warm Biscuit": "#E1C699",
  "Fawn": "#E5AA70",
  "Desert Biscuit": "#D2B48C",
  
  // Mid-Neutral
  "Cement": "#8B8C8B",
  "Zinc": "#7D7F7D",
  "Dune": "#A39689",
  "Birch": "#918476",
  "Grey": "#808080",
  "Mirage": "#5C5D66",
  "Iron Gray": "#52595D",
  
  // Earth
  "Desert Gold": "#EDC9AF",
  "Coral Reef": "#F27E63",
  "Coral Tree": "#A86B6B",
  "Dark Yellow": "#9B870C",
  "Light Mehandi": "#8B864E",
  "Pesto": "#7C7631",
  "Metallic Bronze": "#49371B",
  "Ironstone": "#86483C",
  "Spicy Mix": "#8B5F4D",
  
  // Brown
  "Peanut Brown": "#795C34",
  "Dune Brown": "#7B6652",
  "Lisbon Brown": "#5D4B41",
  "Cedar": "#4B3A26",
  
  // Deep Natural
  "Dark Olive": "#556B2F",
  "Paco Brown": "#463D3E",
  "Cocoa Bean": "#48211A",
  "Cedar Brown": "#3B1E1E",
  
  // Royal Tone
  "Royal Grey": "#5D5E60",
  "Ship Cove": "#788BBA",
  "Royal Blue": "#4169E1",
  "Dark Rust": "#8B0200",
  "Dark Plum": "#674172",
  
  // Forest Deep
  "Rangitoto": "#2E3222",
  "Timber Green": "#163330",
  "Forest Green": "#228B22",
  "Emerald Green": "#50C878",
  
  // Regal
  "Maroon": "#800000",
  "Imperial Maroon": "#560319",
  "Indigo Blue": "#00416A",
  "Dark Teal": "#003333",
  
  // Navy
  "Orient": "#253455",
  "Navy Blue": "#000080",
  "Navy": "#000033",
  "Navy Tuna": "#353545",
  
  // Charcoal
  "Dark Grey": "#363636",
  "Charcoal Grey": "#333333",
  "Charade": "#2C2D3C",
  
  // Midnight
  "Heavy Metal": "#2B3228",
  "Congo Purple": "#28212C",
  "Firefly": "#0E2021",
  "Pearl Black": "#1C1C1C",
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
