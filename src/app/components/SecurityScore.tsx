import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Shield, CheckCircle2, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type CheckStatus = 'good' | 'warn' | 'bad';

interface Check {
  id: string;
  label: string;
  status: CheckStatus;
}

const initialChecks: Check[] = [
  { id: 'fw',    label: 'Брандмауэр активен',       status: 'good' },
  { id: 'ep',    label: 'Защита конечных точек',     status: 'good' },
  { id: 'patch', label: 'Управление патчами',        status: 'warn' },
  { id: 'zd',    label: 'Угрозы нулевого дня',       status: 'bad'  },
];

const statusCycle: Record<CheckStatus, CheckStatus> = { good: 'warn', warn: 'bad', bad: 'good' };

const statusConfig: Record<CheckStatus, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  good: { color: '#10B981', bg: '#10B98120', icon: CheckCircle2, label: 'OK'              },
  warn: { color: '#FBBF24', bg: '#FBBF2420', icon: AlertCircle,  label: 'Предупреждение' },
  bad:  { color: '#EF4444', bg: '#EF444420', icon: XCircle,      label: 'Тревога'        },
};

const scoreMap: Record<CheckStatus, number> = { good: 20, warn: 10, bad: 0 };

export function SecurityScore() {
  const [checks, setChecks]   = useState<Check[]>(initialChecks);
  const [spinning, setSpinning] = useState(false);

  const score = checks.reduce((acc, c) => acc + scoreMap[c.status], 0) + 18; // base 18
  const scoreData = [
    { name: 'Рейтинг',    value: score,       color: score >= 70 ? '#10B981' : score >= 50 ? '#FBBF24' : '#EF4444' },
    { name: 'Остаток',    value: 100 - score, color: '#1A2540' },
  ];
  const scoreLabel = score >= 70 ? 'Хорошо' : score >= 50 ? 'Средне' : 'Плохо';
  const scoreColor = scoreData[0].color;

  const toggleCheck = (id: string) => {
    setChecks(prev => prev.map(c => c.id === id ? { ...c, status: statusCycle[c.status] } : c));
  };

  const refresh = () => {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => {
      setChecks(prev => prev.map(c => ({ ...c, status: Math.random() > 0.4 ? 'good' : Math.random() > 0.5 ? 'warn' : 'bad' })));
      setSpinning(false);
    }, 1200);
  };

  return (
    <div className="bg-[#0C1220] border border-[#1A2540] rounded-3xl p-6 h-full">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold flex items-center gap-2">
          Рейтинг безопасности
          <ArrowUpRight size={16} className="text-[#00C8FF]" />
        </h3>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={refresh}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#1A2540] border border-[#1A2540] transition-colors"
            title="Обновить рейтинг"
          >
            <motion.span animate={{ rotate: spinning ? 360 : 0 }}
              transition={spinning ? { repeat: Infinity, duration: 0.7, ease: 'linear' } : { duration: 0.3 }}>
              <RefreshCw size={14} className={spinning ? 'text-[#00C8FF]' : 'text-gray-400'} />
            </motion.span>
          </motion.button>
          <Shield size={16} className="text-[#00C8FF]" />
        </div>
      </div>

      {/* Легенда */}
      <div className="space-y-1.5 mb-5">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00C8FF]"></span>
          <span className="text-gray-400">Общий рейтинг</span>
          <span className="ml-auto text-gray-300 font-medium">Среднее за неделю</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
          <span className="text-gray-400">Проверок пройдено</span>
          <span className="ml-auto text-green-400 font-medium">+3 сегодня</span>
        </div>
      </div>

      {/* Диаграмма */}
      <div className="relative h-48 mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={scoreData} cx="50%" cy="50%"
              startAngle={90} endAngle={-270}
              innerRadius={52} outerRadius={84}
              paddingAngle={2} dataKey="value"
            >
              {scoreData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={score}
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-white">{score}</div>
              <div className="text-xs text-gray-400">/ 100</div>
              <div className="text-xs font-medium mt-0.5" style={{ color: scoreColor }}>{scoreLabel}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Проверки — кликабельные */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600 mb-2">Нажмите на проверку для смены статуса</p>
        {checks.map((check, i) => {
          const cfg = statusConfig[check.status];
          return (
            <motion.button
              key={check.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleCheck(check.id)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: cfg.bg }}
            >
              <cfg.icon size={14} style={{ color: cfg.color }} />
              <span className="text-xs text-gray-300 flex-1 text-left">{check.label}</span>
              <AnimatePresence mode="wait">
                <motion.span key={check.status}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }}
                  className="text-xs font-medium" style={{ color: cfg.color }}
                >
                  {cfg.label}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
