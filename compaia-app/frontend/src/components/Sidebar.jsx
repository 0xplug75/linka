import { LayoutDashboard, Bell, BookOpen, PlusCircle, Activity } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alertes', icon: Bell, label: 'Alertes' },
  { to: '/care-logs', icon: BookOpen, label: 'Care Logs' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity size={18} style={{ color: '#0055BB' }} />
          <span className="font-extrabold text-base" style={{ color: '#0055BB' }}>LINKA</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Vitality Bridge</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive ? 'text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#0055BB' } : {}}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Stats */}
      <div className="mx-4 mb-4 bg-slate-50 rounded-xl p-4 space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Unité</p>
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Occupation</span><span>45 / 50</span>
        </div>
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Staff</span><span style={{ color: '#2E7D32' }}>● Couvert</span>
        </div>
      </div>

      {/* New Entry */}
      <div className="p-4 border-t border-slate-100">
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition"
          style={{ backgroundColor: '#0055BB' }}
        >
          <PlusCircle size={15} /> Nouvelle entrée
        </button>
      </div>
    </aside>
  );
}
