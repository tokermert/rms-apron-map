import { GripVertical, Plane, Truck, Building2 } from 'lucide-react';
import { assetDefinitions } from '../../data/assetDefinitions';
import AssetItem from './AssetItem';

export default function AssetLibrary() {
  const aircraft = assetDefinitions.filter((a) => a.category === 'aircraft');
  const infrastructure = assetDefinitions.filter((a) => a.category === 'infrastructure');
  const vehicles = assetDefinitions.filter((a) => a.category === 'vehicle');

  return (
    <div
      className="absolute top-4 left-14 z-[1000] w-52 rounded-xl overflow-hidden
                 border border-cyan-500/20"
      style={{
        background: 'rgba(10, 10, 20, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-cyan-500/10 flex items-center gap-2 sticky top-0 z-10"
        style={{ background: 'rgba(10, 10, 20, 0.95)' }}>
        <GripVertical size={14} className="text-cyan-500/50" />
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Assets
        </span>
      </div>

      {/* Aircraft Section */}
      <div className="px-2 pt-2 pb-1">
        <div className="flex items-center gap-1.5 px-1 mb-1">
          <Plane size={11} className="text-cyan-500/60" />
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Aircraft
          </span>
        </div>
        {aircraft.map((a) => (
          <AssetItem key={a.id} asset={a} />
        ))}
      </div>

      {/* Infrastructure Section */}
      <div className="px-2 pt-1 pb-1 border-t border-white/5">
        <div className="flex items-center gap-1.5 px-1 mb-1 mt-1.5">
          <Building2 size={11} className="text-emerald-500/60" />
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Infrastructure
          </span>
        </div>
        {infrastructure.map((a) => (
          <AssetItem key={a.id} asset={a} />
        ))}
      </div>

      {/* Vehicles Section */}
      <div className="px-2 pt-1 pb-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 px-1 mb-1 mt-1.5">
          <Truck size={11} className="text-yellow-500/60" />
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            GSE Vehicles
          </span>
        </div>
        {vehicles.map((a) => (
          <AssetItem key={a.id} asset={a} />
        ))}
      </div>

      {/* Hint */}
      <div className="px-3 py-2 border-t border-white/5 bg-white/[0.02] sticky bottom-0"
        style={{ background: 'rgba(10, 10, 20, 0.95)' }}>
        <p className="text-[10px] text-slate-600 text-center">
          Drag & drop onto map
        </p>
      </div>
    </div>
  );
}
