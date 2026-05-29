import { useState, useRef } from 'react';
import { X, Copy, Check, Code, Image } from 'lucide-react';
import { type Color } from '../utils/colorUtils';

interface ExportModalProps {
  colors: Color[];
  onClose: () => void;
}

export function ExportModal({ colors, onClose }: ExportModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const triggerCopyNotification = (type: string) => {
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // 1. Raw HEX
  const getRawText = () => colors.map(c => c.hex).join(', ');

  // 2. CSS Custom Properties
  const getCssVariables = () => {
    let output = `:root {\n`;
    colors.forEach((c, idx) => {
      output += `  --color-${idx + 1}: ${c.hex};\n`;
    });
    output += `}`;
    return output;
  };

  // 3. Tailwind Config Object
  const getTailwindConfig = () => {
    let output = `colors: {\n  palette: {\n`;
    colors.forEach((c, idx) => {
      output += `    ${idx + 1}: '${c.hex}',\n`;
    });
    output += `  },\n}`;
    return output;
  };

  // 4. JSON
  const getJson = () => JSON.stringify(colors.map(c => c.hex), null, 2);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    triggerCopyNotification(type);
  };

  // 5. SVG Download
  const downloadSvg = () => {
    const rectWidth = 100;
    const rectHeight = 150;
    const padding = 20;
    const svgWidth = colors.length * rectWidth + (colors.length - 1) * padding + 40;
    const svgHeight = rectHeight + 80;

    let rects = '';
    colors.forEach((c, idx) => {
      const x = 20 + idx * (rectWidth + padding);
      rects += `
      <g>
        <rect x="${x}" y="20" width="${rectWidth}" height="${rectHeight}" rx="12" fill="${c.hex}" />
        <text x="${x + rectWidth / 2}" y="${rectHeight + 45}" font-family="sans-serif" font-size="14" font-weight="bold" fill="currentColor" text-anchor="middle">${c.hex}</text>
        <text x="${x + rectWidth / 2}" y="${rectHeight + 65}" font-family="sans-serif" font-size="11" fill="gray" text-anchor="middle">Color ${idx + 1}</text>
      </g>`;
    });

    const svgContent = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="100%" height="100%" fill="#ffffff" />
  ${rects}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `color-palette-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 6. PNG Canvas Download
  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blockWidth = 180;
    const blockHeight = 320;
    const width = colors.length * blockWidth;
    const height = blockHeight;

    canvas.width = width;
    canvas.height = height;

    colors.forEach((c, idx) => {
      const x = idx * blockWidth;

      // Draw color strip
      ctx.fillStyle = c.hex;
      ctx.fillRect(x, 0, blockWidth, blockHeight);

      // Add label container (slightly dark overlay at bottom)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(x, blockHeight - 75, blockWidth, 75);

      // Check contrast for text color on overlay
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = 'bold 18px "Outfit", sans-serif';
      ctx.fillText(c.hex, x + blockWidth / 2, blockHeight - 40);

      ctx.font = '12px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`COLOR ${idx + 1}`, x + blockWidth / 2, blockHeight - 15);
    });

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `color-palette-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Code size={20} className="text-accent" />
            <h3>Export Palette</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body custom-scrollbar">
          {/* File Exporters */}
          <div className="export-section">
            <h4>Files & Images</h4>
            <div className="export-buttons-grid">
              <button className="export-action-btn" onClick={downloadPng}>
                <Image size={18} />
                <div className="text-left">
                  <span className="btn-title">Export PNG</span>
                  <span className="btn-desc">Download color strip image</span>
                </div>
              </button>
              <button className="export-action-btn" onClick={downloadSvg}>
                <Code size={18} />
                <div className="text-left">
                  <span className="btn-title">Export SVG</span>
                  <span className="btn-desc">Download scalable vector</span>
                </div>
              </button>
            </div>
          </div>

          {/* Hidden Canvas for PNG rendering */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Code Exporters */}
          <div className="export-section">
            <div className="flex-between">
              <h4>Hex List</h4>
              <button className="copy-link-btn" onClick={() => copyToClipboard(getRawText(), 'hex')}>
                {copiedType === 'hex' ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                {copiedType === 'hex' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="code-block">{getRawText()}</pre>
          </div>

          <div className="export-section">
            <div className="flex-between">
              <h4>CSS Custom Properties</h4>
              <button className="copy-link-btn" onClick={() => copyToClipboard(getCssVariables(), 'css')}>
                {copiedType === 'css' ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                {copiedType === 'css' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="code-block">{getCssVariables()}</pre>
          </div>

          <div className="export-section">
            <div className="flex-between">
              <h4>Tailwind Config</h4>
              <button className="copy-link-btn" onClick={() => copyToClipboard(getTailwindConfig(), 'tailwind')}>
                {copiedType === 'tailwind' ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                {copiedType === 'tailwind' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="code-block">{getTailwindConfig()}</pre>
          </div>

          <div className="export-section">
            <div className="flex-between">
              <h4>JSON Array</h4>
              <button className="copy-link-btn" onClick={() => copyToClipboard(getJson(), 'json')}>
                {copiedType === 'json' ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                {copiedType === 'json' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="code-block">{getJson()}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
