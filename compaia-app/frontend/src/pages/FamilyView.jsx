import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, Bell, User, Home, History, BarChart2, Menu, Heart } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const MOCK = {
  id: '1', nom: 'Marguerite', tel: '+33600000001',
  checkIns: [
    { id:'c1', date: new Date().toISOString(),                          scoreHumeur:8, statusCouleur:'Green',  resumeIa:'Elle a parlé de son jardin avec enthousiasme.' },
    { id:'c2', date: new Date(Date.now()-86400000).toISOString(),       scoreHumeur:6, statusCouleur:'Orange', resumeIa:'Un peu fatiguée, mais de bonne humeur générale.' },
    { id:'c3', date: new Date(Date.now()-86400000*2).toISOString(),     scoreHumeur:9, statusCouleur:'Green',  resumeIa:'A évoqué ses petits-enfants avec beaucoup de joie.' },
  ],
};

const ICONS = { Green: '☀️', Orange: '🌤️', Red: '🌧️' };
const REACTIONS = [{ emoji: '❤️', count: 4 }, { emoji: '😊', count: 2 }];

export default function FamilyView() {
  const { seniorId } = useParams();
  const [senior, setSenior] = useState(MOCK);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    fetch(`${API}/api/seniors/${seniorId}`).then(r => r.json()).then(d => { if (d?.nom) setSenior(d); }).catch(() => {});
  }, [seniorId]);

  const last = senior.checkIns?.[0];
  const recent = senior.checkIns?.slice(0, 3) || [];

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Mobile Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <span className="font-extrabold text-base" style={{ color: '#0055BB' }}>LINKA</span>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-slate-100">
            <Bell size={18} className="text-slate-500" />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#0055BB' }}>
            F
          </div>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-5 pb-24">
        {/* Hero */}
        <section className="rounded-3xl p-7 text-center" style={{ backgroundColor: '#FFF7ED' }}>
          <div className="text-5xl mb-3">{ICONS[last?.statusCouleur || 'Green']}</div>
          <h1 className="text-xl font-extrabold leading-snug" style={{ color: '#7c2d12' }}>
            {last?.statusCouleur === 'Green'
              ? `${senior.nom} va bien aujourd'hui`
              : `Nouvelles de ${senior.nom}`}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#c2410c' }}>
            Dernière mise à jour : il y a quelques minutes
          </p>
        </section>

        {/* Widgets */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 mb-2">Bien-être</p>
            <div className="flex items-end gap-1 h-8">
              {[6,7,5,8,6,9,8].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${v * 10}%`, backgroundColor: i === 6 ? '#0055BB' : '#bfdbfe' }} />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">7 derniers jours</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 mb-2">Menu du midi</p>
            <p className="text-sm font-bold text-slate-700">Soupe + Poulet</p>
            <p className="text-xs text-slate-400 mt-1">A bien mangé ✓</p>
          </div>
        </div>

        {/* Timeline */}
        <section>
          <h2 className="text-base font-extrabold text-slate-800 mb-5">Moments de vie</h2>
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-slate-200" />
            <div className="space-y-6">
              {recent.map((ci, i) => (
                <div key={ci.id} className="relative pl-10">
                  <div
                    className="absolute left-3 top-2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: i === 0 ? '#E65100' : '#cbd5e1' }}
                  />
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-xl text-lg" style={{ backgroundColor: '#FFF7ED' }}>
                        {ICONS[ci.statusCouleur]}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-800">
                          {i === 0 ? 'Moment du jour' : `Il y a ${i} jour${i > 1 ? 's' : ''}`}
                        </h3>
                        <p className="text-xs text-slate-400 uppercase tracking-wide">
                          {new Date(ci.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                    </div>
                    <blockquote className="text-sm text-slate-600 italic border-l-4 pl-3 py-1 mb-4" style={{ borderColor: '#0055BB' }}>
                      "{ci.resumeIa}"
                    </blockquote>
                    <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                      {REACTIONS.map(({ emoji, count }) => (
                        <button key={emoji} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition">
                          {emoji} <span className="text-xs font-semibold">{count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Appel */}
        <a
          href={`tel:${senior.tel}`}
          className="flex items-center justify-center gap-2 w-full text-white font-extrabold py-4 rounded-2xl shadow-lg text-base transition"
          style={{ backgroundColor: '#0055BB', boxShadow: '0 4px 14px rgba(0,85,187,0.3)' }}
        >
          <Phone size={18} /> Appeler {senior.nom}
        </a>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 py-3 flex justify-around items-center">
        {[
          { key: 'home',     icon: Home,     label: 'Accueil' },
          { key: 'timeline', icon: History,  label: 'Timeline' },
          { key: 'insights', icon: BarChart2,label: 'Insights' },
          { key: 'menu',     icon: Menu,     label: 'Menu' },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex flex-col items-center gap-1 transition"
            style={{ color: activeTab === key ? '#0055BB' : '#94a3b8' }}
          >
            <Icon size={20} />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
