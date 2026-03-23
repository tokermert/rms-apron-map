export default function AssetItem({ asset }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-3 p-2.5 rounded-lg cursor-grab active:cursor-grabbing
                 border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/5
                 transition-all duration-200 group"
    >
      <div
        className="w-10 h-10 flex items-center justify-center flex-shrink-0
                    rounded-md bg-white/5 group-hover:bg-cyan-500/10 transition-colors"
        dangerouslySetInnerHTML={{ __html: asset.svg }}
      />
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
          {asset.label}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">
          {asset.category}
        </span>
      </div>
    </div>
  );
}
