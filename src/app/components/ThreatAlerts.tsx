import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, ShieldAlert, Zap, Bug } from 'lucide-react';

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface Alert {
  id: number;
  type: string;
  source: string;
  message: string;
  severity: Severity;
  time: string;
  icon: typeof AlertTriangle;
}

const severityRu: Record<Severity, string> = {
  critical: 'критичный',
  high:     'высокий',
  medium:   'средний',
  low:      'низкий',
};

const filterLabels: Record<Severity | 'all', string> = {
  all:      'все',
  critical: 'критичные',
  high:     'высокие',
  medium:   'средние',
  low:      'низкие',
};

const initialAlerts: Alert[] = [
  { id: 1, type: 'Перебор паролей',      source: '192.168.1.101',  message: 'Множественные неудачные попытки входа SSH',    severity: 'critical', time: 'только что', icon: ShieldAlert   },
  { id: 2, type: 'Фишинг',               source: 'mail-srv-02',    message: 'Обнаружена подозрительная ссылка в письме',    severity: 'high',     time: '12 с назад',  icon: AlertTriangle },
  { id: 3, type: 'Вредонос',             source: 'DESKTOP-K92J',   message: 'Обнаружена сигнатура трояна в /tmp',           severity: 'critical', time: '45 с назад',  icon: Bug           },
  { id: 4, type: 'Сканирование портов',  source: '10.0.0.44',      message: 'Последовательное сканирование портов в подсети', severity: 'medium', time: '1 мин назад', icon: Zap           },
  { id: 5, type: 'DDoS',                 source: 'CDN-Edge-03',    message: 'Аномальный всплеск трафика: 42k req/s',        severity: 'high',     time: '2 мин назад', icon: AlertTriangle },
];

const newAlertsPool: Omit<Alert, 'id' | 'time'>[] = [
  { type: 'SQL-инъекция',         source: 'api-gateway',    message: 'Перехвачен некорректный SQL-запрос',         severity: 'critical', icon: ShieldAlert   },
  { type: 'Вымогатель',           source: 'FS-SERVER-01',   message: 'Обнаружено необычное шифрование файлов',     severity: 'critical', icon: Bug           },
  { type: 'Боковое перемещение',  source: '172.16.0.23',    message: 'Аномальный шаблон внутреннего трафика',      severity: 'high',     icon: Zap           },
  { type: 'Утечка данных',        source: 'ws-marketing-05',message: 'Большая исходящая передача > 2 ГБ',          severity: 'high',     icon: AlertTriangle },
];

const severityConfig: Record<Severity, { bg: string; text: string; border: string; dot: string }> = {
  critical: { bg: '#EF444415', text: '#EF4444', border: '#EF444430', dot: 'bg-red-500'    },
  high:     { bg: '#F9731615', text: '#F97316', border: '#F9731630', dot: 'bg-orange-500' },
  medium:   { bg: '#FBBF2415', text: '#FBBF24', border: '#FBBF2430', dot: 'bg-yellow-400' },
  low:      { bg: '#10B98115', text: '#10B981', border: '#10B98130', dot: 'bg-green-400'  },
};

let nextId = 100;

export function ThreatAlerts() {
  const [alerts, setAlerts]   = useState<Alert[]>(initialAlerts);
  const [filter, setFilter]   = useState<Severity | 'all'>('all');
  const [live, setLive]       = useState(true);

  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      const template = newAlertsPool[Math.floor(Math.random() * newAlertsPool.length)];
      const newAlert: Alert = { ...template, id: nextId++, time: 'только что' };
      setAlerts(prev => [newAlert, ...prev].slice(0, 8));
    }, 4000);
    return () => clearInterval(interval);
  }, [live]);

  const dismiss    = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id));
  const dismissAll = () => setAlerts([]);

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);

  const counts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    high:     alerts.filter(a => a.severity === 'high').length,
    medium:   alerts.filter(a => a.severity === 'medium').length,
  };

  return (
    <div className="bg-[#0C1220] border border-[#1A2540] rounded-3xl p-6 flex flex-col h-full">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-semibold">Оповещения об угрозах</h3>
          {live && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-1.5 text-xs text-green-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              ПРЯМОЙ ЭФИР
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLive(l => !l)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              live
                ? 'border-green-500 text-green-400 bg-green-500/10'
                : 'border-[#1A2540] text-gray-400 hover:bg-[#1A2540]'
            }`}
          >
            {live ? 'Пауза' : 'Возобновить'}
          </button>
          {alerts.length > 0 && (
            <button onClick={dismissAll}
              className="text-xs px-3 py-1 rounded-full border border-[#1A2540] text-gray-400 hover:bg-[#1A2540] transition-colors">
              Очистить
            </button>
          )}
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'critical', 'high', 'medium'] as const).map(sev => (
          <button key={sev} onClick={() => setFilter(sev)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all`}
            style={
              filter === sev
                ? sev === 'all'
                  ? { borderColor: '#00C8FF', color: '#00C8FF', backgroundColor: '#00C8FF15' }
                  : { borderColor: severityConfig[sev as Severity].border,
                      color: severityConfig[sev as Severity].text,
                      backgroundColor: severityConfig[sev as Severity].bg }
                : { borderColor: '#1A2540', color: '#6B7280' }
            }
          >
            {sev !== 'all' && (
              <span className={`w-1.5 h-1.5 rounded-full ${severityConfig[sev as Severity]?.dot}`} />
            )}
            <span className="capitalize">{filterLabels[sev]}</span>
            {sev !== 'all' && (
              <span className="font-bold">{counts[sev as keyof typeof counts]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Список оповещений */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0" style={{ maxHeight: '320px' }}>
        <AnimatePresence initial={false}>
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-gray-600">
              <ShieldAlert size={28} className="mb-2 opacity-40" />
              <p className="text-sm">Нет оповещений</p>
            </motion.div>
          )}
          {filtered.map(alert => {
            const cfg = severityConfig[alert.severity];
            return (
              <motion.div
                key={alert.id} layout
                initial={{ opacity: 0, y: -20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="flex items-start gap-3 p-3 rounded-2xl border group"
                style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: cfg.text + '20' }}>
                  <alert.icon size={14} style={{ color: cfg.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-white">{alert.type}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ color: cfg.text, backgroundColor: cfg.bg }}>
                      {severityRu[alert.severity]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600 font-mono">{alert.source}</span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-gray-600">{alert.time}</span>
                  </div>
                </div>
                <button onClick={() => dismiss(alert.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                  <X size={12} className="text-gray-400" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
