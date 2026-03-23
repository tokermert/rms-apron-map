import {
  PlaneTakeoff, Clock, Truck, AlertTriangle, Activity, Shuffle,
} from 'lucide-react';

const ICON_MAP = {
  PlaneTakeoff,
  Clock,
  Truck,
  AlertTriangle,
  Activity,
  Shuffle,
};

export default function MetricCard({ metric }) {
  const IconComp = ICON_MAP[metric.icon] || Activity;

  return (
    <div
      className="relative flex-1 rounded-2xl overflow-hidden border cursor-default"
      style={{
        background: 'rgba(10, 10, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: `${metric.color}20`,
        boxShadow: `0 0 20px ${metric.color}08, inset 0 1px 0 rgba(255,255,255,0.04)`,
        minWidth: 140,
        padding: '14px 16px 12px',
      }}
    >
      {/* Glow line at top */}
      <div
        className="absolute top-0 left-3 right-3 h-[1.5px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${metric.color}80, transparent)` }}
      />

      {/* Icon + LIVE badge row */}
      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <IconComp size={16} style={{ color: metric.color, opacity: 0.7 }} />
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: metric.color,
            background: `${metric.color}10`,
            padding: '2px 7px',
            borderRadius: 10,
          }}
        >
          LIVE
        </span>
      </div>

      {/* Value + Unit */}
      <div className="flex items-baseline" style={{ gap: 5, marginBottom: 4 }}>
        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1,
            textShadow: `0 0 20px ${metric.color}25`,
          }}
        >
          {metric.value}
        </span>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
          {metric.unit}
        </span>
      </div>

      {/* Label */}
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, lineHeight: 1.2 }}>
        {metric.label}
      </div>
    </div>
  );
}
