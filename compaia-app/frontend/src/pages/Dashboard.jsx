import { useEffect, useState } from 'react';
import { Search, Bell, AlertTriangle, Users, TrendingUp, Activity, ChevronDown } from 'lucide-react';
import SeniorCard from '../components/SeniorCard';
import Sidebar from '../components/Sidebar';
import DetailDrawer from '../components/DetailDrawer';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const MOCK = [
  {
    id:'1', nom:'Mme Claire Dubois', chambre:'Ch. 104', tel:'+33600000001',
    checkIns:[{ id:'c1', date:new Date().toISOString(), scoreHumeur:2, statusCouleur:'Red',
      resumeIa:'Tachycardie détectée (115 bpm). Détresse physique.', fc:'115 bpm', spo2:'92%',
      humeurChip:'😟 Détresse physique', transcript:'Tachycardie détectée par le système de monitoring.' }],
    alerts:[{ id:'a1', estResolu:false, type:'TACHYCARDIE' }],
  },
  {
    id:'2', nom:'M. Jean Lefebvre', chambre:'Ch. 202', tel:'+33600000002',
    checkIns:[{ id:'c2', date:new Date(Date.now()-720000).toISOString(), scoreHumeur:2, statusCouleur:'Red',
      resumeIa:'Sortie de lit détectée. Agité et désorienté.', fc:'—', spo2:'—',
      humeurChip:'⚠️ Agité / Désorienté', transcript:'Sortie de lit détectée par capteur de mouvement.' }],
    alerts:[{ id:'a2', estResolu:false, type:'CHUTE' }],
  },
  {
    id:'3', nom:'M. Pierre Martin', chambre:'Ch. 212', tel:'+33600000003',
    checkIns:[{ id:'c3', date:new Date().toISOString(), scoreHumeur:5, statusCouleur:'Orange',
      resumeIa:'Légère baisse de mobilité. Surveillance articulaire préconisée.', fc:'88 bpm', spo2:'95%',
      humeurChip:'😐 Calme / Fatigué', transcript:'Légère baisse de mobilité observée ce matin.' }],
    alerts:[],
  },
  {
    id:'4', nom:'Mme Hélène Bernard', chambre:'Ch. 305', tel:'+33600000004',
    checkIns:[{ id:'c4', date:new Date().toISOString(), scoreHumeur:9, statusCouleur:'Green',
      resumeIa:'Interaction sociale positive. Appétit normal au petit-déjeuner.', fc:'72 bpm', spo2:'98%',
      humeurChip:'😀 Paisible', transcript:'Interaction sociale positive ce matin.' }],
    alerts:[],
  },
  {
    id:'5', nom:'Mme Simone Leroy', chambre:'Ch. 102', tel:'+33600000005',
    checkIns:[{ id:'c5', date:new Date().toISOString(), scoreHumeur:9, statusCouleur:'Green',
      resumeIa:'Très lucide. Échanges nostalgiques sur le jardinage.', fc:'68 bpm', spo2:'99%',
      humeurChip:'✨ Éveillée', transcript:'Échanges nostalgiques sur le jardinage, très lucide.' }],
    alerts:[],
  },
  {
    id:'6', nom:'M. Robert Petit', chambre:'Ch. 301', tel:'+33600000006',
    checkIns:[{ id:'c6', date:new Date().toISOString(), scoreHumeur:8, statusCouleur:'Green',
      resumeIa:'Cycle de sommeil optimal. Aucune alerte nocturne.', fc:'70 bpm', spo2:'97%',
      humeurChip:'😴 Reposé', transcript:'Nuit calme, cycle de sommeil optimal.' }],
    alerts:[],
  },
];

