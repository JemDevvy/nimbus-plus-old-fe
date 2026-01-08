// Font configuration for easy global font changes
export const FONT_CONFIG = {
  // Primary font family - change this to switch fonts globally
  primary: 'Roboto',
  
  // Fallback fonts
  fallbacks: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ],
  
  // Alternative fonts you can easily switch to:
  alternatives: {
    inter: 'Inter',
    openSans: '"Open Sans"',
    poppins: 'Poppins',
    montserrat: 'Montserrat',
    nunito: 'Nunito',
    sourceSansPro: '"Source Sans Pro"',
    ubuntu: 'Ubuntu',
    lato: 'Lato',
    raleway: 'Raleway',
    workSans: '"Work Sans"',
  },
  
  // Font weights
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  },
  
  // Get the complete font family string
  getFontFamily: (fontName?: string) => {
    const font = fontName || FONT_CONFIG.primary;
    return [font, ...FONT_CONFIG.fallbacks].join(', ');
  },
  
  // Get Google Fonts URL for a specific font
  getGoogleFontsUrl: (fontName: string, weights: number[] = [300, 400, 500, 700]) => {
    const fontFamily = fontName.replace(/\s+/g, '+');
    const weightsParam = weights.join(';');
    return `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weightsParam}&display=swap`;
  }
};

// Example usage:
// To change to Inter font:
// 1. Update FONT_CONFIG.primary = 'Inter'
// 2. Update the Google Fonts import in index.css
// 3. The theme will automatically use the new font

export default FONT_CONFIG; 