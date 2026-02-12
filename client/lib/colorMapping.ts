// Color name to hex code mapping for visual swatches
export const colorToHex: Record<string, string> = {
  // I. The Whites
"White": "#FFFFFF",
  "Paper White": "#F2F2F2",
  "Off White": "#FAF9F6", // Unified from Off-White
  "Merino White": "#F6F0E6",
  "Coconut White": "#965A3E",
  "Cream": "#FFFDD0",
  
  // II. Pale Tints
  "Dark Cream": "#FBC678",
  "Ice Green": "#87D8C3",
  "Pista Green": "#84B067",
  "Spring Wood": "#F8F6F1",
  "Westar": "#D4CFC5",
  
  // III. Light Neutrals
  "Silver Sand": "#BBBEC3",
  "Silver Grey": "#C0C0C0",
  "Ash Grey": "#B2BEB5",
  "Light Sand": "#C2B280",
  "Biscotti": "#C27E79",
  "Cement": "#A5A391",
  
  // IV. The Biscuits & Browns
  "Beige": "#F5F5DC",
  "Warm Biscuit": "#E4CBAC",
  "Fawn": "#E5AA70",
  "Desert Biscuit": "#FEEDCA",
  "Millbrook": "#595648",
  "Paco": "#4F4037",
  "Paco Brown": "#C27E79",
  "Cocoa Bean": "#481C1C",
  
  // V. Soft Pastels & Muted
  "Lilac": "#C8A2C8",
  "Light Onion": "#f6dce9",
  "Mint Green": "#3eb489",
  "Zinc": "#6B6862",
  
  // VI. Mid-Neutrals
  "Dune": "#383533",
  "Birch": "#EDE2D4",
  "Light Brown": "#C4A484",
  "Gray": "#808080", // Standardized spelling
  "Grey": "#808080",
  "Mirage": "#161928",
  "Iron Gray": "#4B5D67",
  
  // VII. Sunset Earth
  "Desert Gold": "#D4B680",
  "Coral Reef": "#FD7C6E",
  "Coral Tree": "#A86B6B",
  "Dark Yellow": "#BA8E23",
  "Maroon": "#800000",
  "Ironstone": "#86483C",
  
  // VIII. Muted Earth
  "Light Mehandi": "#AE7F29",
  "Pesto": "#7C7631",
  "Metallic Bronze": "#49371B",
  "Metallic Brown": "#AC4313",
  "Spicy Mix": "#8D5F4D",
  "Cedar": "#BD9176",
  
  // IX. Rich Browns
  "Dune Brown": "#917C6E",
  "Lisbon Brown": "#423921",
  "Peanut Brown": "#d9a068",
  "Rolling Stone": "#6D7876",

  
  // X. Deep Naturals
  "Dark Olive": "#373E02",
  "Cedar Brown": "#52412E",
  
  
  // XI. Royal Tones
  "Royal Grey": "#7F909E",
  "Royal Blue": "#305CDE",
  "Ship Cove": "#7988ab",
  "Dark Rust": "#8B3103",
  "Dark Plum": "#3D1A39",
  "Nevada": "#d7deda",
  "Boulder": "#7A7A7A",
  "Natural Gray": "#8B8680",

  
  // XII. Forest Deeps
  "Rangitoto": "#2E3222",
  "Timber Green": "#16322C",
  "Forest Green": "#2E6F40",
  "Emerald Green": "#00674F",
  "Regent St Blue": "#A0CDD9",

  // XIII. The Regals
  "Imperial Maroon": "#360909",
  "Indigo Blue": "#001B94",
  "Dark Teal": "#014D4E",
  "Fuscous Gray": "#3C3B3C",
  "Dark Brown": "#302621",

  
  // XIV. The Navies
  "Orient": "#156681",
  "Navy Blue": "#111184",
  "Navy": "#2A344D",
  "Navy Tuna": "#343642",
  "Ironside Gray": "#656862",
  "Dark Gray": "#363737",
  
  // XV. The Charcoals
  "Black": "#1B1B1B",
  "Dark Grey": "#363636",
  "Charcoal Grey": "#333333",
  "Charade": "#2D313A",
  "Dusty Gray": "#A8989B",
  "Raven": "#727B89",
  "Zobra": "#A29589",
  
  // XVI. Midnight
  "Heavy Metal": "#2B3228",
  "Congo Purple": "#59373E",
  "Firefly": "#0D1C2E",
  "Pearl Black": "#1C1C1C",
  "Obsidian Night": "#000000",
  "Granite Green": "8D8974",
  "Navy Black": "00001C",
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