export default function Dashboard() {
  const [seniors, setSeniors] = useState(MOCK);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch(`${API}/api/seniors`).then(r => r.json()).then(d => { if (d?.length) setSeniors(d); }).catch(() => {});
  }, []);

  const resolveAlert = (alertId) => {
    setSeniors(prev => prev.map(s => ({ ...s, alerts: s.alerts.map(a => a.id === alertId ? { ...a, estResolu: true } : a) })));
    setSelected(prev => prev ? { ...prev, alerts: prev.alerts.map(a => a.id === alertId ? { ...a, estResolu: true } : a) } : null);
  };

  const critiques = seniors.filter(s => s.checkIns?.[0]?.statusCouleur === 'Red');
  const suivis    = seniors.filter(s => s.checkIns?.[0]?.statusCouleur === 'Orange');
  const stables   = seniors.filter(s => !s.checkIns?.[0] || s.checkIns?.[0]?.statusCouleur === 'Green');
  const activeAlerts = seniors.filter(s => s.alerts?.some(a => !a.estResolu)).length;

  const filtered = filter === 'all' ? seniors
    : filter === 'alerts' ? critiques
    : filter === 'orange' ? suivis
    : stables;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un patient ou une chambre..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 rounded-xl border-0 outline-none focus:ring-2 focus:ring-blue-200 text-slate-700"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-slate-100 transition">
              <Bell size={18} className="text-slate-500" />
              {activeAlerts > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#B32F2F' }} />
              )}
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#0055BB' }}>
              IS
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Statut Système', value: 'Optimal', sub: 'Tous services actifs', color: '#2E7D32', bg: '#F0FDF4' },
              { label: 'Occupation',     value: `${seniors.length}/50`, sub: 'Résidents actifs', color: '#0055BB', bg: '#EFF6FF' },
              { label: 'Alertes actives',value: String(activeAlerts).padStart(2,'0'), sub: 'Intervention requise', color: '#B32F2F', bg: '#FDECEA' },
              { label: 'Score efficacité',value: '94%', sub: 'Ce mois-ci', color: '#E65100', bg: '#FFF7ED' },
            ].map(({ label, value, sub, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">{label}</p>
                <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
                <p className="text-xs text-slate-400 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* Priority Queue */}
          {critiques.length > 0 && (
            <section>
              <h2 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={16} style={{ color: '#B32F2F' }} /> Critical Queue
              </h2>
              <div className="space-y-3">
                {critiques.map(s => {
                  const last = s.checkIns?.[0];
                  const alert = s.alerts?.find(a => !a.estResolu);
                  return (
                    <div
                      key={s.id}
                      className="bg-white rounded-r-2xl border-l-4 flex items-center p-5 shadow-sm animate-blink cursor-pointer hover:shadow-md transition"
                      style={{ borderLeftColor: '#B32F2F' }}
                      onClick={() => setSelected(s)}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: '#B32F2F' }}>
                        {s.nom.charAt(0)}
                      </div>
                      <div className="flex-1 ml-4">
                        <p className="font-bold text-slate-800 text-sm">{s.nom} <span className="text-slate-400 font-normal">• {s.chambre}</span></p>
                        <p className="text-xs text-slate-500 mt-0.5">{last?.resumeIa}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          {last ? new Date(last.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                        <button
                          onClick={e => { e.stopPropagation(); if (alert) resolveAlert(alert.id); }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white transition"
                          style={{ backgroundColor: '#B32F2F' }}
                        >
                          Intervenir
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setSelected(s); }}
                          className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                        >
                          Détails
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Senior Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Users size={16} className="text-slate-400" /> Senior Insight Monitoring
              </h2>
              <div className="flex items-center gap-2">
                {[
                  { key: 'all', label: 'Tous' },
                  { key: 'alerts', label: 'Alertes' },
                  { key: 'orange', label: 'Suivi' },
                  { key: 'green', label: 'Stables' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition"
                    style={filter === key
                      ? { backgroundColor: '#0055BB', color: '#fff' }
                      : { backgroundColor: '#F1F5F9', color: '#64748b' }
                    }
                  >
                    {label}
                  </button>
                ))}
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-500">
                  Priorité <ChevronDown size={12} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {filtered.map(s => (
                <SeniorCard key={s.id} senior={s} onClick={setSelected} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <DetailDrawer senior={selected} onClose={() => setSelected(null)} onResolve={resolveAlert} />
    </div>
  );
}
