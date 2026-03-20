import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Activity } from 'lucide-react';

type ViewKey = 'Ежедневно' | 'Еженедельно' | 'Ежемесячно';

const viewOptions: ViewKey[] = ['Ежедневно', 'Еженедельно', 'Ежемесячно'];

const threatData: Record<ViewKey, { name: string; color: string; counts: number[]; total: number }[]> = {
  Ежедневно: [
    { name: 'Вредонос',   color: '#EF4444', counts: [1,1,1,1,0,1,1, 0,0,0,0,0,0], total: 312 },
    { name: 'Фишинг',     color: '#F97316', counts: [1,1,0,1,1,0,0, 0,0,0,0,0,0], total: 198 },
    { name: 'DDoS',       color: '#FBBF24', counts: [1,0,1,0,1,1,1, 0,0,0,0,0,0], total: 87  },
    { name: 'Вымогатель', color: '#00C8FF', counts: [0,1,1,0,0,1,0, 0,0,0,0,0,0], total: 54  },
    { name: 'Вторжение',  color: '#A78BFA', counts: [1,1,0,0,1,0,1, 0,0,0,0,0,0], total: 41  },
  ],
  Еженедельно: [
    { name: 'Вредонос',   color: '#EF4444', counts: [1,1,1,1,1,1,1, 1,0,0,0,0,0], total: 580 },
    { name: 'Фишинг',     color: '#F97316', counts: [1,1,1,0,1,0,0, 0,0,0,0,0,0], total: 322 },
    { name: 'DDoS',       color: '#FBBF24', counts: [1,1,0,1,0,1,0, 0,0,0,0,0,0], total: 145 },
    { name: 'Вымогатель', color: '#00C8FF', counts: [1,0,1,1,0,0,1, 0,0,0,0,0,0], total: 98  },
    { name: 'Вторжение',  color: '#A78BFA', counts: [0,1,1,0,1,1,0, 0,0,0,0,0,0], total: 72  },
  ],
  Ежемесячно: [
    { name: 'Вредонос',   color: '#EF4444', counts: [1,1,1,1,1,1,1, 1,1,1,1,1,1], total: 2100 },
    { name: 'Фишинг',     color: '#F97316', counts: [1,1,1,1,1,1,0, 0,0,0,0,0,0], total: 1250 },
    { name: 'DDoS',       color: '#FBBF24', counts: [1,1,1,0,1,0,1, 1,0,0,0,0,0], total: 630  },
    { name: 'Вымогатель', color: '#00C8FF', counts: [1,0,1,1,0,1,1, 0,0,0,0,0,0], total: 410  },
    { name: 'Вторжение',  color: '#A78BFA', counts: [1,1,0,1,1,0,1, 1,0,0,0,0,0], total: 290  },
  ],
};

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс', '', '', '', '', '', ''];
const totalByView: Record<ViewKey, string> = {
  Ежедневно: '1 247',
  Еженедельно: '3 217',
  Ежемесячно: '9 840',
};

export function ThreatBreakdown() {
  const [view, setView] = useState<ViewKey>('Ежедневно');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const categories = threatData[view];

  return (
    <div className="bg-[#0C1220] border border-[#1A2540] rounded-3xl p-6 h-full">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold">Разбивка угроз</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#1A2540] rounded-lg hover:bg-[#1A2540] text-sm text-gray-300 transition-colors"
            >
              <span>{view}</span>
              <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} />
              </motion.span>
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                  className="absolute top-full mt-1 right-0 bg-[#0D1929] border border-[#1A2540] rounded-xl overflow-hidden z-10 w-36"
                >
                  {viewOptions.map(opt => (
                    <button key={opt}
                      onClick={() => { setView(opt); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        view === opt ? 'text-[#00C8FF] bg-[#1A2540]' : 'text-gray-300 hover:bg-[#1A2540]'
                      }`}
                    >{opt}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1A2540] transition-colors">
            <Activity size={16} className="text-[#00C8FF]" />
          </button>
        </div>
      </div>

      {/* Итого */}
      <AnimatePresence mode="wait">
        <motion.div key={view}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
          className="mb-6"
        >
          <h2 className="text-4xl font-bold text-white mb-3">{totalByView[view]}</h2>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            {[
              { color: 'bg-red-500',    label: 'Критичные' },
              { color: 'bg-orange-500', label: 'Высокие'   },
              { color: 'bg-yellow-400', label: 'Средние'   },
              { color: 'bg-[#00C8FF]',  label: 'Низкие'    },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${l.color}`}></span>
                <span className="text-gray-400">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Тепловая карта */}
      <div className="space-y-3 mb-5">
        {categories.map((cat, ci) => (
          <motion.div
            key={cat.name + view}
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: ci * 0.06, duration: 0.3 }}
            onMouseEnter={() => setHoveredRow(cat.name)}
            onMouseLeave={() => setHoveredRow(null)}
            className="cursor-default"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-gray-400">{cat.name}</p>
              <span className="text-xs font-medium" style={{ color: cat.color }}>
                {cat.total.toLocaleString('ru-RU')}
              </span>
            </div>
            <div className="flex gap-1.5">
              {cat.counts.map((filled, index) => (
                <motion.div
                  key={index}
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  transition={{ delay: ci * 0.06 + index * 0.02, duration: 0.25, ease: 'easeOut' }}
                  style={{ transformOrigin: 'bottom' }}
                  className={`flex-1 h-7 rounded-md transition-all duration-200 ${
                    hoveredRow === cat.name ? 'opacity-100' : 'opacity-90'
                  }`}
                >
                  <div className="w-full h-full rounded-md"
                    style={filled
                      ? { backgroundColor: cat.color, boxShadow: hoveredRow === cat.name ? `0 0 6px ${cat.color}80` : 'none' }
                      : { backgroundColor: '#1A2540' }
                    }
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Дни */}
      <div className="flex gap-1.5 text-xs text-gray-600">
        {days.map((day, index) => (
          <div key={index} className="flex-1 text-center">{day}</div>
        ))}
      </div>
    </div>
  );
}
