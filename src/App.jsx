import React, { useState, useEffect } from 'react';
import './App.css'; 
import { supabase } from './supabase';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'; 
import { Scale, Save, Calendar, ChevronRight, Moon, Footprints, Activity, BarChart2, User, LogOut, Users, Lock, GripVertical, LayoutList, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { 
  format, isSameWeek, subWeeks, subMonths, subYears, isAfter, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, 
  subDays, startOfDay, endOfDay, isSameMonth,
  startOfMonth, endOfMonth, eachWeekOfInterval 
} from 'date-fns';
import { es } from 'date-fns/locale';

// ==========================================
// 1. COMPONENTE LOGIN
// ==========================================
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Cuenta creada! Ya puedes iniciar sesión.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingBottom: 0 }}>
      <div className="glass-card" style={{ padding: '40px 24px', maxWidth: '350px', margin: '20px' }}>
        <h1 className="title-gradient" style={{ marginBottom: '10px' }}>Bienvenido</h1>
        <p className="subtitle">Tu centro de rendimiento</p>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div><label className="stat-label">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input" style={{ fontSize: '1rem', textAlign: 'left', padding: '12px' }} required /></div>
          <div><label className="stat-label">Contraseña</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input" style={{ fontSize: '1rem', textAlign: 'left', padding: '12px' }} required /></div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Entrar'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#94a3b8' }}>
          {isSignUp ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}<button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 'bold', cursor: 'pointer' }}>{isSignUp ? 'Inicia Sesión' : 'Regístrate'}</button>
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 2. COMPONENTE PERFIL
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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2000, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', padding: '24px', boxSizing: 'border-box', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Perfil</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem' }}>✕</button>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #8b5cf6, #ec4899)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>{user.email.charAt(0).toUpperCase()}</div>
        <p style={{ color: '#94a3b8' }}>{user.email}</p>
      </div>
      {clients.length > 0 && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <p className="stat-label" style={{ color: '#f472b6', display: 'flex', gap: '8px', alignItems: 'center' }}><Users size={16}/> Modo Entrenador</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            <button onClick={() => onSelectClient(null)} style={{ padding: '12px', borderRadius: '12px', background: !selectedClientId ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'left' }}>Mi Perfil</button>
            {clients.map(client => (
              <button key={client.id} onClick={() => onSelectClient(client.id)} style={{ padding: '12px', borderRadius: '12px', background: selectedClientId === client.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'left' }}>{client.email}</button>
            ))}
          </div>
        </div>
      )}
      <div className="glass-card" style={{ padding: '20px' }}>
        <p className="stat-label" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Lock size={16}/> Mi Entrenador</p>
        <input type="email" value={coachEmail} onChange={(e) => setCoachEmail(e.target.value)} className="glass-input" placeholder="email@entrenador.com" style={{ fontSize: '1rem', padding: '12px', marginBottom: '12px', textAlign: 'left' }} />
        <button onClick={handleUpdate} className="btn-primary" style={{ marginTop: '0', padding: '12px' }}>{loading ? 'Guardando...' : 'Asignar Entrenador'}</button>
      </div>
      <button onClick={onLogout} className="btn-primary" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', marginTop: '40px' }}><LogOut size={20}/> Cerrar Sesión</button>
    </div>
  );
};

