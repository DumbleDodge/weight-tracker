import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Reorder, motion } from 'framer-motion';
import { Moon, Footprints, ArrowUpDown, Check, ChevronRight, ChevronLeft,Scale, Activity } from 'lucide-react'; // <--- CAMBIO: Importamos ChevronLeft
import { format, isSameWeek, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks,subWeeks, isAfter, subMonths, startOfMonth, endOfMonth, eachWeekOfInterval, isSameMonth, addMonths  } from 'date-fns'; // <--- CAMBIO: Importamos addMonths
import { es } from 'date-fns/locale';

import { Card } from '../ui/Card';
import StatsSkeleton from './StatsSkeleton';
import { CustomTooltip } from '../charts/CustomTooltip';

// ... (El componente ChartArea se mantiene IGUAL, no lo toques) ...
const ChartArea = ({ data, color, xPadding = 15, gradientId }) => (
  <div className="h-[200px] w-full mt-4 -ml-2">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} dy={10} padding={{ left: xPadding, right: xPadding }} />
        <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} orientation="right" width={35} tickCount={5} />
        <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} content={<CustomTooltip unit="kg" />} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fill={`url(#${gradientId})`} dot={{ stroke: 'var(--color-surface)', strokeWidth: 2, fill: color, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} animationDuration={1500} connectNulls />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// ... (El componente WeekRow se mantiene IGUAL) ...
const WeekRow = ({ row }) => {
  const [isOpen, setIsOpen] = useState(false);
  const canExpand = row.days && row.days.length > 0;
  const isCurrentWeek = isSameWeek(new Date(), row.startDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const dayDate = new Date(row.startDate);
    dayDate.setDate(row.startDate.getDate() + i);
    return dayDate;
  });

  const getDataForDay = (date) => row.days.find(d => isSameDay(d.date, date));

  const headerIcon = "flex items-center justify-center text-slate-400 py-2";
  const cellStyle = "flex items-center justify-center text-xs py-3 border-b border-slate-100 dark:border-slate-800";

  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-0 transition-all">
      
      {/* 1. FILA RESUMEN */}
      {/* CAMBIO: Añadido 'px-5' para que el texto no se pegue demasiado al borde ahora que la tarjeta no tiene padding */}
      <div 
        onClick={() => canExpand && setIsOpen(!isOpen)} 
        className={`
          grid grid-cols-[1.5fr_1fr_0.8fr] py-4 px-5 items-center transition-colors
          ${canExpand ? 'cursor-pointer' : ''}
          ${isCurrentWeek 
            ? 'bg-primary/10 dark:bg-primary/20' 
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }
        `}
      >
        <div className={`flex items-center gap-2 text-sm font-medium ${isCurrentWeek ? 'text-primary font-bold' : 'text-slate-500'}`}>
          <ChevronRight size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} style={{ opacity: canExpand ? 1 : 0 }} />
          {row.range}
        </div>
        <div className={`text-center font-bold ${isCurrentWeek ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
          {row.hasCurrentData ? `${row.avg} kg` : <span className="text-slate-300">-</span>}
        </div>
        <div className={`text-right font-bold text-sm ${row.diff > 0 ? 'text-red-500' : row.diff < 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
          {(!row.hasCurrentData || !row.hasPrevData) ? '-' : `${row.diff > 0 ? '+' : ''}${row.diff.toFixed(1)}`}
        </div>
      </div>
      
      {/* 2. VISTA EXPANDIDA */}
      {isOpen && (
        // CAMBIO: Reducido padding (p-2) para maximizar ancho en móvil
        <div className={`p-2 sm:p-4 ${isCurrentWeek ? 'bg-primary/5' : 'bg-slate-50/50 dark:bg-slate-900/30'}`}>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            
            <div className="grid grid-cols-[1.1fr_0.8fr_1.2fr_1.2fr_0.7fr] bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
               <div className="py-2 pl-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">Día</div>
               <div className={headerIcon} title="Peso"><Scale size={14} className="text-orange-500"/></div>
               <div className={headerIcon} title="Pasos"><Footprints size={14} className="text-emerald-500"/></div>
               <div className={headerIcon} title="Sueño"><Moon size={14} className="text-indigo-500"/></div>
               <div className={headerIcon} title="Calidad"><Activity size={14} className="text-purple-500"/></div>
            </div>

            {weekDays.map((date, i) => {
               const d = getDataForDay(date);
               const isToday = isSameDay(date, new Date());
               const q = parseInt(d?.sleepQuality || 0);
               const qualityColor = q >= 4 ? 'text-emerald-500' : q === 3 ? 'text-yellow-500' : 'text-red-500';

               let sleepFormatted = '-';
               if (d?.sleepDuration) {
                   const hours = Math.floor(d.sleepDuration);
                   const minutes = Math.round((d.sleepDuration - hours) * 60);
                   sleepFormatted = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
               }

               return (
                 <div key={i} className={`grid grid-cols-[1.1fr_0.8fr_1.2fr_1.2fr_0.7fr] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isToday ? 'bg-primary/10' : ''}`}>
                    <div className="flex flex-col justify-center pl-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <span className={`text-xs font-bold leading-none mb-1 ${isToday ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                            {format(date, 'EEEE', { locale: es }).charAt(0).toUpperCase() + format(date, 'EEEE', { locale: es }).slice(1, 3)}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">{format(date, 'd MMM', { locale: es })}</span>
                    </div>
                    <div className={`${cellStyle} font-bold text-slate-900 dark:text-white`}>
                        {d?.val ? d.val : <span className="text-slate-200">-</span>}
                    </div>
                    <div className={`${cellStyle} font-medium text-emerald-600`}>
                        {d?.steps ? d.steps.toLocaleString('es-ES') : <span className="text-slate-200">-</span>}
                    </div>
                    <div className={`${cellStyle} font-medium text-indigo-500`}>
                        {sleepFormatted !== '-' ? sleepFormatted : <span className="text-slate-200">-</span>}
                    </div>
                    <div className={`${cellStyle} font-bold`}>
                        {d?.sleepQuality ? <span className={qualityColor}>{d.sleepQuality}</span> : <span className="text-slate-200">-</span>}
                    </div>
                 </div>
               );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const StatsTab = ({ data }) => {
  const [isReady, setIsReady] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  
  const [tableDate, setTableDate] = useState(new Date()); 
  const [chartDate, setChartDate] = useState(new Date()); // <--- CAMBIO: Nuevo estado para la gráfica

  const [order, setOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem('statsOrder')) || ['weight', 'sleep', 'steps', 'table', 'month', 'year']; } 
    catch { return ['weight', 'sleep', 'steps', 'table', 'month', 'year']; }
  });

  useEffect(() => { localStorage.setItem('statsOrder', JSON.stringify(order)); }, [order]);
  useEffect(() => { setTimeout(() => setIsReady(true), 50); }, []);

  // Handlers Navegación Tabla
  const prevMonth = () => setTableDate(prev => subMonths(prev, 1));
  const nextMonth = () => setTableDate(prev => addMonths(prev, 1));

  // Handlers Navegación Gráfica Peso (CAMBIO)
  const prevWeek = () => setChartDate(prev => subWeeks(prev, 1));
  const nextWeek = () => setChartDate(prev => addWeeks(prev, 1));

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const today = new Date();
    const getAvg = (arr) => arr.length ? (arr.reduce((a, b) => a + (b.value || 0), 0) / arr.length) : 0;
    const dataWithWeight = data.filter(d => d.value !== null);

    // 1. MEDIA SEMANAL Y GRÁFICA (CAMBIO: Usamos 'chartDate' en lugar de 'today')
    // Esto afecta al número grande (Media) y a la curvita (Gráfica)
    const startWeekChart = startOfWeek(chartDate, { weekStartsOn: 1 });
    const endWeekChart = endOfWeek(chartDate, { weekStartsOn: 1 });
    
    // Filtramos los datos de ESA semana seleccionada
    const currentWeekData = dataWithWeight.filter(d => isSameWeek(new Date(d.created_at), chartDate, { weekStartsOn: 1 }));
    const weekAvg = getAvg(currentWeekData);
    
    const daysInterval = eachDayOfInterval({ start: startWeekChart, end: endWeekChart });

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

    // 2. TENDENCIA 3 MESES (Esto lo dejamos con 'today' para ver siempre la tendencia actual)
    const chartMonthData = [];
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    for (let i = 12; i >= 0; i--) {
      const mondayOfThatWeek = subWeeks(currentWeekStart, i);
      const weekWeights = dataWithWeight.filter(d => isSameWeek(new Date(d.created_at), mondayOfThatWeek, { weekStartsOn: 1 }));
      const avg = getAvg(weekWeights);
      chartMonthData.push({ 
        date: format(mondayOfThatWeek, 'd MMM', { locale: es }), 
        value: avg > 0 ? parseFloat(avg.toFixed(1)) : null 
      });
    }
    const monthDataRaw = dataWithWeight.filter(d => isAfter(new Date(d.created_at), subMonths(today, 3)));
    const monthAvg = getAvg(monthDataRaw);

    // 3. DATOS TABLA (Usa 'tableDate')
    const startMonth = startOfMonth(tableDate);
    const endMonth = endOfMonth(tableDate);
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
          date: new Date(d.created_at),
          val: d.value,
          steps: d.steps,
          sleepDuration: d.sleep,
          sleepQuality: d.sleep_quality,
          diet: d.diet_compliance
      }));

      return { 
        startDate: monday,
        range: `${format(monday, 'd')} - ${format(sunday, 'd MMM', { locale: es })}`, 
        avg: currentAvg > 0 ? currentAvg.toFixed(1) : null, 
        diff: diff, 
        hasPrevData: prevAvg > 0, 
        hasCurrentData: currentAvg > 0, 
        days: dailyDetails 
      };
    });

    // 4. ANUAL (Usa 'today')
    const chartYearData = [];
    for (let i = 11; i >= 0; i--) {
      const targetMonth = subMonths(today, i);
      const monthWeights = dataWithWeight.filter(d => isSameMonth(new Date(d.created_at), targetMonth));
      const avg = getAvg(monthWeights);
      const monthLetter = format(targetMonth, 'MMMM', { locale: es }).charAt(0).toUpperCase();
      chartYearData.push({ date: monthLetter, value: avg > 0 ? parseFloat(avg.toFixed(1)) : null });
    }

    return { weekAvg, chartWeekData, monthAvg, chartMonthData, tableData, chartYearData, startWeekChart, endWeekChart };
  }, [data, tableDate, chartDate]); // <--- CAMBIO: Añadimos chartDate a dependencias

  if (!data?.length) return <div className="p-10 text-center text-slate-400">Sin datos disponibles.</div>;
  if (!isReady || !stats) return <StatsSkeleton />;

  const { weekAvg, chartWeekData, monthAvg, chartMonthData, tableData, chartYearData, startWeekChart, endWeekChart } = stats;

  const cardsConfig = {
    weight: (
      <Card className="pointer-events-auto">
        {/* CAMBIO: Cabecera con navegación */}
        <div className="flex justify-between items-center mb-1">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peso Semanal</span>
                <span className="text-[10px] text-slate-400 font-medium">
                   {format(startWeekChart, 'd MMM', {locale: es})} - {format(endWeekChart, 'd MMM', {locale: es})}
                </span>
            </div>
            
            {/* Flechas Navegación */}
            <div className="flex gap-1">
                <button onClick={prevWeek} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={nextWeek} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                  <ChevronRight size={18} />
                </button>
            </div>
        </div>

        <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {weekAvg ? weekAvg.toFixed(1) : '--'} <span className="text-xl text-slate-400 font-semibold">kg</span>
        </h3>
        
        <ChartArea data={chartWeekData} color="var(--color-primary)" gradientId="weight-gradient" />
      </Card>
    ),
    // ... RESTO DE TARJETAS (steps, sleep, table, month, year) IGUAL QUE ANTES ...
    steps: (
        <Card className="pointer-events-auto">
          <div className="flex items-center gap-2 mb-4 text-emerald-500 font-bold text-xs uppercase tracking-wider"><Footprints size={14}/> Pasos</div>
          <div className="h-[160px] w-full mt-2 -ml-2">
            <ResponsiveContainer>
                <BarChart data={chartWeekData} margin={{top:5, bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:11}} dy={10}/>
                    <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} width={35} ticks={[0, 2000, 4000, 6000, 8000, 10000]} domain={[0, dataMax => Math.max(dataMax, 10000)]} />
                    <Tooltip cursor={{fill:'transparent'}} content={<CustomTooltip unit=""/>} />
                    <Bar dataKey="steps" fill="#10b981" radius={[6,6,0,0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
    ),
    sleep: (
        <Card className="pointer-events-auto">
          <div className="flex items-center gap-2 mb-4 text-indigo-500 font-bold text-xs uppercase tracking-wider"><Moon size={14}/> Horas Sueño</div>
          <div className="h-[160px] w-full mt-2 -ml-2">
            <ResponsiveContainer>
                <BarChart data={chartWeekData} margin={{top:5, bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:11}} dy={10}/>
                    <Tooltip cursor={{fill:'transparent'}} content={<CustomTooltip unit="h"/>} />
                    <ReferenceLine y={7} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: '7h', fill: '#10b981', fontSize: 10, dy: -5 }} />
                    <ReferenceLine y={8} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: '8h', fill: '#10b981', fontSize: 10, dy: -5 }} />
                    <Bar dataKey="sleep" fill="#6366f1" radius={[6,6,0,0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
    ),
    // ... La de TABLE ya la tenías actualizada en pasos anteriores ...
    table: (
      <Card className="pointer-events-auto p-0 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Desglose {format(tableDate, 'MMMM yyyy', { locale: es })}
            </span>
            <div className="flex gap-1">
                <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><ChevronLeft size={18} /></button>
                <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><ChevronRight size={18} /></button>
            </div>
        </div>
        <div className="w-full bg-white dark:bg-slate-900">
            <div>
               {tableData.length > 0 ? (
                 tableData.map((row, i) => <WeekRow key={i} row={row} />)
               ) : (
                 <div className="py-8 text-center text-xs text-slate-400 font-medium">Sin datos registrados en este mes</div>
               )}
            </div>
        </div>
      </Card>
    ),
    month: (
        <Card className="pointer-events-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tendencia (3 Meses)</span>
            <h3 className="text-3xl font-bold mt-1 mb-2">{monthAvg?.toFixed(1)} <span className="text-lg text-slate-400">kg</span></h3>
            <ChartArea data={chartMonthData} color="#f472b6" xPadding={30} gradientId="month-gradient" />
        </Card>
    ),
    year: (
        <Card className="pointer-events-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Último Año</span>
            <ChartArea data={chartYearData} color="#38bdf8" xPadding={15} gradientId="year-gradient" />
        </Card>
    )
  };
  
  // ... resto del componente ...
  return (
    // ... tu JSX de return existente ...
    <div className="pb-32 pt-10 px-0 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Estadísticas</h2>
        <button 
            onClick={() => setIsReordering(!isReordering)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isReordering ? 'bg-primary text-white ring-2 ring-primary/30' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500'}`}
        >
            {isReordering ? <><Check size={14} /> Listo</> : <><ArrowUpDown size={14} /> Ordenar</>}
        </button>
      </div>

      <Reorder.Group axis="y" values={order} onReorder={setOrder} className="space-y-4">
        {order.map((key) => (
          <Reorder.Item key={key} value={key} dragListener={isReordering} style={{listStyle:'none'}}>
            <motion.div 
                animate={{ scale: isReordering ? 0.98 : 1 }} 
                className={`transition-all ${isReordering ? 'cursor-grab active:cursor-grabbing ring-2 ring-dashed ring-primary/50 rounded-3xl opacity-80' : ''}`}
            >
              {cardsConfig[key]}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default StatsTab;

