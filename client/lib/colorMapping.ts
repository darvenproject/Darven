// Color name to hex code mapping for visual swatches
export const colorToHex: Record<string, string> = {
  // Wash n Wear - The Neutrals
  "White": "#FFFFFF",
  "Westar": "#DCD9D2",
  "Silver Sand": "#BFC1C2",
  "Cement": "#8D7F6D",
  "Zinc": "#A8A9AD",
  "Iron Gray": "#52595D",
  "Heavy Metal": "#2C3539",
  "Black": "#000000",
  
  // Wash n Wear - The Earth Tones
  "Spring Wood": "#F8F6F1",
  "Dune": "#383332",
  "Mirage": "#161928",
  "Dune Brown": "#2E2A27",
  "Paco Brown": "#411F10",
  "Dark Olive": "#556052",
  "Rangitoto": "#2E3D2C",
  "Timber Green": "#1D2E28",
  "Firefly": "#0E2A2B",
  
  // Wash n Wear - The Blues & Purples
  "Navy": "#000080",
  "Navy Blue": "#000080",
  "Orient": "#015E7C",
  "Congo Purple": "#663399",
  
  // Blended - The Whites & Greys
  "Paper White": "#F7F5FA",
  "Off White": "#FAF9F6",
  "Coconut White": "#F5F5DC",
  "Silver Grey": "#C0C0C0",
  "Ash Grey": "#B2BEB5",
  "Grey": "#808080",
  "Royal Grey": "#6B7B8C",
  
  // Blended - The Soft Tones
  "Light Sand": "#E2D9C6",
  "Biscotti": "#E5C9A4",
  "Beige": "#F5F5DC",
  "Warm Biscuit": "#D4A574",
  "Fawn": "#E5AA70",
  "Desert Biscuit": "#C8A882",
  "Light Brown": "#B5651D",
  
  // Blended - The Pastels
  "Dark Cream": "#F5DEB3",
  "Ice Green": "#D4F1F4",
  "Pista Green": "#93C572",
  "Light Mehandi": "#8FBC8F",
  "Lilac": "#C8A2C8",
  "Light Onion": "#FFF8E7",
  
  // Blended - The Darks
  "Dark Teal": "#014D4E",
  "Emerald Green": "#046307",
  
  // Boski - The Classics
  "Off-White": "#FAF9F6",
  "Cream": "#FFFDD0",
  
  // Boski - The Midnight Series
  "Dark Grey": "#4A4A4A",
  "Charcoal Grey": "#36454F",
  "Pearl Black": "#1C1C1C",
  
  // Boski - The Heritage Browns
  "Cedar Brown": "#4E3B31",
  "Peanut Brown": "#7A4419",
  
  // Boski - The Royal Collection
  "Royal Blue": "#4169E1",
  "Indigo Blue": "#4B0082",
  "Dark Plum": "#3E2A3F",
  "Imperial Maroon": "#5C0120",
  "Dark Rust": "#8B4513",
  "Forest Green": "#228B22",
  
  // Boski - The Signature Accents
  "Desert Gold": "#C5B358",
  "Mint green": "#98FF98",
  
  // Soft Cotton - The Desert Tones
  "Lisbon Brown": "#4E4D3C",
  "Cedar": "#3C1414",
  "Cocoa Bean": "#3D2B1F",
  "Paco": "#411F10",
  
  // Soft Cotton - Metallic Earth
  "Ironstone": "#86483C",
  "Metallic Bronze": "#CD7F32",
  "Metallic Brown": "#9C6B4E",
  
  // Soft Cotton - The Neutrals
  "Birch": "#3D3530",
  
  // Soft Cotton - The Blues
  "Navy Tuna": "#2E3842",
  "Charade": "#292A2E",
  
  // Soft Cotton - The Greens
  
  // Soft Cotton - The Warmth
  "Spicy Mix": "#885342",
  
  // Giza Moon Cotton - The Sunset Shades
  "Coral Reef": "#FD7C6E",
  "Coral Tree": "#A76E6E",
  "Dark Yellow": "#FFD700",
  
  // Giza Moon Cotton - The Regal Deep
  "Maroon": "#800000",
  
  // Giza Moon Cotton - The Ocean Cool
  "Ship Cove": "#788BBA",
  
  // Giza Moon Cotton - The Olive Series
  "Pesto": "#7C7631",
  
  // Additional Colors
  "Toffee": "#6F4E37",
  "Premium Black": "#0A0A0A",
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
