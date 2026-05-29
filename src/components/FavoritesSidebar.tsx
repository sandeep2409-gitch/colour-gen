import { useState, useEffect, type FormEvent, type MouseEvent } from 'react';
import { Heart, Trash2, X, Plus, FolderHeart } from 'lucide-react';
import { type Color } from '../utils/colorUtils';

interface SavedPalette {
  id: string;
  name: string;
  colors: string[]; // store hex strings
  createdAt: number;
}

interface FavoritesSidebarProps {
  currentColors: Color[];
  onLoadPalette: (hexCodes: string[]) => void;
  onClose: () => void;
}

export function FavoritesSidebar({ currentColors, onLoadPalette, onClose }: FavoritesSidebarProps) {
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [paletteName, setPaletteName] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem('saved_color_palettes');
    if (data) {
      try {
        setSavedPalettes(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse saved palettes', e);
      }
    }
  }, []);

  const saveCurrentPalette = (e: FormEvent) => {
    e.preventDefault();
    const hexCodes = currentColors.map(c => c.hex);
    const newPalette: SavedPalette = {
      id: Math.random().toString(36).substring(2, 9),
      name: paletteName.trim() || `Palette #${savedPalettes.length + 1}`,
      colors: hexCodes,
      createdAt: Date.now(),
    };

    const updated = [newPalette, ...savedPalettes];
    setSavedPalettes(updated);
    localStorage.setItem('saved_color_palettes', JSON.stringify(updated));
    setPaletteName('');
  };

  const deletePalette = (id: string, e: MouseEvent) => {
    e.stopPropagation(); // prevent loading it
    const updated = savedPalettes.filter(p => p.id !== id);
    setSavedPalettes(updated);
    localStorage.setItem('saved_color_palettes', JSON.stringify(updated));
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="flex items-center gap-2">
          <FolderHeart size={18} className="text-accent" />
          <h3>My Saved Boards</h3>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>

      {/* Save current palette form */}
      <form className="save-form" onSubmit={saveCurrentPalette}>
        <h4>Save Current Palette</h4>
        <div className="flex gap-2">
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Neon Beach, Warm Retro"
            value={paletteName}
            onChange={e => setPaletteName(e.target.value)}
            maxLength={25}
          />
          <button type="submit" className="btn btn-primary btn-icon-only" aria-label="Save current palette">
            <Plus size={18} />
          </button>
        </div>
      </form>

      {/* Saved list */}
      <div className="sidebar-body custom-scrollbar">
        {savedPalettes.length === 0 ? (
          <div className="empty-state">
            <Heart size={36} className="text-muted mb-2" />
            <p>No saved boards yet.</p>
            <span className="text-xs">Type a name above and click Save to capture your current work.</span>
          </div>
        ) : (
          <div className="saved-list">
            {savedPalettes.map(palette => (
              <div
                key={palette.id}
                className="saved-item-card"
                onClick={() => onLoadPalette(palette.colors)}
              >
                <div className="saved-item-info">
                  <span className="palette-title">{palette.name}</span>
                  <button
                    className="delete-item-btn"
                    onClick={e => deletePalette(palette.id, e)}
                    aria-label={`Delete palette ${palette.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {/* Visual preview dots or strips */}
                <div className="saved-item-preview">
                  {palette.colors.map((hex, idx) => (
                    <div
                      key={idx}
                      className="preview-chip"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
