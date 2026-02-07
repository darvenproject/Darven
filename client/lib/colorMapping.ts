// Color name to hex code mapping for visual swatches
export const colorToHex: Record<string, string> = {
  // 1-6: White Tones
  "Paper White": "#F2F2F2",              // Ultra-clean, crisp white
  "Off-White": "#FAF9F6",                // Professional soft white
  "Coconut White": "#F9F1E2",            // Warm, milky ivory
  "Cream": "#FFFDD0",                    // Classic buttery tint
  "Spring Wood": "#F1EBD9",              // Barely-there parchment
  "Westar": "#E0DED7",                   // Mist-touched white
  
  // 7-10: Pale & Light Greens/Greys
  "Ice Green": "#87D8C3",                // Delicate mint frost (corrected)
  "Pista Green": "#B9D9B2",              // Soft pistachio husk
  "Silver Sand": "#BFC1C2",              // Refined light silver
  "Silver Grey": "#C0C0C0",              // Traditional metallic grey
  
  // 11-15: Grey & Beige Neutrals
  "Ash Grey": "#B2BEB5",                 // Earthy, desaturated grey
  "Biscotti": "#E3DAC9",                 // Toasted almond neutral
  "Warm Biscuit": "#E1C699",             // Golden-sand neutral
  "Fawn": "#E5AA70",                     // Light cinnamon tan
  "Zinc": "#92898A",                     // Deep brushed metal (refined)
  
  // 16-20: Mid-Tone Greys & Earth
  "Cement": "#8B8C8B",                   // Solid mid-tone grey
  "Dune": "#A39689",                     // Warm desert stone
  "Mirage": "#5C5D66",                   // Hazy blue-grey
  "Iron Gray": "#52595D",                // Deep slate industrial grey
  "Desert Gold": "#C2A463",              // Rich matte ochre
  
  // 21-25: Earth & Browns
  "Coral Tree": "#A86B6B",               // Muted terracotta red
  "Light Mehandi": "#8B864E",            // Dried herb green
  "Pesto": "#7C7631",                    // Deep savory olive
  "Dune Brown": "#7B6652",               // Soft coffee earth
  "Paco Brown": "#463D3E",               // Dark espresso husk
  
  // 26-31: Royal & Deep Tones
  "Ship Cove": "#788BBA",                // Dust-moted royal blue
  "Royal Blue": "#4169E1",               // High-saturation cobalt
  "Dark Olive": "#556B2F",               // Shadowed forest green
  "Timber Green": "#163330",             // Deepest pine needle
  "Maroon": "#800000",                   // Classic dark bordeaux
  "Imperial Maroon": "#560319",          // Deepest royal wine
  
  // 32-38: Navy, Charcoal & Blacks
  "Navy Blue": "#000080",                // Traditional naval blue
  "Charcoal Grey": "#333333",            // Burnt wood grey
  "Black Diamond": "#242526",            // Reflective carbon black
  "Pearl Black": "#1C1C1C",              // Lustrous, soft-satin black
  "Heavy Metal": "#1B1E1A",              // Darkest iron-tinted black
  "Firefly": "#0E2021",                  // Inky midnight teal
  "Obsidian Night": "#000000",           // The Purest Black
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
