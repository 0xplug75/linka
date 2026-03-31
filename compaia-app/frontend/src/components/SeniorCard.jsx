import { ChevronRight, Plus } from 'lucide-react';

const statusConfig = {
  Green:  { dot: '#2E7D32', label: 'Stable',   bg: '#F0FDF4' },
  Orange: { dot: '#E65100', label: 'Suivi',     bg: '#FFF7ED' },
  Red:    { dot: '#B32F2F', label: 'Critique',  bg: '#FDECEA' },
};

// Mini sparkline SVG
function Sparkline({ color }) {
  const pts = [8,5,7,4,6,3,5,6,4,7].map((y, x) => `${x * 9},${10 - y}`).join(' ');
  return (
    <svg width="80" height="20" viewBox="0 0 81 10">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SeniorCard({ senior, onClick }) {
  const last = senior.checkIns?.[0];
  const status = last?.statusCouleur || 'Green';
  const cfg = statusConfig[status] || statusConfig.Green;

  const lastCall = last
    ? new Date(last.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <button
      onClick={() => onClick(senior)}
      className="w-full text-left bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
            <span className="font-bold text-sm text-slate-800">{senior.nom}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 ml-4">{senior.chambre || 'Chambre —'}</p>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: cfg.bg, color: cfg.dot }}
        >
          {cfg.label}
        </span>
      </div>

      {/* AI Chip */}
      {last?.humeurChip && (
        <p className="text-xs font-semibold text-slate-500 mb-3 ml-4">{last.humeurChip}</p>
      )}

      {/* Vitals */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 font-semibold mb-1">FC</p>
          <span className="text-sm font-extrabold text-slate-800">{last?.fc ?? '—'}</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 font-semibold mb-1">SpO2</p>
          <span className="text-sm font-extrabold text-slate-800">{last?.spo2 ?? '—'}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
        <p className="text-xs text-slate-400 italic truncate max-w-[160px]">
          {last?.resumeIa ? `"${last.resumeIa}"` : 'Aucun résumé'}
        </p>
        <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#0055BB' }}>
          <Plus size={11} /> Note
        </span>
      </div>
    </button>
  );
}
