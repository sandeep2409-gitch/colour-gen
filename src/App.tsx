import { useState, useEffect } from 'react';
import { Lock, Unlock, ArrowLeft, ArrowRight, Keyboard } from 'lucide-react';
import { type Color, createColorObject, generatePalette, HARMONY_TYPES, TONE_PRESETS } from './utils/colorUtils';
import { Navbar } from './components/Navbar';
import { FavoritesSidebar } from './components/FavoritesSidebar';
import { ExportModal } from './components/ExportModal';

import { PreviewSection } from './components/PreviewSection';

const INITIAL_HEXES = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#E11D48'];

export default function App() {
  const [colors, setColors] = useState<Color[]>([]);
  const [harmony, setHarmony] = useState<string>(HARMONY_TYPES.RANDOM);
  const [tonePreset, setTonePreset] = useState<string>(TONE_PRESETS.NONE);
  const [size, setSize] = useState<number>(5);
  
  // Theme and UI States
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize palette
  useEffect(() => {
    const initialColors = INITIAL_HEXES.map(hex => createColorObject(hex));
    setColors(initialColors);

    // Read stored theme preference
    const storedTheme = localStorage.getItem('chromagen_theme');
    if (storedTheme === 'light') {
      setIsDarkTheme(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Sync size changes to colors array
  useEffect(() => {
    if (colors.length === 0) return;

    if (size > colors.length) {
      // Expanding palette - generate new colors for additions
      const extraColors = generatePalette(size, colors, harmony, tonePreset).slice(colors.length);
      setColors([...colors, ...extraColors]);
    } else if (size < colors.length) {
      // Shrinking palette - slice the array
      setColors(colors.slice(0, size));
    }
  }, [size]);

  // Global keyboard listener for Spacebar palette generation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Suspend spacebar generation if user is typing in forms or input dialogs
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault(); // prevent scroll
        handleGenerate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [colors, harmony, tonePreset, size]);

  // Generate colors
  const handleGenerate = () => {
    const nextPalette = generatePalette(size, colors, harmony, tonePreset);
    setColors(nextPalette);
  };

  // Lock/Unlock triggers
  const toggleLock = (index: number) => {
    const updated = [...colors];
    updated[index].isLocked = !updated[index].isLocked;
    setColors(updated);
  };

  const lockAll = () => {
    setColors(colors.map(c => ({ ...c, isLocked: true })));
  };

  const unlockAll = () => {
    setColors(colors.map(c => ({ ...c, isLocked: false })));
  };

  // Direct manual color adjustment
  const handleColorChange = (index: number, newHex: string) => {
    const updated = [...colors];
    updated[index] = createColorObject(newHex, updated[index].isLocked, updated[index].id);
    setColors(updated);
  };

  // Rearranging / Shift index
  const moveColor = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= colors.length) return;

    const updated = [...colors];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setColors(updated);
  };

  // Clipboard copy helper
  const copyHexToClipboard = (color: Color) => {
    navigator.clipboard.writeText(color.hex);
    setCopiedId(color.id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  // Favorites sidebar loader
  const handleLoadPalette = (hexCodes: string[]) => {
    setSize(hexCodes.length);
    const loaded = hexCodes.map(hex => createColorObject(hex));
    setColors(loaded);
  };

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    const nextDark = !isDarkTheme;
    setIsDarkTheme(nextDark);
    const themeName = nextDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('chromagen_theme', themeName);
  };

  return (
    <>
      {/* Top Navigation */}
      <Navbar
        harmony={harmony}
        setHarmony={setHarmony}
        tonePreset={tonePreset}
        setTonePreset={setTonePreset}
        size={size}
        setSize={setSize}
        onGenerate={handleGenerate}
        onLockAll={lockAll}
        onUnlockAll={unlockAll}
        onToggleSaved={() => setIsSavedOpen(!isSavedOpen)}
        onOpenExport={() => setIsExportOpen(true)}
        isDarkTheme={isDarkTheme}
        onToggleTheme={toggleTheme}
      />

      <div className="app-container">
        {/* Main interactive area: Strips grid + Side Panel */}
        <div className="workspace-grid">
          {/* Main workspace containing color strips */}
          <main className="palette-workspace">
            {colors.map((color, idx) => {
              // Calculate standard text contrast to ensure dynamic label visibility
              const textBrightnessColor = color.hsl.l > 60 ? '#1E293B' : '#FFFFFF';
              const borderHighlight = color.isLocked ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.15)';

              return (
                <div
                  key={color.id}
                  className="color-strip"
                  style={{
                    backgroundColor: color.hex,
                    color: textBrightnessColor,
                  }}
                >
                  {/* Action overlays on strip hover */}
                  <div className="strip-overlay">
                    {/* Lock Button */}
                    <button
                      className={`strip-action-btn ${color.isLocked ? 'active' : ''}`}
                      onClick={() => toggleLock(idx)}
                      title={color.isLocked ? 'Unlock color' : 'Lock color'}
                      aria-label={color.isLocked ? 'Unlock color' : 'Lock color'}
                    >
                      {color.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>

                    {/* Move controls */}
                    <div className="reorder-controls">
                      <button
                        className="reorder-btn"
                        onClick={() => moveColor(idx, 'left')}
                        disabled={idx === 0}
                        title="Move Left"
                        aria-label="Move color left"
                      >
                        <ArrowLeft size={12} />
                      </button>
                      <button
                        className="reorder-btn"
                        onClick={() => moveColor(idx, 'right')}
                        disabled={idx === colors.length - 1}
                        title="Move Right"
                        aria-label="Move color right"
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>

                    {/* Styled Hex Code Box */}
                    <div
                      className="strip-hex-display"
                      onClick={() => copyHexToClipboard(color)}
                      title="Copy hex code"
                    >
                      {color.hex}
                    </div>

                    {/* Styled color picker input */}
                    <label className="strip-color-picker-label flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="color"
                        className="hidden-color-input"
                        value={color.hex}
                        onChange={e => handleColorChange(idx, e.target.value)}
                      />
                      <span className="btn btn-outline btn-xs" style={{ borderColor: borderHighlight, color: 'inherit' }}>
                        Adjust Color
                      </span>
                    </label>
                  </div>

                  {/* Individual visual copy notification flash popup */}
                  {copiedId === color.id && (
                    <div className="copy-flash-msg">COPIED!</div>
                  )}
                </div>
              );
            })}

            {/* Keyboard shortcut tips toolbar overlay at bottom */}
            <div className="floating-key-toolbar">
              <Keyboard size={14} />
              <span>Press <span className="key-badge">Spacebar</span> to generate new harmonies</span>
            </div>
          </main>

          {/* Right sidebar details drawer containing tools (contrast & UI preview) */}
          <aside className="right-sidebar custom-scrollbar">
            {/* Real component interactive mockup preview */}
            <PreviewSection colors={colors} />


          </aside>
        </div>

        {/* LocalStorage boards drawer */}
        {isSavedOpen && (
          <FavoritesSidebar
            currentColors={colors}
            onLoadPalette={handleLoadPalette}
            onClose={() => setIsSavedOpen(false)}
          />
        )}

        {/* Exporters modal */}
        {isExportOpen && (
          <ExportModal
            colors={colors}
            onClose={() => setIsExportOpen(false)}
          />
        )}
      </div>
    </>
  );
}
