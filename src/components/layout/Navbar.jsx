import React from 'react';
import { Activity, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <motion.nav 
      initial={{ y: 100, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50"
    >
      <NavButton 
        isActive={activeTab === 'tracker'} 
        onClick={() => setActiveTab('tracker')}
        icon={<Activity size={24} strokeWidth={activeTab === 'tracker' ? 2.5 : 2} />}
        label="Registro"
      />
      
      <NavButton 
        isActive={activeTab === 'stats'} 
        onClick={() => setActiveTab('stats')}
        icon={<BarChart2 size={24} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />}
        label="Estadísticas"
      />
    </motion.nav>
  );
};

// Subcomponente pequeño para el botón
const NavButton = ({ isActive, onClick, icon, label }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
      isActive 
        ? "text-white" 
        : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600"
    }`}
  >
    {/* Fondo animado cuando está activo */}
    {isActive && (
      <motion.div
        layoutId="nav-bg"
        className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/40"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    {/* Icono encima */}
    <span className="relative z-10">{icon}</span>
  </button>
);

export default Navbar;