import React, { useState } from 'react';
import { Scale, Footprints, Moon, Activity, Utensils, Save, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar } from 'lucide-react';

const TrackerTab = ({ onSave, isLoading, lastWeight }) => {
  const [weight, setWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [sleepMinutes, setSleepMinutes] = useState('');
  const [steps, setSteps] = useState('');
  const [sleepQuality, setSleepQuality] = useState(null);
  const [dietCompliance, setDietCompliance] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    // ...misma lógica de antes...
    let totalSleep = null;
    if (sleepHours || sleepMinutes) {
      totalSleep = (parseFloat(sleepHours) || 0) + (parseFloat(sleepMinutes) || 0) / 60;
    }
    onSave({ weight, sleep: totalSleep, steps, date, sleepQuality: sleepQuality ? String(sleepQuality) : null, dietCompliance });
    setWeight(''); setSleepHours(''); setSleepMinutes(''); setSteps(''); setSleepQuality(null); setDietCompliance(null);
  };

  // Helper para colores de botones de calidad (1-5)
  const getQualityColor = (val) => {
    if (val <= 2) return "bg-red-500 border-red-500 text-white";
    if (val === 3) return "bg-yellow-500 border-yellow-500 text-white";
    return "bg-emerald-500 border-emerald-500 text-white";
  };

  return (
    <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <header className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
        
        {/* Título Principal */}
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Daily Check-in
        </h1>

        {/* Selector de Fecha Estilizado */}
        <div className="relative group">
          {/* Icono decorativo */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none z-10">
            <Calendar size={18} />
          </div>
          
          {/* Input de fecha "camuflado" como botón */}
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="
              relative appearance-none
              pl-12 pr-6 py-3
              bg-white dark:bg-slate-900 
              border border-slate-200 dark:border-slate-700
              rounded-full 
              text-sm font-bold text-slate-600 dark:text-slate-300
              shadow-sm hover:shadow-md hover:border-primary/50
              focus:outline-none focus:ring-2 focus:ring-primary/20
              cursor-pointer transition-all duration-300
              uppercase tracking-wider
              dark:[color-scheme:dark] 
            "
          />
        </div>
      </header>

      {/* 1. PESO (Destacado) */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 text-orange-500 font-bold uppercase text-xs tracking-wider mb-2">
            <Scale size={16} /> Peso Corporal
        </div>
        <div className="relative">
          <input 
            type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} 
            className="w-full bg-slate-50 dark:bg-slate-950 border-0 rounded-2xl py-6 text-center text-6xl font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20"
            placeholder="--"
          />
          <span className="absolute right-6 bottom-8 text-slate-400 font-bold text-xl">kg</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-4">
          {/* 2. PASOS */}
          <Card className="p-5">
            <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase text-xs tracking-wider mb-2">
                <Footprints size={16} /> Pasos
            </div>
            <input 
                type="number" value={steps} onChange={(e) => setSteps(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-950 border-0 rounded-xl py-3 text-center text-2xl font-bold outline-none"
                placeholder="-"
            />
          </Card>

          {/* 3. SUEÑO */}
          <Card className="p-5">
            <div className="flex items-center gap-2 text-blue-500 font-bold uppercase text-xs tracking-wider mb-2">
                <Moon size={16} /> Sueño
            </div>
            <div className="flex gap-2">
                <input type="number" placeholder="h" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl py-3 text-center text-xl font-bold outline-none" />
                <input type="number" placeholder="m" value={sleepMinutes} onChange={(e) => setSleepMinutes(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl py-3 text-center text-xl font-bold outline-none" />
            </div>
          </Card>
      </div>

      {/* 4. CALIDAD DEL SUEÑO */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 text-purple-500 font-bold uppercase text-xs tracking-wider mb-4">
          <Activity size={16}/> Calidad Descanso
        </div>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => setSleepQuality(val === sleepQuality ? null : val)}
              className={`flex-1 aspect-square rounded-xl font-bold text-lg transition-all ${
                sleepQuality === val 
                  ? `${getQualityColor(val)} scale-110 shadow-lg` 
                  : "bg-slate-50 dark:bg-slate-950 text-slate-400 border border-slate-100 dark:border-slate-800"
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </Card>

      {/* 5. DIETA */}
      <Card className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg text-white"><Utensils size={20}/></div>
          <span className="font-bold text-slate-700 dark:text-slate-200">¿Dieta?</span>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setDietCompliance(false)} className={`p-2 rounded-xl border transition-all ${dietCompliance === false ? 'bg-red-100 border-red-400 text-red-500' : 'border-transparent text-slate-300'}`}><XCircle size={32} /></button>
           <button onClick={() => setDietCompliance(true)} className={`p-2 rounded-xl border transition-all ${dietCompliance === true ? 'bg-emerald-100 border-emerald-400 text-emerald-500' : 'border-transparent text-slate-300'}`}><CheckCircle size={32} /></button>
        </div>
      </Card>

      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Guardando...' : <><Save size={20} /> Guardar Registro</>}
      </Button>

      {lastWeight && (
        <p className="text-center text-slate-400 text-xs mt-6">
          Último registro: {format(new Date(lastWeight.created_at), "d MMM", { locale: es })}
        </p>
      )}
    </div>
  );
};

export default TrackerTab;