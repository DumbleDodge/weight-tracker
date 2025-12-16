import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Moon, Sun, User, LogOut, Users, Lock, Check, X } from 'lucide-react';

// --- IMPORTACIÓN DE COMPONENTES NUEVOS ---
import Login from './components/Login';
import TrackerTab from './components/tracker/TrackerTab';
import StatsTab from './components/stats/StatsTab';
import Navbar from './components/layout/Navbar';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';

// ==========================================
// 1. COMPONENTE PERFIL (Refactorizado con Tailwind)
// ==========================================
const ProfileModal = ({ user, profile, onClose, onUpdateCoach, onLogout, clients, onSelectClient, selectedClientId }) => {
  const [coachEmail, setCoachEmail] = useState(profile?.coach_email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && profile.coach_email) setCoachEmail(profile.coach_email);
  }, [profile]);

  const handleUpdate = async () => {
    setLoading(true);
    await onUpdateCoach(coachEmail);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-sm max-h-[90vh] overflow-y-auto relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Mi Perfil</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Avatar */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white mx-auto mb-3 flex items-center justify-center text-3xl font-bold shadow-lg shadow-primary/30">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <p className="text-slate-500 text-sm font-medium">{user.email}</p>
        </div>

        {/* Sección Entrenador (Seleccionar Cliente) */}
        {clients.length > 0 && (
          <div className="mb-6">
            <p className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <Users size={14}/> Modo Entrenador
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onSelectClient(null)} 
                className={`w-full p-3 rounded-xl text-sm font-bold text-left transition-all border ${!selectedClientId ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 dark:bg-slate-950 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
              >
                Mi Perfil Personal
              </button>
              {clients.map(client => (
                <button 
                  key={client.id} 
                  onClick={() => onSelectClient(client.id)} 
                  className={`w-full p-3 rounded-xl text-sm font-bold text-left transition-all border ${selectedClientId === client.id ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 dark:bg-slate-950 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
                >
                  {client.email}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sección Mi Coach */}
        <div className="mb-8">
          <p className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <Lock size={14}/> Mi Entrenador
          </p>
          <div className="flex gap-2">
            <Input 
              type="email" 
              value={coachEmail} 
              onChange={(e) => setCoachEmail(e.target.value)} 
              placeholder="coach@email.com" 
              className="text-left py-3 text-sm font-normal"
            />
            <Button onClick={handleUpdate} className="w-auto px-4 py-3" disabled={loading}>
               {loading ? '...' : <Check size={18}/>}
            </Button>
          </div>
        </div>

        <Button onClick={onLogout} variant="danger" className="py-3 text-sm">
           <LogOut size={18}/> Cerrar Sesión
        </Button>
      </Card>
    </div>
  );
};

// ==========================================
// 2. APP PRINCIPAL
// ==========================================
function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('tracker');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [myClients, setMyClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    // Intentamos leer del localStorage, si no, preferencia del sistema, si no, 'light'
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement; // Esto es la etiqueta <html>
    
    // 1. Guardar en localStorage
    localStorage.setItem('theme', theme);
    
    // 2. Aplicar la clase 'dark' para Tailwind
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // 3. (Opcional) data-theme para compatibilidad futura
    root.setAttribute('data-theme', theme);
    
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (session?.user) {
      loadProfile();
      checkIfIAmCoach();
      fetchData();
    }
  }, [session]);

  // Recargar datos si cambia el cliente seleccionado
  useEffect(() => {
    if (session?.user) {
        fetchData(selectedClientId);
        if (selectedClientId) setActiveTab('stats');
        else setActiveTab('tracker');
    }
  }, [selectedClientId, session]);

  const loadProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    setUserProfile(data);
  };

  const checkIfIAmCoach = async () => {
    const { data } = await supabase.from('profiles').select('*').ilike('coach_email', session.user.email);
    if (data) setMyClients(data);
  };

  const fetchData = async (overrideId) => {
    try {
      const targetId = overrideId || selectedClientId || session?.user?.id;
      const { data: weights, error } = await supabase.from('weights').select('*').eq('user_id', targetId).order('created_at', { ascending: true });
      if (!error) setData(weights);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (formData) => {
    if (selectedClientId) return alert("No puedes registrar pesos en la cuenta de otro.");
    setLoading(true);
    try {
      const payload = { 
        created_at: formData.date, 
        user_id: session.user.id,
        sleep_quality: formData.sleepQuality || null,
        diet_compliance: formData.dietCompliance
      };
      if (formData.weight) payload.value = parseFloat(formData.weight);
      if (formData.sleep) payload.sleep = parseFloat(formData.sleep);
      if (formData.steps) payload.steps = parseInt(formData.steps);
      const { error } = await supabase.from('weights').insert([payload]);
      if (!error) { await fetchData(); }
    } catch (err) { alert('Error al guardar'); } finally { setLoading(false); }
  };

  const updateCoach = async (email) => {
    const { error } = await supabase.from('profiles').update({ coach_email: email }).eq('id', session.user.id);
    if (!error) { alert("Entrenador actualizado"); loadProfile(); }
  };

  // --- RENDERIZADO ---

  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-background text-slate-900 dark:text-white transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Botones Flotantes Superiores */}
     {/* BARRA SUPERIOR FIJA (HEADER) */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        {/* Lado Izquierdo: Logotipo o Nombre App (Opcional, queda bien para equilibrar) */}
        <div className="font-black text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
          FIT<span className="text-slate-900 dark:text-white">TRACK</span>
        </div>

        {/* Lado Derecho: Botones */}
        <div className="flex gap-3">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary transition-colors hover:shadow-md active:scale-95"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button 
            onClick={() => setShowProfile(true)} 
            className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary transition-colors hover:shadow-md active:scale-95"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Modal Perfil */}
      {showProfile && (
        <ProfileModal 
          user={session.user} 
          profile={userProfile} 
          onClose={() => setShowProfile(false)} 
          onUpdateCoach={updateCoach} 
          onLogout={() => supabase.auth.signOut()} 
          clients={myClients} 
          onSelectClient={(id) => { setSelectedClientId(id); setShowProfile(false); }} 
          selectedClientId={selectedClientId} 
        />
      )}
      
      {/* Banner Modo Entrenador */}
      {selectedClientId && (
        <div className="bg-primary text-white p-2 text-center text-xs font-bold uppercase tracking-wider sticky top-0 z-30 shadow-md">
          Viendo a atleta (Modo Lectura)
        </div>
      )}
      
      {/* Contenido Principal */}
      <main className="max-w-xl mx-auto px-4 pt-24 md:pt-16 pb-32">
        {activeTab === 'tracker' 
          ? <TrackerTab onSave={handleSave} isLoading={loading} lastWeight={data[data.length - 1]} /> 
          : <StatsTab data={data} />
        }
      </main>
      
      {/* Navegación Flotante (Solo visible si no estás observando a un cliente, o visible siempre si quieres permitir ver stats) */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  );
}

export default App;