// ==========================================
// 3. GRÁFICOS Y UTILIDADES
// ==========================================
const WeightChart = ({ data, color = "#8b5cf6", xPadding = 15 }) => (
  <div style={{ width: '100%', height: '220px', minWidth: 0 }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs><linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.45}/><stop offset="100%" stopColor={color} stopOpacity={0.05}/></linearGradient></defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={10} interval={0} padding={{ left: xPadding, right: xPadding }} />
        <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} orientation="right" width={40} tickCount={5} />
        <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} formatter={(value) => value ? [`${value} kg`, ''] : []} labelStyle={{ color: '#94a3b8', marginBottom: '4px' }} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#gradient-${color})`} animationDuration={1500} connectNulls={true} dot={{ stroke: '#1e293b', strokeWidth: 2, fill: color, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const StatsBarChart = ({ data, dataKey, color, unit }) => (
  <div style={{ width: '100%', height: '180px', minWidth: 0 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={10} interval={0} padding={{ left: 10, right: 10 }} />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} formatter={(value) => value ? [`${value} ${unit}`, ''] : []} labelStyle={{ color: '#94a3b8', marginBottom: '4px' }} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const WeekRow = ({ row }) => {
  const [isOpen, setIsOpen] = useState(false);
  const canExpand = row.days && row.days.length > 0;
  return (
    <>
      <tr onClick={() => canExpand && setIsOpen(!isOpen)} className={canExpand ? "row-trigger" : ""}>
        <td style={{ paddingLeft: '10px', textAlign: 'left' }}><div style={{ display: 'flex', alignItems: 'center' }}><ChevronRight size={16} className={`expand-icon ${isOpen ? 'rotated' : ''}`} style={{ opacity: canExpand ? 1 : 0.3 }} /><span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{row.range}</span></div></td>
        <td style={{ fontWeight: 'bold' }}>{row.hasCurrentData ? `${row.avg} kg` : <span className="text-neutral">-</span>}</td>
        <td>{!row.hasCurrentData || !row.hasPrevData ? <span className="text-neutral">-</span> : <span className={row.diff > 0 ? 'text-red' : row.diff < 0 ? 'text-green' : 'text-neutral'}>{row.diff > 0 ? '+' : ''}{row.diff.toFixed(1)}</span>}</td>
      </tr>
      {isOpen && row.days.map((day, i) => (<tr key={i} className="sub-row animate-fade-in"><td style={{ paddingLeft: '45px', textAlign: 'left' }}>{day.dateLabel.charAt(0).toUpperCase() + day.dateLabel.slice(1)}</td><td style={{ color: '#fff' }}>{day.val} kg</td><td></td></tr>))}
    </>
  );
};

// ==========================================
// 4. PESTAÑAS
// ==========================================

const TrackerTab = ({ onSave, isLoading, lastWeight }) => {
  const [weight, setWeight] = useState('');
  const [sleep, setSleep] = useState('');
  const [steps, setSteps] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight && !sleep && !steps) return;
    onSave({ weight, sleep, steps, date });
    setWeight(''); setSleep(''); setSteps('');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      <header style={{ marginBottom: '24px', textAlign: 'center', paddingTop: '20px' }}>
        <h1 className="title-gradient">Daily Check-in</h1>
        <div style={{ display: 'inline-block', position: 'relative', marginTop: '10px' }}>
           <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-date" style={{ marginBottom: 0, paddingLeft: '10px', width: 'auto' }} />
        </div>
      </header>
      <div className="glass-card" style={{ padding: '24px' }}>
        <div className="input-label" style={{ color: '#a78bfa' }}><Scale size={16} /> Peso Corporal</div>
        <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="glass-input" placeholder="00.0" style={{ fontSize: '3.5rem', color: '#fff' }} />
      </div>
      <div className="input-grid">
          <div className="glass-card" style={{ padding: '20px', marginBottom: 0 }}>
          <div className="input-label color-sleep"><Moon size={16} /> Horas Sueño</div>
          <input type="number" step="0.1" value={sleep} onChange={(e) => setSleep(e.target.value)} className="glass-input" placeholder="-" style={{ fontSize: '2rem', padding: '10px' }} />
          </div>
          <div className="glass-card" style={{ padding: '20px', marginBottom: 0 }}>
          <div className="input-label color-steps"><Footprints size={16} /> Pasos</div>
          <input type="number" value={steps} onChange={(e) => setSteps(e.target.value)} className="glass-input" placeholder="-" style={{ fontSize: '2rem', padding: '10px' }} />
          </div>
      </div>
      <button onClick={handleSubmit} disabled={isLoading} className="btn-primary" style={{ marginTop: '24px' }}>{isLoading ? 'Guardando...' : <><Save size={20} /> Guardar Registro</>}</button>
      {lastWeight && (<p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginTop: '24px', opacity: 0.7 }}>Último registro: {lastWeight.value} kg el {format(new Date(lastWeight.created_at), "d MMM", { locale: es })}</p>)}
    </div>
  );
};

