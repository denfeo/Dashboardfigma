import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MoreHorizontal, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

type PeriodKey = 'Сегодня' | 'Эта неделя' | 'Этот месяц';

const trafficData: Record<PeriodKey, { time: string; inbound: number; outbound: number; suspicious: number }[]> = {
  'Сегодня': [
    { time: '00:00', inbound: 120, outbound: 80,  suspicious: 12 },
    { time: '02:00', inbound: 90,  outbound: 60,  suspicious: 5  },
    { time: '04:00', inbound: 60,  outbound: 40,  suspicious: 2  },
    { time: '06:00', inbound: 200, outbound: 130, suspicious: 30 },
    { time: '08:00', inbound: 480, outbound: 290, suspicious: 65 },
    { time: '10:00', inbound: 620, outbound: 380, suspicious: 88 },
    { time: '12:00', inbound: 540, outbound: 320, suspicious: 72 },
    { time: '14:00', inbound: 710, outbound: 440, suspicious: 95 },
    { time: '16:00', inbound: 650, outbound: 400, suspicious: 80 },
    { time: '18:00', inbound: 420, outbound: 260, suspicious: 45 },
    { time: '20:00', inbound: 280, outbound: 170, suspicious: 28 },
    { time: '22:00', inbound: 160, outbound: 100, suspicious: 15 },
  ],
  'Эта неделя': [
    { time: 'Пн', inbound: 3200, outbound: 2100, suspicious: 320 },
    { time: 'Вт', inbound: 4100, outbound: 2800, suspicious: 410 },
    { time: 'Ср', inbound: 3700, outbound: 2400, suspicious: 380 },
    { time: 'Чт', inbound: 5200, outbound: 3500, suspicious: 620 },
    { time: 'Пт', inbound: 4800, outbound: 3100, suspicious: 540 },
    { time: 'Сб', inbound: 2100, outbound: 1400, suspicious: 190 },
    { time: 'Вс', inbound: 1800, outbound: 1200, suspicious: 150 },
  ],
  'Этот месяц': [
    { time: 'Нед 1', inbound: 18000, outbound: 12000, suspicious: 1800 },
    { time: 'Нед 2', inbound: 22000, outbound: 14500, suspicious: 2400 },
    { time: 'Нед 3', inbound: 19500, outbound: 13000, suspicious: 2100 },
    { time: 'Нед 4', inbound: 25000, outbound: 16800, suspicious: 3100 },
  ],
};

const periodStats: Record<PeriodKey, { bandwidth: string; suspicious: string; blocked: string }> = {
  'Сегодня':       { bandwidth: '4,72 ТБ',  suspicious: '23 481', blocked: '983'   },
  'Эта неделя':    { bandwidth: '31,4 ТБ',  suspicious: '164 220', blocked: '6 712' },
  'Этот месяц':    { bandwidth: '124 ТБ',   suspicious: '641 080', blocked: '28 904' },
};

type SeriesKey = 'inbound' | 'outbound' | 'suspicious';

const SERIES: { key: SeriesKey; color: string; label: string; grad: string }[] = [
  { key: 'inbound',    color: '#00C8FF', label: 'Входящий',      grad: 'inboundGrad'    },
  { key: 'outbound',   color: '#10B981', label: 'Исходящий',     grad: 'outboundGrad'   },
  { key: 'suspicious', color: '#F97316', label: 'Подозрительный', grad: 'suspiciousGrad' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const labelMap: Record<string, string> = { inbound: 'Входящий', outbound: 'Исходящий', suspicious: 'Подозрит.' };
    return (
      <div className="bg-[#0D1929] border border-[#1A2540] rounded-xl p-3 text-xs">
        <p className="text-gray-400 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="text-gray-300">{labelMap[entry.name] ?? entry.name}:</span>
            <span className="text-white font-medium">{entry.value} ГБ/с</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function NetworkTraffic() {
  const [period, setPeriod]         = useState<PeriodKey>('Сегодня');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [hidden, setHidden]         = useState<Set<SeriesKey>>(new Set());

  const toggleSeries = (key: SeriesKey) => {
    setHidden(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const stats = periodStats[period];
  const data  = trafficData[period];

  const statCards = [
    { icon: Activity,      label: 'Общая полоса',       value: stats.bandwidth,   change: '+8.4%', positive: true,  color: '#00C8FF' },
    { icon: AlertTriangle, label: 'Подозрит. пакеты',   value: stats.suspicious,  change: '+31%',  positive: false, color: '#F97316' },
    { icon: ShieldCheck,   label: 'Заблокировано',       value: stats.blocked,     change: '+12%',  positive: true,  color: '#10B981' },
  ];

  return (
    <div className="bg-[#0C1220] border border-[#1A2540] rounded-3xl p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold">Сетевой трафик</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setPeriodOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#1A2540] rounded-lg hover:bg-[#1A2540] text-sm text-gray-300 transition-colors"
            >
              <span>{period}</span>
              <motion.span animate={{ rotate: periodOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} />
              </motion.span>
            </button>
            <AnimatePresence>
              {periodOpen && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                  className="absolute top-full mt-1 right-0 bg-[#0D1929] border border-[#1A2540] rounded-xl overflow-hidden z-10 w-36"
                >
                  {(['Сегодня', 'Эта неделя', 'Этот месяц'] as PeriodKey[]).map(p => (
                    <button key={p} onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        period === p ? 'text-[#00C8FF] bg-[#1A2540]' : 'text-gray-300 hover:bg-[#1A2540]'
                      }`}>{p}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1A2540] transition-colors">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Мини-статистика */}
      <AnimatePresence mode="wait">
        <motion.div key={period} className="grid grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        >
          {statCards.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="bg-[#0D1929] rounded-2xl p-4 border border-[#1A2540]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '20' }}>
                  <stat.icon size={15} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-white font-semibold mb-0.5">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
              <span className={`text-xs font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* График */}
      <AnimatePresence mode="wait">
        <motion.div key={period} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="h-48"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                {SERIES.map(s => (
                  <linearGradient key={s.grad} id={s.grad} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={s.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0}   />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2540" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {SERIES.map(s => !hidden.has(s.key) && (
                <Area key={s.key} type="monotone" dataKey={s.key}
                  stroke={s.color} strokeWidth={2} fill={`url(#${s.grad})`} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Легенда — кликабельная */}
      <div className="flex items-center gap-5 mt-3 text-xs">
        {SERIES.map(s => (
          <button key={s.key} onClick={() => toggleSeries(s.key)}
            className={`flex items-center gap-1.5 transition-opacity ${hidden.has(s.key) ? 'opacity-35' : 'opacity-100'}`}
          >
            <span className="w-2 h-2 rounded-full transition-colors" style={{ backgroundColor: s.color }}></span>
            <span className={hidden.has(s.key) ? 'text-gray-600 line-through' : 'text-gray-500'}>{s.label}</span>
          </button>
        ))}
        <span className="ml-auto text-gray-700 text-xs">Нажмите на легенду для скрытия</span>
      </div>
    </div>
  );
}
