# 🎨 ChromaGen — Professional Color Palette Generator

ChromaGen is a commercial-grade, responsive React web application designed to help developers and UI/UX designers generate harmonious color schemes, verify WCAG accessibility targets, preview palettes on live login interfaces, and export them into production-ready formats instantly.

---

## 🚀 Key Features

* **Harmonious Palette System**: Beyond simple random hex lists, generate mathematically cohesive palettes using standard color wheel distributions:
  * **Analogous**: Cohesive neighboring colors (spaced by 30° on the wheel).
  * **Monochromatic**: Varying lightness/saturation on a single hue.
  * **Complementary**: Directly opposing color pairs (spaced by 180°).
  * **Split-Complementary**: Base hue combined with two adjacent complements.
  * **Triadic & Tetradic**: Equidistant wheels (120° and 60°/180° distributions).
  * **Completely Random**: Free-form search space.
* **Tone Restrictions (Filter Presets)**: Lock down the generator to specific color spaces:
  * 🌸 **Pastel Tones** (high lightness, gentle saturation)
  * ⚡ **Bright / Neon** (max saturation, medium-high lightness)
  * 🌌 **Deep / Dark** (low lightness, medium saturation)
  * 🪵 **Vintage / Muted** (low saturation, medium-low lightness)
* **Accessibility / WCAG 2.1 Contrast Checker**: Select any background and text color combination in the active palette to calculate the relative luminance ratio and verify if they pass or fail WCAG AA/AAA standards for normal and large typography.
* **Live Login Page Mockup Previews**: Preview color schemes dynamically in three realistic interactive layouts:
  1. **Minimalist Style**: email and password input cards, custom checkbox markers, primary entry paths.
  2. **Glassmorphism Style**: glassmorphic overlays (`backdrop-filter: blur(...)`), translucent border lines, and glowing colored background orbs.
  3. **Split Screen Style**: side-by-side branding grids, custom marketing copy blocks, compact sign-in cards.
* **Multi-Format Developers Exporters**:
  * Copy raw hex lists.
  * Copy standard CSS `:root` Custom Variables.
  * Copy custom Tailwind CSS colors configuration object.
  * Copy structured JSON lists.
  * Download standard scalable SVG vectors.
  * Download high-resolution PNG color strip cards rendered on an HTML5 canvas.
* **Premium UX Details**:
  * Keyboard shortcut: Hit `Spacebar` to generate (automatically suspended when typing).
  * Lock individual colors to persist through subsequent generations.
  * Rearrange color chips using shift controls.
  * Adjust custom shades directly via visual native picker attachments.
  * Save palettes with custom names into a Favorites dashboard stored in LocalStorage.
  * System-reactive high-contrast Light/Dark themes.

---

## 🛠️ Tech Stack

* **Core**: React 19 (TypeScript)
* **Bundler & Compiler**: Vite
* **Styling**: Modern CSS3 (CSS Grid, Flexbox, backdrop-filter glassmorphism, container queries, `:has()`, `:user-valid`)
* **Icons**: Lucide React

---

## 🧠 Core Implementation details

1. **Precision HSL Conversions**: Working with RGB values is useful for canvas rendering, but HSL (Hue, Saturation, Lightness) is the optimal space for color relationships. Writing custom roundtrip algorithms (HEX ⇄ RGB ⇄ HSL) made it easy to enforce mathematical harmony configurations.
2. **WCAG Relative Luminance**: Implemented the standardized W3C relative luminance formulas. Applying non-linear sRGB gamma correction to calculate exact contrast ratios is critical for constructing robust accessibility audits.
3. **Canvas Image Compilation**: Drawing custom vectors and colors onto dynamic HTML5 standard contexts in the browser allows downloading pixel-perfect color strip card packages (PNG) entirely on the client side.

---

## 📥 How to Run Locally

### 1. Clone the project and navigate to the folder
```bash
cd "DAY6 --COLOUR PALETTE GEN"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
# colour-gen
