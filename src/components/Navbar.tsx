import { Palette, RefreshCw, Lock, Unlock, FolderHeart, Code, Moon, Sun } from 'lucide-react';
import { HARMONY_TYPES, TONE_PRESETS } from '../utils/colorUtils';

interface NavbarProps {
  harmony: string;
  setHarmony: (harmony: string) => void;
  tonePreset: string;
  setTonePreset: (preset: string) => void;
  size: number;
  setSize: (size: number) => void;
  onGenerate: () => void;
  onLockAll: () => void;
  onUnlockAll: () => void;
  onToggleSaved: () => void;
  onOpenExport: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export function Navbar({
  harmony,
  setHarmony,
  tonePreset,
  setTonePreset,
  size,
  setSize,
  onGenerate,
  onLockAll,
  onUnlockAll,
  onToggleSaved,
  onOpenExport,
  isDarkTheme,
  onToggleTheme,
}: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo-container">
          <Palette className="logo-icon" size={24} />
          <div className="logo-text">
            <h2>ChromaGen</h2>
            <span className="logo-tag">PALETTE CREATOR</span>
          </div>
        </div>
      </div>

      <div className="navbar-controls">
        {/* Harmony Dropdown */}
        <div className="control-group">
          <label htmlFor="harmony-select">Harmony</label>
          <select
            id="harmony-select"
            className="select-field"
            value={harmony}
            onChange={e => setHarmony(e.target.value)}
          >
            <option value={HARMONY_TYPES.RANDOM}>Completely Random</option>
            <option value={HARMONY_TYPES.ANALOGOUS}>Analogous (Cohesive)</option>
            <option value={HARMONY_TYPES.MONOCHROMATIC}>Monochromatic</option>
            <option value={HARMONY_TYPES.COMPLEMENTARY}>Complementary</option>
            <option value={HARMONY_TYPES.SPLIT_COMPLEMENTARY}>Split-Complementary</option>
            <option value={HARMONY_TYPES.TRIADIC}>Triadic</option>
            <option value={HARMONY_TYPES.TETRADIC}>Tetradic</option>
          </select>
        </div>

        {/* Tone/Tone constraint */}
        <div className="control-group">
          <label htmlFor="preset-select">Tone Filter</label>
          <select
            id="preset-select"
            className="select-field"
            value={tonePreset}
            onChange={e => setTonePreset(e.target.value)}
          >
            <option value={TONE_PRESETS.NONE}>No Constraints</option>
            <option value={TONE_PRESETS.PASTEL}>Pastel Tones</option>
            <option value={TONE_PRESETS.NEON}>Bright / Neon</option>
            <option value={TONE_PRESETS.DARK}>Deep / Dark</option>
            <option value={TONE_PRESETS.MUTED}>Vintage / Muted</option>
          </select>
        </div>

        {/* Palette Size */}
        <div className="control-group">
          <label htmlFor="size-slider">Colors ({size})</label>
          <div className="flex items-center gap-2">
            <input
              id="size-slider"
              type="range"
              min="2"
              max="10"
              value={size}
              className="slider"
              onChange={e => setSize(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Lock/Unlock All Actions */}
        <div className="action-buttons-group">
          <button className="btn btn-outline btn-sm flex items-center gap-1" onClick={onLockAll} title="Lock all colors">
            <Lock size={14} /> <span className="hide-tablet">Lock All</span>
          </button>
          <button className="btn btn-outline btn-sm flex items-center gap-1" onClick={onUnlockAll} title="Unlock all colors">
            <Unlock size={14} /> <span className="hide-tablet">Unlock All</span>
          </button>
        </div>

        {/* Generate Button */}
        <button className="btn btn-primary btn-sm flex items-center gap-1.5 px-4" onClick={onGenerate}>
          <RefreshCw size={14} className="rotate-icon" /> Generate
        </button>
      </div>

      <div className="navbar-right">
        {/* Dark Mode toggle */}
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Saved boards trigger */}
        <button
          className="btn btn-secondary btn-sm flex items-center gap-1.5"
          onClick={onToggleSaved}
        >
          <FolderHeart size={16} /> Saved
        </button>

        {/* Export trigger */}
        <button
          className="btn btn-accent btn-sm flex items-center gap-1.5"
          onClick={onOpenExport}
        >
          <Code size={16} /> Export
        </button>
      </div>
    </header>
  );
}
