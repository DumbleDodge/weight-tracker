import React, { useState, useEffect, useMemo } from 'react'; 
import './App.css'; 
import { supabase } from './supabase';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'; 
import { Reorder, motion } from 'framer-motion';

import { 
  Scale, Save, Calendar, ChevronRight, Moon, Footprints, Activity, BarChart2, 
  User, LogOut, Users, Lock, ArrowUpDown, Check,
  Smile, Meh, Frown, Utensils, CheckCircle, XCircle, Sun
} from 'lucide-react';

import { 
  format, isSameWeek, subWeeks, subMonths, subYears, isAfter, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, 
  subDays, startOfDay, endOfDay, isSameMonth,
  startOfMonth, endOfMonth, eachWeekOfInterval 
} from 'date-fns';
import { es } from 'date-fns/locale';

// --- CONFIGURACIÓN DE COLORES DE GRÁFICOS SEGÚN TEMA ---
const CHART_COLORS = {
  light: {
    grid: '#e2e8f0',
    text: '#94a3b8',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e2e8f0',
    tooltipText: '#0f172a',
    primary: '#6366f1'
  },
  dark: {
    grid: '#334155',
    text: '#64748b',
    tooltipBg: '#1e293b',
    tooltipBorder: '#334155',
    tooltipText: '#ffffff',
    primary: '#818cf8'
  }
};

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
      <div className="clean-card" style={{ width: '100%', maxWidth: '350px', padding: '40px' }}>
        <h1 className="title-main" style={{ textAlign: 'center', marginBottom: '8px' }}>Bienvenido</h1>
        <p className="subtitle" style={{ textAlign: 'center' }}>Tu centro de rendimiento</p>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div><label className="stat-label" style={{marginBottom:'8px'}}>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="clean-input" style={{ fontSize: '1rem', textAlign: 'left' }} required /></div>
          <div><label className="stat-label" style={{marginBottom:'8px'}}>Contraseña</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="clean-input" style={{ fontSize: '1rem', textAlign: 'left' }} required /></div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Entrar'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isSignUp ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}<button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>{isSignUp ? 'Inicia Sesión' : 'Regístrate'}</button>
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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="clean-card" style={{ width: '90%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Perfil</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>✕</button>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{user.email.charAt(0).toUpperCase()}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
        </div>

        {clients.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p className="stat-label" style={{ marginBottom: '8px' }}><Users size={14}/> Modo Entrenador</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => onSelectClient(null)} className="clean-input" style={{ fontSize: '0.9rem', textAlign: 'left', padding: '12px', borderColor: !selectedClientId ? 'var(--primary)' : 'transparent', background: !selectedClientId ? 'var(--primary-light)' : 'var(--bg-app)' }}>Mi Perfil</button>
              {clients.map(client => (
                <button key={client.id} onClick={() => onSelectClient(client.id)} className="clean-input" style={{ fontSize: '0.9rem', textAlign: 'left', padding: '12px', borderColor: selectedClientId === client.id ? 'var(--primary)' : 'transparent', background: selectedClientId === client.id ? 'var(--primary-light)' : 'var(--bg-app)' }}>{client.email}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <p className="stat-label" style={{ marginBottom: '8px' }}><Lock size={14}/> Mi Entrenador</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="email" value={coachEmail} onChange={(e) => setCoachEmail(e.target.value)} className="clean-input" placeholder="email@coach.com" style={{ fontSize: '0.9rem', padding: '12px', textAlign: 'left' }} />
            <button onClick={handleUpdate} className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '0 16px' }}>{loading ? '...' : <Check size={18}/>}</button>
          </div>
        </div>

        <button onClick={onLogout} className="btn-primary" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}><LogOut size={18}/> Cerrar Sesión</button>
      </div>
    </div>
  );
};

// ==========================================
// 3. GRÁFICOS Y UTILIDADES
// ==========================================

