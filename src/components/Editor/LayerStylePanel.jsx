import { useState, useEffect } from 'react';
import { X, Pen, Minus } from 'lucide-react';

const COLORS = [
  { label: 'Cyan', value: '#00ffff' },
  { label: 'Yellow', value: '#facc15' },
  { label: 'Magenta', value: '#ff00ff' },
  { label: 'Green', value: '#00ff88' },
  { label: 'Red', value: '#ff4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'White', value: '#ffffff' },
  { label: 'Blue', value: '#3b82f6' },
];

const DASH_PRESETS = [
  { label: 'Solid', value: '' },
  { label: 'Dashed', value: '10 6' },
  { label: 'Dotted', value: '3 4' },
  { label: 'Dash-Dot', value: '10 4 3 4' },
];

export default function LayerStylePanel({ layer, onClose }) {
  const [color, setColor] = useState('#00ffff');
  const [weight, setWeight] = useState(2);
  const [opacity, setOpacity] = useState(1);
  const [dashArray, setDashArray] = useState('');
  const [fillOpacity, setFillOpacity] = useState(0.1);

  // Read current layer style on mount
  useEffect(() => {
    if (!layer) return;
    setColor(layer.options.color || '#00ffff');
    setWeight(layer.options.weight || 2);
    setOpacity(layer.options.opacity ?? 1);
    setDashArray(layer.options.dashArray || '');
    setFillOpacity(layer.options.fillOpacity ?? 0.1);
  }, [layer]);

  if (!layer) return null;

  const isLine = !layer.options.fill && layer.setStyle;
  const hasArea = layer.options.fill !== false;

  const applyStyle = (updates) => {
    const newStyle = { color, weight, opacity, dashArray, fillOpacity, ...updates };
    // Update local state
    if (updates.color !== undefined) setColor(updates.color);
    if (updates.weight !== undefined) setWeight(updates.weight);
    if (updates.opacity !== undefined) setOpacity(updates.opacity);
    if (updates.dashArray !== undefined) setDashArray(updates.dashArray);
    if (updates.fillOpacity !== undefined) setFillOpacity(updates.fillOpacity);

    // Apply to layer
    layer.setStyle({
      color: newStyle.color,
      weight: newStyle.weight,
      opacity: newStyle.opacity,
      dashArray: newStyle.dashArray || null,
      fillColor: newStyle.color,
      fillOpacity: newStyle.fillOpacity,
    });
  };

  const sliderTrack = {
    width: '100%', height: '4px', cursor: 'pointer',
    accentColor: color,
  };

  return (
    <div
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1100] rounded-xl border border-cyan-500/30"
      style={{
        background: 'rgba(10, 10, 20, 0.95)',
        backdropFilter: 'blur(16px)',
        width: '340px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Pen size={12} color={color} />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Layer Style
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={14} className="text-slate-500" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Color picker */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">
            Stroke Color
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => applyStyle({ color: c.value })}
                className="w-6 h-6 rounded-md border-2 transition-all hover:scale-110 cursor-pointer"
                title={c.label}
                style={{
                  background: c.value,
                  borderColor: color === c.value ? '#fff' : 'rgba(255,255,255,0.15)',
                  boxShadow: color === c.value ? `0 0 8px ${c.value}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Stroke Width */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Minus size={10} className="text-slate-500" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Stroke Width
              </span>
            </div>
            <span className="text-[11px] font-bold" style={{ color }}>{weight}px</span>
          </div>
          <input
            type="range" min="1" max="20" step="1" value={weight}
            onChange={(e) => applyStyle({ weight: parseInt(e.target.value) })}
            style={sliderTrack}
          />
          <div className="flex justify-between mt-0.5">
            <span className="text-[9px] text-slate-600">1px</span>
            <span className="text-[9px] text-slate-600">20px</span>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Opacity
            </span>
            <span className="text-[11px] font-bold" style={{ color }}>
              {Math.round(opacity * 100)}%
            </span>
          </div>
          <input
            type="range" min="0.1" max="1" step="0.05" value={opacity}
            onChange={(e) => applyStyle({ opacity: parseFloat(e.target.value) })}
            style={sliderTrack}
          />
        </div>

        {/* Dash Pattern */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">
            Line Style
          </div>
          <div className="flex gap-1.5">
            {DASH_PRESETS.map((d) => (
              <button
                key={d.label}
                onClick={() => applyStyle({ dashArray: d.value })}
                className="flex-1 py-1.5 rounded-md text-[10px] font-semibold border transition-all cursor-pointer"
                style={{
                  background: dashArray === d.value ? `${color}15` : 'rgba(255,255,255,0.03)',
                  borderColor: dashArray === d.value ? `${color}50` : 'rgba(255,255,255,0.08)',
                  color: dashArray === d.value ? color : '#64748b',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fill Opacity (only for polygons) */}
        {hasArea && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Fill Opacity
              </span>
              <span className="text-[11px] font-bold" style={{ color }}>
                {Math.round(fillOpacity * 100)}%
              </span>
            </div>
            <input
              type="range" min="0" max="0.8" step="0.05" value={fillOpacity}
              onChange={(e) => applyStyle({ fillOpacity: parseFloat(e.target.value) })}
              style={sliderTrack}
            />
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="px-3 py-1.5 border-t border-white/5">
        <p className="text-[9px] text-slate-600 text-center">
          Click Edit (pencil) on toolbar to drag control points
        </p>
      </div>
    </div>
  );
}