// --- PESTAÑA STATS (ARREGLADA: CÁLCULOS ANTES DEL RENDER) ---
const StatsTab = ({ data }) => {
  const [isReordering, setIsReordering] = useState(false);
  const defaultOrder = ['weight', 'sleep', 'steps', 'table', 'month', 'year'];
  const [order, setOrder] = useState(() => {
    const saved = localStorage.getItem('statsOrder');
    return saved ? JSON.parse(saved) : defaultOrder;
  });

  useEffect(() => { localStorage.setItem('statsOrder', JSON.stringify(order)); }, [order]);

  // 1. VALIDACIÓN
  if (!data || data.length === 0) return <div className="p-10 text-center text-slate-500">Sin datos disponibles.</div>;

  const today = new Date();
  const getAvg = (arr) => arr.length ? (arr.reduce((a, b) => a + b.value, 0) / arr.length) : 0;

  // 2. CÁLCULOS (ESTO ES LO QUE FALTABA)
  // --- Semanal ---
  const currentWeekData = data.filter(d => isSameWeek(new Date(d.created_at), today, { weekStartsOn: 1 }));
  const weekAvg = getAvg(currentWeekData);
  const startWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endWeek = endOfWeek(today, { weekStartsOn: 1 });
  const daysInterval = eachDayOfInterval({ start: startWeek, end: endWeek });

  const chartWeekData = daysInterval.map(day => {
    const found = data.filter(d => isSameDay(new Date(d.created_at), day)).pop();
    return {
      date: format(day, 'EEE', { locale: es }), 
      value: found ? found.value : null,
      sleep: found ? found.sleep : null,
      steps: found ? found.steps : null,
      originalDate: day
    };
  });

  // --- Mensual (Gráfico) ---
  const chartMonthData = [];
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  for (let i = 3; i >= 0; i--) {
    const mondayOfThatWeek = subWeeks(currentWeekStart, i);
    const weekWeights = data.filter(d => isSameWeek(new Date(d.created_at), mondayOfThatWeek, { weekStartsOn: 1 }));
    const avg = getAvg(weekWeights);
    chartMonthData.push({ date: format(mondayOfThatWeek, 'd MMM', { locale: es }), value: avg > 0 ? parseFloat(avg.toFixed(1)) : null });
  }
  const monthDataRaw = data.filter(d => isAfter(new Date(d.created_at), subMonths(today, 1)));
  const monthAvg = getAvg(monthDataRaw);

  // --- Tabla Mensual ---
  const startMonth = startOfMonth(today);
  const endMonth = endOfMonth(today);
  const weeksInMonth = eachWeekOfInterval({ start: startMonth, end: endMonth }, { weekStartsOn: 1 });
  const tableData = weeksInMonth.map(monday => {
    const sunday = endOfWeek(monday, { weekStartsOn: 1 });
    const currentWeights = data.filter(d => isSameWeek(new Date(d.created_at), monday, { weekStartsOn: 1 }));
    const currentAvg = getAvg(currentWeights);
    const prevMonday = subWeeks(monday, 1);
    const prevWeights = data.filter(d => isSameWeek(new Date(d.created_at), prevMonday, { weekStartsOn: 1 }));
    const prevAvg = getAvg(prevWeights);
    const diff = (currentAvg && prevAvg) ? (currentAvg - prevAvg) : 0;
    const dailyDetails = currentWeights.map(d => ({ dateLabel: format(new Date(d.created_at), 'EEEE d', { locale: es }), val: d.value })).sort((a,b)=>1);
    return { range: `${format(monday, 'd')} - ${format(sunday, 'd MMM', { locale: es })}`, avg: currentAvg > 0 ? currentAvg.toFixed(1) : null, diff: diff, hasPrevData: prevAvg > 0, hasCurrentData: currentAvg > 0, days: dailyDetails };
  });

  // --- Anual ---
  const chartYearData = [];
  for (let i = 11; i >= 0; i--) {
    const targetMonth = subMonths(today, i);
    const monthWeights = data.filter(d => isSameMonth(new Date(d.created_at), targetMonth));
    const avg = getAvg(monthWeights);
    const monthLetter = format(targetMonth, 'MMMM', { locale: es }).charAt(0).toUpperCase();
    chartYearData.push({ date: monthLetter, value: avg > 0 ? parseFloat(avg.toFixed(1)) : null });
  }

  // 3. CONFIGURACIÓN TARJETAS (Ahora sí existen las variables)
  const cardsConfig = {
    weight: (
      <div className="glass-card">
        <div className="card-content">
          <p className="stat-label">Peso (Esta Semana)</p>
          <h3 className="stat-value">{weekAvg ? weekAvg.toFixed(1) : '--'} <span style={{fontSize: '0.9rem', fontWeight: 'normal', color:'#94a3b8'}}>kg</span></h3>
        </div>
        <WeightChart data={chartWeekData} color="#8b5cf6" xPadding={15} />
      </div>
    ),
    sleep: (
      <div className="glass-card">
        <div className="card-content">
          <p className="stat-label color-sleep" style={{ display: 'flex', gap: '5px' }}><Moon size={14}/> Horas de Sueño</p>
        </div>
        <StatsBarChart data={chartWeekData} dataKey="sleep" color="#6366f1" unit="h" />
      </div>
    ),
    steps: (
      <div className="glass-card">
        <div className="card-content">
          <p className="stat-label color-steps" style={{ display: 'flex', gap: '5px' }}><Footprints size={14}/> Pasos Diarios</p>
        </div>
        <StatsBarChart data={chartWeekData} dataKey="steps" color="#10b981" unit="" />
      </div>
    ),
    table: (
      <div className="glass-card" style={{ padding: '20px' }}>
        <p className="stat-label" style={{ marginBottom: '10px' }}>Desglose Mensual</p>
        <table className="glass-table">
          <thead><tr><th style={{width:'45%'}}>Semana</th><th style={{width:'25%'}}>Media</th><th style={{width:'30%'}}>Diff</th></tr></thead>
          <tbody>{tableData.map((row, i) => <WeekRow key={i} row={row} />)}</tbody>
        </table>
      </div>
    ),
    month: (
      <div className="glass-card">
        <div className="card-content">
          <div className="flex-between">
            <div><p className="stat-label">Tendencia Mensual</p><h3 className="stat-value">{monthAvg ? monthAvg.toFixed(1) : '--'} <span style={{fontSize:'0.9rem', fontWeight:'normal', color:'#94a3b8'}}>kg</span></h3></div>
            <Calendar size={20} color="#94a3b8"/>
          </div>
        </div>
        {chartMonthData.length > 0 ? <WeightChart data={chartMonthData} color="#f472b6" xPadding={30} /> : null}
      </div>
    ),
    year: (
      <div className="glass-card">
        <div className="card-content"><p className="stat-label">Último Año</p></div>
        {chartYearData.length > 0 ? <WeightChart data={chartYearData} color="#38bdf8" xPadding={15} /> : null}
      </div>
    )
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(order);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrder(items);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingLeft: '10px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Estadísticas</h2>
        <button onClick={() => setIsReordering(!isReordering)} style={{ background: isReordering ? '#8b5cf6' : 'rgba(255,255,255,0.1)', border: 'none', padding: '8px 12px', borderRadius: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
          {isReordering ? <><Check size={14} /> Listo</> : <><LayoutList size={14} /> Ordenar</>}
        </button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="stats-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {order.map((key, index) => (
                <Draggable key={key} draggableId={key} index={index} isDragDisabled={!isReordering}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} style={{ ...provided.draggableProps.style, marginBottom: '16px', transform: snapshot.isDragging ? provided.draggableProps.style.transform + ' scale(1.02)' : provided.draggableProps.style.transform, opacity: snapshot.isDragging ? 0.9 : 1 }}>
                      <div style={{ position: 'relative' }}>
                        {isReordering && (
                          <div {...provided.dragHandleProps} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '4px' }}>
                            <GripVertical size={20} />
                          </div>
                        )}
                        {cardsConfig[key]}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

// ==========================================
// 5. APP PRINCIPAL
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadProfile();
      checkIfIAmCoach();
      fetchData();
    }
  }, [session]);

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
      const payload = { created_at: formData.date, user_id: session.user.id };
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

  if (!session) return <Login />;

  return (
    <div className="app-container">
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <button onClick={() => setShowProfile(true)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><User size={20} /></button>
      </div>
      {showProfile && (<ProfileModal user={session.user} profile={userProfile} onClose={() => setShowProfile(false)} onUpdateCoach={updateCoach} onLogout={() => supabase.auth.signOut()} clients={myClients} onSelectClient={(id) => { setSelectedClientId(id); setShowProfile(false); }} selectedClientId={selectedClientId} />)}
      {selectedClientId && (<div style={{ background: '#6366f1', padding: '8px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>Viendo a atleta (Modo Lectura)</div>)}
      <main className="main-content">
        {activeTab === 'tracker' ? <TrackerTab onSave={handleSave} isLoading={loading} lastWeight={data[data.length - 1]} /> : <StatsTab data={data} />}
      </main>
      <nav className="floating-menu">
        {!selectedClientId && (<button onClick={() => setActiveTab('tracker')} className={`nav-btn ${activeTab === 'tracker' ? 'active' : ''}`}><Activity size={28} strokeWidth={activeTab === 'tracker' ? 2.5 : 2} /></button>)}
        <button onClick={() => setActiveTab('stats')} className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}><BarChart2 size={28} strokeWidth={activeTab === 'stats' ? 2.5 : 2} /></button>
      </nav>
    </div>
  );
}

export default App;