const CustomTooltip = ({ active, payload, label, unit, theme }) => {
  if (active && payload && payload.length) {
    const formattedLabel = label ? label.charAt(0).toUpperCase() + label.slice(1) : '';
    const styles = CHART_COLORS[theme];
    return (
      <div style={{ backgroundColor: styles.tooltipBg, border: `1px solid ${styles.tooltipBorder}`, borderRadius: '12px', padding: '8px 12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <p style={{ color: styles.tooltipText, fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>
          <span style={{ color: styles.text, marginRight: '6px', fontWeight: 400 }}>{formattedLabel}:</span>
          {payload[0].value} <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{unit}</span>
        </p>
      </div>
    );
  }
  return null;
};

const WeightChart = ({ data, color, xPadding = 15, tickInterval = 0, theme }) => {
  const styles = CHART_COLORS[theme];
  return (
    <div style={{ width: '100%', height: '200px', minWidth: 0, marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs><linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.3}/><stop offset="100%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={styles.grid} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: styles.text, fontSize: 11, fontWeight: 500 }} dy={10} interval={tickInterval} padding={{ left: xPadding, right: xPadding }} />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fill: styles.text, fontSize: 11, fontWeight: 500 }} orientation="right" width={35} tickCount={5} />
          <Tooltip cursor={{ stroke: styles.grid, strokeWidth: 1 }} content={<CustomTooltip unit="kg" theme={theme} />} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#gradient-${color})`} animationDuration={1500} connectNulls={true} dot={{ stroke: styles.tooltipBg, strokeWidth: 2, fill: color, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatsBarChart = ({ data, dataKey, color, unit, ticks, refLines, theme }) => {
  const maxDomain = ticks ? Math.max(...ticks) : 'auto';
  const styles = CHART_COLORS[theme];
  return (
    <div style={{ width: '100%', height: '160px', minWidth: 0, marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={styles.grid} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: styles.text, fontSize: 11, fontWeight: 500 }} dy={10} interval={0} padding={{ left: 10, right: 10 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: styles.text, fontSize: 10, fontWeight: 500 }} orientation="right" width={30} ticks={ticks} domain={[0, maxDomain]} />
          {refLines && refLines.map((line, idx) => (
            <ReferenceLine key={idx} y={line.val} stroke={line.color || styles.text} strokeDasharray="3 3" label={{ position: 'insideTopRight', value: line.label, fill: line.color || styles.text, fontSize: 10, dy: -5 }} />
          ))}
          <Tooltip cursor={{ fill: styles.grid, opacity: 0.3 }} content={<CustomTooltip unit={unit} theme={theme} />} />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} barSize={24} isAnimationActive={true} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const WeekRow = ({ row }) => {
  const [isOpen, setIsOpen] = useState(false);
  const canExpand = row.days && row.days.length > 0;
  return (
    <>
      <tr onClick={() => canExpand && setIsOpen(!isOpen)} className={canExpand ? "row-trigger" : ""} style={{ cursor: canExpand ? 'pointer' : 'default' }}>
        <td style={{ paddingLeft: '8px', textAlign: 'left' }}><div style={{ display: 'flex', alignItems: 'center' }}><ChevronRight size={16} className={`expand-icon ${isOpen ? 'rotated' : ''}`} style={{ opacity: canExpand ? 1 : 0.3 }} /><span style={{ fontSize: '0.85rem' }}>{row.range}</span></div></td>
        <td style={{ fontWeight: '700' }}>{row.hasCurrentData ? `${row.avg} kg` : <span className="text-neutral">-</span>}</td>
        <td>{!row.hasCurrentData || !row.hasPrevData ? <span className="text-neutral">-</span> : <span className={row.diff > 0 ? 'text-red' : row.diff < 0 ? 'text-green' : 'text-neutral'}>{row.diff > 0 ? '+' : ''}{row.diff.toFixed(1)}</span>}</td>
      </tr>
      {isOpen && row.days.map((day, i) => (
        <tr key={i} className="sub-row animate-fade-in" style={{backgroundColor: 'var(--primary-light)'}}>
          <td style={{ paddingLeft: '32px', textAlign: 'left', fontSize:'0.8rem', color: 'var(--text-muted)' }}>
            {day.dateLabel.charAt(0).toUpperCase() + day.dateLabel.slice(1)}
          </td>
          <td style={{ color: 'var(--text-main)', fontSize:'0.8rem' }}>
            {day.val ? `${day.val} kg` : '-'}
          </td>
          <td>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
              {day.diet && <div style={{width:'6px', height:'6px', borderRadius:'50%', background:'#10b981'}}></div>}
              {day.sleep && <div style={{width:'6px', height:'6px', borderRadius:'50%', background:'#6366f1'}}></div>}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

// ==========================================
// 4. PESTAÑAS (TRACKER & STATS)
// ==========================================

const TrackerTab = ({ onSave, isLoading, lastWeight }) => {
  const [weight, setWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [sleepMinutes, setSleepMinutes] = useState('');
  const [steps, setSteps] = useState('');
  const [sleepQuality, setSleepQuality] = useState(''); 
  const [dietCompliance, setDietCompliance] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight && !sleepHours && !steps && dietCompliance === null) return;
    
    let totalSleep = null;
    if (sleepHours || sleepMinutes) {
      const h = parseFloat(sleepHours) || 0;
      const m = parseFloat(sleepMinutes) || 0;
      totalSleep = h + (m / 60);
    }

    onSave({ weight, sleep: totalSleep, steps, date, sleepQuality, dietCompliance });
    setWeight(''); setSleepHours(''); setSleepMinutes(''); setSteps('');
    setSleepQuality(''); setDietCompliance(null);
  };

  const QualityBtn = ({ type, icon: Icon, activeColor, label }) => (
    <button 
      type="button"
      onClick={() => setSleepQuality(type === sleepQuality ? '' : type)}
      className="clean-input"
      style={{
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'12px', fontSize:'0.8rem',
        borderColor: sleepQuality === type ? activeColor : 'transparent',
        backgroundColor: sleepQuality === type ? 'var(--bg-card)' : 'var(--bg-app)',
        boxShadow: sleepQuality === type ? `0 0 0 2px ${activeColor}` : 'none',
        color: sleepQuality === type ? 'var(--text-main)' : 'var(--text-muted)'
      }}
    >
      <Icon size={24} color={sleepQuality === type ? activeColor : 'currentColor'} />
      <span style={{ marginTop: '4px' }}>{label}</span>
    </button>
  );

  const formatLastRecord = (w) => {
    if (!w) return null;
    const parts = [];
    if (w.value) parts.push(`${w.value} kg`);
    if (w.sleep) {
      const h = Math.floor(w.sleep);
      const m = Math.round((w.sleep - h) * 60);
      parts.push(`${h}h ${m > 0 ? m + 'm' : ''} sueño`);
    }
    return parts.join(' • ');
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      <header className="header-row">
        <div>
          <h1 className="title-main">Registro Diario</h1>
          <p className="subtitle">¿Cómo ha ido hoy?</p>
        </div>
        <div style={{ position: 'relative' }}>
           <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="date-selector" />
        </div>
      </header>

      {/* PESO */}
      <div className="clean-card">
        <div className="card-header">
          <span className="stat-label"><Scale size={14}/> Peso Corporal</span>
        </div>
        <div style={{position: 'relative'}}>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="clean-input" placeholder="--" style={{ fontSize: '3.5rem' }} />
          <span style={{position:'absolute', right:'20px', bottom:'24px', color:'var(--text-muted)', fontWeight:'600'}}>kg</span>
        </div>
      </div>

      <div className="input-grid">
          {/* PASOS */}
          <div className="clean-card" style={{ marginBottom: 0 }}>
            <div className="card-header"><span className="stat-label"><Footprints size={14}/> Pasos</span></div>
            <input type="number" value={steps} onChange={(e) => setSteps(e.target.value)} className="clean-input" placeholder="-" />
          </div>

          {/* SUEÑO */}
          <div className="clean-card" style={{ marginBottom: 0 }}>
            <div className="card-header"><span className="stat-label"><Moon size={14}/> Sueño</span></div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <div style={{ flex: 1, position:'relative' }}>
                <input type="number" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} className="clean-input" placeholder="h" style={{textAlign:'center', padding:'16px 4px'}} />
              </div>
              <div style={{ flex: 1, position:'relative' }}>
                <input type="number" value={sleepMinutes} onChange={(e) => setSleepMinutes(e.target.value)} className="clean-input" placeholder="min" style={{textAlign:'center', padding:'16px 4px'}} />
              </div>
            </div>
          </div>
      </div>

      {/* CALIDAD */}
      <div className="clean-card" style={{ marginTop: '16px' }}>
        <div className="card-header"><span className="stat-label">Descanso</span></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <QualityBtn type="bad" icon={Frown} activeColor="#ef4444" label="Mal" />
          <QualityBtn type="avg" icon={Meh} activeColor="#eab308" label="Regular" />
          <QualityBtn type="good" icon={Smile} activeColor="#10b981" label="Bien" />
        </div>
      </div>

      {/* DIETA */}
      <div className="clean-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#10b981', padding: '8px', borderRadius: '10px', color: 'white' }}><Utensils size={18}/></div>
          <span style={{ fontWeight: '600', fontSize:'0.95rem' }}>¿Dieta cumplida?</span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
           <button onClick={() => setDietCompliance(false)} style={{ background: dietCompliance === false ? '#fecaca' : 'var(--bg-app)', color: dietCompliance === false ? '#ef4444' : 'var(--text-muted)', border: 'none', borderRadius: '12px', padding: '10px', cursor:'pointer' }}><XCircle size={28} /></button>
           <button onClick={() => setDietCompliance(true)} style={{ background: dietCompliance === true ? '#d1fae5' : 'var(--bg-app)', color: dietCompliance === true ? '#10b981' : 'var(--text-muted)', border: 'none', borderRadius: '12px', padding: '10px', cursor:'pointer' }}><CheckCircle size={28} /></button>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={isLoading} className="btn-primary">{isLoading ? 'Guardando...' : <><Save size={20} /> Guardar Registro</>}</button>
      
      {lastWeight && (<p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '24px' }}>Último: {formatLastRecord(lastWeight)} ({format(new Date(lastWeight.created_at), "d MMM", { locale: es })})</p>)}
    </div>
  );
};
// --- COMPONENTE DE CARGA (SKELETON) ---
const StatsSkeleton = () => (
  <div className="animate-fade-in" style={{ paddingBottom: '120px' }}>
    <div style={{ display: 'flex', alignItems: 'end', gap: '12px', marginBottom: '20px', paddingLeft: '10px', marginTop: '60px' }}>
      <div style={{ height: '32px', width: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} className="animate-pulse"></div>
    </div>

    {/* Simulamos 3 tarjetas cargando */}
    {[1, 2, 3].map((i) => (
      <div key={i} className="clean-card" style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)', animation: 'pulse 1.5s infinite' }}></div>
      </div>
    ))}
    
    <style>{`
      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
      .animate-pulse { animation: pulse 1.5s infinite ease-in-out; }
    `}</style>
  </div>
);
// --- PESTAÑA DE ESTADÍSTICAS OPTIMIZADA ---
// --- PESTAÑA DE ESTADÍSTICAS OPTIMIZADA (SIN LAG) ---
const StatsTab = ({ data, theme }) => {
  // Estado para controlar si ya podemos pintar lo pesado
  const [isReady, setIsReady] = useState(false);
  
  const [isReordering, setIsReordering] = useState(false);
  const defaultOrder = ['weight', 'sleep', 'steps', 'table', 'month', 'year'];
  const [order, setOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('statsOrder');
      return saved ? JSON.parse(saved) : defaultOrder;
    } catch { return defaultOrder; }
  });

  useEffect(() => { localStorage.setItem('statsOrder', JSON.stringify(order)); }, [order]);

  // --- TRUCO PARA EL LAG ---
  // Al montar el componente, esperamos un "tick" (0ms o 50ms) antes de pintar lo pesado.
  // Esto permite que el navegador cambie de pestaña visualmente PRIMERO.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 10); // 10ms es suficiente para engañar al ojo
    return () => clearTimeout(timer);
  }, []);

  // 1. CÁLCULOS (Memorizados)
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const today = new Date();
    const getAvg = (arr) => arr.length ? (arr.reduce((a, b) => a + (b.value || 0), 0) / arr.length) : 0;
    const dataWithWeight = data.filter(d => d.value !== null);

    const currentWeekData = dataWithWeight.filter(d => isSameWeek(new Date(d.created_at), today, { weekStartsOn: 1 }));
    const weekAvg = getAvg(currentWeekData);
    
    const startWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endWeek = endOfWeek(today, { weekStartsOn: 1 });
    const daysInterval = eachDayOfInterval({ start: startWeek, end: endWeek });

    const chartWeekData = daysInterval.map(day => {
      const found = data.filter(d => isSameDay(new Date(d.created_at), day)).pop();
      const sleepDisplay = found?.sleep ? `${Math.floor(found.sleep)}h ${Math.round((found.sleep % 1)*60)}m` : null;
      return {
        date: format(day, 'EEE', { locale: es }), 
        value: found ? found.value : null,
        sleep: found ? found.sleep : null,
        sleepDisplay,
        steps: found ? found.steps : null,
        originalDate: day
      };
    });

    const chartMonthData = [];
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    for (let i = 12; i >= 0; i--) {
      const mondayOfThatWeek = subWeeks(currentWeekStart, i);
      const weekWeights = dataWithWeight.filter(d => isSameWeek(new Date(d.created_at), mondayOfThatWeek, { weekStartsOn: 1 }));
      const avg = getAvg(weekWeights);
      chartMonthData.push({ date: format(mondayOfThatWeek, 'd MMM', { locale: es }), value: avg > 0 ? parseFloat(avg.toFixed(1)) : null });
    }
    const monthDataRaw = dataWithWeight.filter(d => isAfter(new Date(d.created_at), subMonths(today, 3)));
    const monthAvg = getAvg(monthDataRaw);

    const startMonth = startOfMonth(today);
    const endMonth = endOfMonth(today);
    const weeksInMonth = eachWeekOfInterval({ start: startMonth, end: endMonth }, { weekStartsOn: 1 });
    const tableData = weeksInMonth.map(monday => {
      const sunday = endOfWeek(monday, { weekStartsOn: 1 });
      const currentWeights = dataWithWeight.filter(d => isSameWeek(new Date(d.created_at), monday, { weekStartsOn: 1 }));
      const currentAvg = getAvg(currentWeights);
      const prevMonday = subWeeks(monday, 1);
      const prevWeights = dataWithWeight.filter(d => isSameWeek(new Date(d.created_at), prevMonday, { weekStartsOn: 1 }));
      const prevAvg = getAvg(prevWeights);
      const diff = (currentAvg && prevAvg) ? (currentAvg - prevAvg) : 0;
      
      const weekAllData = data.filter(d => isSameWeek(new Date(d.created_at), monday, { weekStartsOn: 1 }));
      const dailyDetails = weekAllData.map(d => ({ 
          dateLabel: format(new Date(d.created_at), 'EEEE d', { locale: es }), 
          val: d.value,
          diet: d.diet_compliance, 
          sleep: d.sleep_quality
      })).sort((a,b)=>1);

      return { range: `${format(monday, 'd')} - ${format(sunday, 'd MMM', { locale: es })}`, avg: currentAvg > 0 ? currentAvg.toFixed(1) : null, diff: diff, hasPrevData: prevAvg > 0, hasCurrentData: currentAvg > 0, days: dailyDetails };
    });

    const chartYearData = [];
    for (let i = 11; i >= 0; i--) {
      const targetMonth = subMonths(today, i);
      const monthWeights = dataWithWeight.filter(d => isSameMonth(new Date(d.created_at), targetMonth));
      const avg = getAvg(monthWeights);
      const monthLetter = format(targetMonth, 'MMMM', { locale: es }).charAt(0).toUpperCase();
      chartYearData.push({ date: monthLetter, value: avg > 0 ? parseFloat(avg.toFixed(1)) : null });
    }

    return { weekAvg, chartWeekData, monthAvg, chartMonthData, tableData, chartYearData };
  }, [data]);

  // --- RENDERIZADO CONDICIONAL ---
  // Si no hay datos, mensaje.
  if (!data || data.length === 0) return <div className="p-10 text-center text-neutral">Sin datos disponibles.</div>;
  
  // SI AÚN NO ESTAMOS LISTOS, MOSTRAMOS ESQUELETO
  if (!isReady || !stats) {
    return <StatsSkeleton />;
  }

  // --- SI ESTAMOS LISTOS, PINTAMOS LO PESADO ---
  const { weekAvg, chartWeekData, monthAvg, chartMonthData, tableData, chartYearData } = stats;

  const cardsConfig = {
    weight: (
      <div className="clean-card" style={{ pointerEvents: isReordering ? 'none' : 'auto' }}>
        <div className="card-header"><span className="stat-label">Peso (Esta Semana)</span></div>
        <h3 className="stat-value" style={{marginBottom:'16px'}}>{weekAvg ? weekAvg.toFixed(1) : '--'} <span className="stat-unit">kg</span></h3>
        <WeightChart data={chartWeekData} color="var(--primary)" xPadding={15} theme={theme} />
      </div>
    ),
    sleep: (
      <div className="clean-card" style={{ pointerEvents: isReordering ? 'none' : 'auto' }}>
        <div className="card-header"><span className="stat-label"><Moon size={14}/> Horas Sueño</span></div>
        <StatsBarChart 
          data={chartWeekData} dataKey="sleep" color="#6366f1" unit="h" theme={theme}
          refLines={[{ val: 7, label: '7h', color: '#10b981' }, { val: 8, label: '8h', color: '#10b981' }]}
        />
      </div>
    ),
    steps: (
      <div className="clean-card" style={{ pointerEvents: isReordering ? 'none' : 'auto' }}>
        <div className="card-header"><span className="stat-label"><Footprints size={14}/> Pasos</span></div>
        <StatsBarChart 
          data={chartWeekData} dataKey="steps" color="#10b981" unit="" theme={theme}
          ticks={[0, 2000, 4000, 6000, 8000, 10000]} 
        />
      </div>
    ),
    table: (
      <div className="clean-card" style={{ padding: '20px', pointerEvents: isReordering ? 'none' : 'auto' }}>
        <p className="stat-label" style={{ marginBottom: '16px' }}>Desglose Mensual</p>
        <table className="clean-table">
          <thead><tr><th style={{width:'45%', textAlign:'left', paddingLeft:'12px'}}>Semana</th><th style={{width:'25%'}}>Media</th><th style={{width:'30%'}}>Diff</th></tr></thead>
          <tbody>{tableData.map((row, i) => <WeekRow key={i} row={row} />)}</tbody>
        </table>
      </div>
    ),
    month: (
      <div className="clean-card" style={{ pointerEvents: isReordering ? 'none' : 'auto' }}>
        <div className="card-header"><span className="stat-label">Tendencia (3 Meses)</span></div>
        <h3 className="stat-value" style={{marginBottom:'16px'}}>{monthAvg ? monthAvg.toFixed(1) : '--'} <span className="stat-unit">kg</span></h3>
        <WeightChart data={chartMonthData} color="#f472b6" xPadding={30} tickInterval="preserveStartEnd" theme={theme} />
      </div>
    ),
    year: (
      <div className="clean-card" style={{ pointerEvents: isReordering ? 'none' : 'auto' }}>
        <div className="card-header"><span className="stat-label">Último Año</span></div>
        <WeightChart data={chartYearData} color="#38bdf8" xPadding={15} theme={theme} />
      </div>
    )
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '120px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingLeft: '10px', paddingRight: '10px', marginTop: '60px' }}>
        <h2 className="title-main" style={{ fontSize: '1.5rem', margin: 0 }}>Estadísticas</h2>
        <button onClick={() => setIsReordering(!isReordering)} style={{ background: isReordering ? 'var(--primary)' : 'transparent', border: isReordering ? 'none' : '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '20px', color: isReordering ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600 }}>
          {isReordering ? <><Check size={14} /> Listo</> : <><ArrowUpDown size={14} /> Ordenar</>}
        </button>
      </div>

      <Reorder.Group axis="y" values={order} onReorder={setOrder} style={{ padding: 0 }}>
        {order.map((key) => (
          <Reorder.Item key={key} value={key} style={{ listStyle: 'none', marginBottom: '16px' }} dragListener={isReordering} whileDrag={{ scale: 1.02, zIndex: 100 }}>
            <motion.div animate={{ scale: isReordering ? 0.98 : 1 }} style={{ border: isReordering ? '2px dashed var(--primary)' : '1px solid transparent', borderRadius: '24px', overflow: 'hidden' }}>
              {cardsConfig[key]}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
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
  
  // THEME STATE
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

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

  if (!session) return <Login />;

  return (
    <div className="app-container">
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100, display: 'flex', gap: '12px' }}>
        <button onClick={toggleTheme} className="btn-icon">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button onClick={() => setShowProfile(true)} className="btn-icon">
          <User size={20} />
        </button>
      </div>

      {showProfile && (<ProfileModal user={session.user} profile={userProfile} onClose={() => setShowProfile(false)} onUpdateCoach={updateCoach} onLogout={() => supabase.auth.signOut()} clients={myClients} onSelectClient={(id) => { setSelectedClientId(id); setShowProfile(false); }} selectedClientId={selectedClientId} />)}
      
      {selectedClientId && (<div style={{ background: 'var(--primary)', color:'white', padding: '8px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>Viendo a atleta (Modo Lectura)</div>)}
      
      <main className="main-content">
        {activeTab === 'tracker' ? <TrackerTab onSave={handleSave} isLoading={loading} lastWeight={data[data.length - 1]} /> : <StatsTab data={data} theme={theme} />}
      </main>
      
      {/* NAVEGACIÓN COMPACTA (SOLO ICONOS) */}
      <nav className="nav-island">
        {!selectedClientId && (
          <button 
            onClick={() => setActiveTab('tracker')} 
            className={`nav-item ${activeTab === 'tracker' ? 'active' : ''}`}
            aria-label="Registro"
          >
            <div className="nav-icon-box">
              {/* Icono un poco más grande (22) para llenar bien el botón */}
              <Activity size={22} strokeWidth={activeTab === 'tracker' ? 2.5 : 2} />
            </div>
          </button>
        )}

        <button 
          onClick={() => setActiveTab('stats')} 
          className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
          aria-label="Estadísticas"
        >
          <div className="nav-icon-box">
            <BarChart2 size={22} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
          </div>
        </button>
      </nav>
    </div>
  );
}

export default App;