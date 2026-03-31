import { X, Phone, CheckCircle, Sparkles, ClipboardList, MessageSquare } from 'lucide-react';

const statusConfig = {
  Green:  { label: 'Stable',   color: '#2E7D32', bg: '#F0FDF4' },
  Orange: { label: 'Suivi',    color: '#E65100', bg: '#FFF7ED' },
  Red:    { label: 'Critique', color: '#B32F2F', bg: '#FDECEA' },
};

const CHECKLIST = [
  'Vérifier la position et le confort du résident',
  'Confirmer la prise des médicaments du matin',
  'Informer le médecin référent si statut Rouge',
  'Documenter l\'intervention dans le Care Log',
];

export default function DetailDrawer({ senior, onClose, onResolve }) {
  if (!senior) return null;

  const last = senior.checkIns?.[0];
  const status = last?.statusCouleur || 'Green';
  const cfg = statusConfig[status] || statusConfig.Green;
  const unresolvedAlert = senior.alerts?.find(a => !a.estResolu);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />

      <aside className="fixed right-0 top-0 h-full w-[450px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col">
        {/* Header */}
        <header className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Détails de l'intervention</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {senior.chambre || 'Chambre —'} • {senior.nom}
            </p>
            <span
              className="inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: cfg.bg, color: cfg.color }}
            >
              {cfg.label}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition">
            <X size={18} className="text-slate-500" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* IA Analysis */}
          <section className="rounded-2xl p-5 border" style={{ backgroundColor: '#EFF6FF', borderColor: '#bfdbfe' }}>
            <div className="flex items-center gap-2 mb-3" style={{ color: '#0055BB' }}>
              <Sparkles size={15} />
              <h3 className="text-xs font-extrabold uppercase tracking-wider">Analyse IA</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#1e3a5f' }}>
              {last?.resumeIa || 'Aucune analyse disponible pour ce résident.'}
            </p>
          </section>

          {/* Signes vitaux */}
          {(last?.fc || last?.spo2) && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Signes vitaux</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold mb-1">Fréquence cardiaque</p>
                  <p className="text-xl font-extrabold" style={{ color: last?.statusCouleur === 'Red' ? '#B32F2F' : '#0055BB' }}>{last.fc}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold mb-1">SpO2</p>
                  <p className="text-xl font-extrabold" style={{ color: last?.statusCouleur === 'Red' ? '#B32F2F' : '#2E7D32' }}>{last.spo2}</p>
                </div>
              </div>
            </section>
          )}

          {/* AI Chip */}
          {last?.humeurChip && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Chip — Humeur</h3>
              <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 border border-slate-100">
                {last.humeurChip}
              </div>
            </section>
          )}

          {/* Transcript */}
          {last?.transcript && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={13} className="text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Transcript</h3>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 max-h-36 overflow-y-auto border border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed">{last.transcript}</p>
              </div>
            </section>
          )}

          {/* Protocol Checklist */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList size={13} className="text-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Protocol Checklist</h3>
            </div>
            <ul className="space-y-2">
              {CHECKLIST.map((item, i) => (
                <li key={i} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <input type="checkbox" className="rounded accent-blue-600 w-4 h-4 shrink-0" />
                  <span className="text-sm text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Historique */}
          {senior.checkIns?.length > 1 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Historique récent</h3>
              <div className="space-y-2">
                {senior.checkIns.slice(1, 5).map(ci => {
                  const c = statusConfig[ci.statusCouleur] || statusConfig.Green;
                  return (
                    <div key={ci.id} className="flex items-center gap-3 text-xs text-slate-500 py-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="font-semibold">{new Date(ci.date).toLocaleDateString('fr-FR')}</span>
                      <span className="italic truncate">"{ci.resumeIa}"</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white border border-slate-200 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition">
              Famille
            </button>
            <button className="bg-white border border-slate-200 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition">
              Suivi
            </button>
          </div>
          {unresolvedAlert ? (
            <button
              onClick={() => onResolve(unresolvedAlert.id)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm text-white shadow-lg transition"
              style={{ backgroundColor: '#B32F2F', boxShadow: '0 4px 14px rgba(179,47,47,0.3)' }}
            >
              <CheckCircle size={16} /> Marquer comme traitée
            </button>
          ) : (
            <a
              href={`tel:${senior.tel}`}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm text-white shadow-lg transition"
              style={{ backgroundColor: '#0055BB', boxShadow: '0 4px 14px rgba(0,85,187,0.3)' }}
            >
              <Phone size={16} /> Appeler {senior.nom}
            </a>
          )}
        </footer>
      </aside>
    </>
  );
}
