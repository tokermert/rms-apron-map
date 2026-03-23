import { mockMetrics } from '../../data/mockMetrics';
import MetricCard from './MetricCard';

export default function BottomPanel() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-[900]"
      style={{ pointerEvents: 'none', padding: '0 16px 16px' }}
    >
      <div
        className="flex overflow-x-auto"
        style={{
          pointerEvents: 'auto',
          scrollbarWidth: 'none',
          gap: 10,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {mockMetrics.map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </div>
    </div>
  );
}
