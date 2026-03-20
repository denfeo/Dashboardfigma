import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Shield, Bug, Network, FileWarning, BarChart3,
  Settings, Bell, Search, ChevronDown, Download, Filter,
  TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Zap,
  ArrowUpRight, Eye, Lock, Cpu, Globe, User, X,
  CheckCircle2, Clock, AlertCircle,
} from "lucide-react";
import { ThreatBreakdown } from "./components/ThreatBreakdown";
import { NetworkTraffic } from "./components/NetworkTraffic";
import { SecurityScore } from "./components/SecurityScore";
import { ThreatAlerts } from "./components/ThreatAlerts";

// ─── Типы ────────────────────────────────────────────────────────────────────
interface Incident {
  id: string; title: string; severity: string;
  status: string; color: string;
  analyst: string; started: string; description: string; affected: string;
}

// ─── Данные ───────────────────────────────────────────────────────────────────
const PERIOD_STATS: Record<string, { threats: string; blocked: string; vulns: string; incidents: string }> = {
  "Последние 24ч": { threats: "1 247", blocked: "983",  vulns: "234", incidents: "7"  },
  "Последние 7д":  { threats: "8 541", blocked: "6 712", vulns: "241", incidents: "23" },
  "Последние 30д": { threats: "34 108", blocked: "28 904", vulns: "267", incidents: "89" },
};

const NOTIFICATIONS = [
  { id: 1, icon: AlertTriangle, color: "#EF4444", title: "Критическая уязвимость",  text: "CVE-2025-1337 затрагивает OpenSSL 3.x", time: "2 мин назад",  read: false },
  { id: 2, icon: ShieldCheck,   color: "#10B981", title: "Атака заблокирована",      text: "DDoS-атака с 192.168.1.0/24 нейтрализована", time: "15 мин назад", read: false },
  { id: 3, icon: Bug,           color: "#F97316", title: "Обнаружен вредонос",       text: "Троян на DESKTOP-K92J помещён в карантин", time: "34 мин назад", read: false },
  { id: 4, icon: AlertCircle,   color: "#FBBF24", title: "Превышение порога трафика", text: "Входящий трафик > 850 Мбит/с на Edge-03",  time: "1 ч назад",   read: true  },
  { id: 5, icon: Lock,          color: "#A78BFA", title: "Брутфорс SSH",              text: "47 неудачных попыток с 10.0.0.44",         time: "2 ч назад",   read: true  },
];

const INCIDENTS: Incident[] = [
  { id: "INC-2841", title: "Вспышка вымогателя",     severity: "P1", status: "Расследование", color: "#EF4444",
    analyst: "Алекс Иванов", started: "20.03.2026 09:14",
    description: "Обнаружено массовое шифрование файлов на 12 рабочих станциях в сегменте finance. Предполагаемый вектор — фишинговое письмо с вредоносным макросом.",
    affected: "FS-FINANCE-01, FS-FINANCE-02, WS-FIN-[04-15]" },
  { id: "INC-2838", title: "Кража учётных данных",   severity: "P2", status: "Локализован",   color: "#F97316",
    analyst: "Мария Петрова", started: "19.03.2026 22:47",
    description: "Зафиксирован несанкционированный доступ к LDAP-дереву с использованием скомпрометированной учётной записи service_backup.",
    affected: "LDAP-SRV-01, AD-DC-02" },
  { id: "INC-2834", title: "Волна DDoS-атаки",       severity: "P2", status: "Митигация",     color: "#F97316",
    analyst: "Денис Козлов", started: "19.03.2026 18:30",
    description: "UDP flood атака с амплификацией DNS. Пиковая нагрузка 42k req/s. Применены правила rate-limiting на CDN-Edge.",
    affected: "CDN-Edge-03, api-gw-prod" },
  { id: "INC-2829", title: "Внутренняя угроза",      severity: "P3", status: "Мониторинг",    color: "#FBBF24",
    analyst: "Ольга Смирнова", started: "18.03.2026 14:05",
    description: "Аномальная активность пользователя: доступ к данным за пределами рабочего времени, попытки скачать > 2 ГБ из корп. репозитория.",
    affected: "ws-marketing-05" },
];

// ─── Карточка статистики ───────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ElementType; label: string; value: string;
  change: string; positive: boolean; color: string; delay: number;
}
function StatCard({ icon: Icon, label, value, change, positive, color, delay }: StatCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="bg-[#0C1220] border border-[#1A2540] rounded-2xl p-5 cursor-default relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: `radial-gradient(circle at 80% 20%, ${color}10, transparent 65%)` }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "25" }}>
            <Icon size={18} style={{ color }} />
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-green-400" : "text-red-400"}`}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        </div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Карточка инцидентов ───────────────────────────────────────────────────────
function ActiveIncidentsCard({ onSelectIncident }: { onSelectIncident: (inc: Incident) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4 }}
      className="bg-gradient-to-br from-[#0D1929] to-[#0a1220] border border-[#1A2540] rounded-3xl p-6 text-white relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #EF444410, transparent 70%)" }} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}
                className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-red-400 font-medium">7 активных</span>
            </div>
            <h3 className="font-semibold text-white">Реагирование на инциденты</h3>
          </div>
          <button className="flex items-center gap-1 text-xs text-[#00C8FF] hover:text-white transition-colors">
            Все <ArrowUpRight size={12} />
          </button>
        </div>

        <div className="space-y-2">
          {INCIDENTS.map((inc, i) => (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.07 }}
              whileHover={{ x: 4, backgroundColor: inc.color + "18" }}
              onClick={() => onSelectIncident(inc)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
              style={{ backgroundColor: inc.color + "10", borderLeft: `2px solid ${inc.color}` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500">{inc.id}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                    style={{ color: inc.color, backgroundColor: inc.color + "20" }}>{inc.severity}</span>
                </div>
                <p className="text-sm text-gray-200 mt-0.5 truncate">{inc.title}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{inc.status}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-[#1A2540] flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">MTTR за неделю</p>
            <p className="text-xl font-bold text-white">2ч 34м</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5">Нарушений SLA</p>
            <p className="text-xl font-bold text-red-400">2</p>
          </div>
          <button className="flex items-center gap-2 bg-[#00C8FF] text-[#06090F] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#00aed9] transition-colors">
            Реагировать <Zap size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Карточка уязвимостей ──────────────────────────────────────────────────────
function VulnerabilityCard() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const vulns = [
    { cve: "CVE-2025-1337", score: 9.8, affected: "OpenSSL 3.x",  status: "Не исправлена",
      detail: "Переполнение буфера в TLS-хендлере. Позволяет выполнить произвольный код." },
    { cve: "CVE-2025-0821", score: 8.1, affected: "Apache 2.4",   status: "Исправляется",
      detail: "Обход аутентификации через mod_auth_openidc. Патч развёртывается." },
    { cve: "CVE-2024-9934", score: 7.4, affected: "Nginx 1.25",   status: "Исправлена",
      detail: "HTTP Request Smuggling. Патч 1.25.4 применён на всех узлах." },
  ];
  const scoreColor = (s: number) => s >= 9 ? "#EF4444" : s >= 7 ? "#F97316" : "#FBBF24";
  const statusRu = (s: string) =>
    s === "Исправлена" ? "bg-green-400/10 text-green-400" :
    s === "Исправляется" ? "bg-yellow-400/10 text-yellow-400" : "bg-red-400/10 text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.4 }}
      className="bg-gradient-to-br from-[#0D1929] to-[#0a1220] border border-[#1A2540] rounded-3xl p-6 text-white relative overflow-hidden"
    >
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #F9731610, transparent 70%)" }} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">Топ уязвимостей</h3>
          <span className="text-xs px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full font-medium">
            24 критичных
          </span>
        </div>

        <div className="space-y-2 mb-5">
          {vulns.map((v, i) => (
            <div key={v.cve}>
              <motion.div
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.06 }}
                onClick={() => setExpanded(expanded === v.cve ? null : v.cve)}
                className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: scoreColor(v.score) + "20", color: scoreColor(v.score) }}>
                  {v.score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-gray-300">{v.cve}</p>
                  <p className="text-xs text-gray-500 truncate">{v.affected}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusRu(v.status)}`}>{v.status}</span>
              </motion.div>
              <AnimatePresence>
                {expanded === v.cve && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-gray-400 px-2 py-2 ml-12 border-l border-[#1A2540]">
                      {v.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[{ label: "Критичные", count: 24, color: "#EF4444" }, { label: "Высокие", count: 67, color: "#F97316" }, { label: "Средние", count: 143, color: "#FBBF24" }]
            .map(item => (
              <div key={item.label} className="rounded-xl py-2 px-1" style={{ backgroundColor: item.color + "15" }}>
                <p className="text-lg font-bold" style={{ color: item.color }}>{item.count}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Элемент сайдбара ──────────────────────────────────────────────────────────
interface SidebarItemProps { icon: React.ElementType; label: string; active: boolean; badge?: number; onClick: () => void; }
function SidebarItem({ icon: Icon, label, active, badge, onClick }: SidebarItemProps) {
  return (
    <motion.button whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors relative ${
        active ? "bg-[#00C8FF15] text-[#00C8FF]" : "text-gray-500 hover:text-gray-300 hover:bg-[#1A2540]"
      }`}
    >
      {active && (
        <motion.div layoutId="activePill"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00C8FF] rounded-r-full" />
      )}
      <Icon size={17} />
      <span className="text-sm">{label}</span>
      {badge !== undefined && (
        <span className="ml-auto text-xs bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </motion.button>
  );
}

// ─── Модальное окно инцидента ─────────────────────────────────────────────────
function IncidentModal({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  const statusColor = incident.color;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 280, damping: 26 }}
          onClick={e => e.stopPropagation()}
          className="bg-[#0D1929] border border-[#1A2540] rounded-3xl p-7 w-full max-w-lg relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ background: `radial-gradient(circle, ${statusColor}18, transparent 70%)` }} />

          <div className="relative z-10">
            {/* Заголовок */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-gray-500">{incident.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded font-bold"
                    style={{ color: statusColor, backgroundColor: statusColor + "20" }}>{incident.severity}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ color: statusColor, borderColor: statusColor + "40" }}>{incident.status}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{incident.title}</h2>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors flex-shrink-0">
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Детали */}
            <div className="space-y-4">
              <div className="bg-[#0C1220] rounded-2xl p-4 border border-[#1A2540]">
                <p className="text-xs text-gray-500 mb-1">Описание</p>
                <p className="text-sm text-gray-300 leading-relaxed">{incident.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0C1220] rounded-2xl p-4 border border-[#1A2540]">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={13} className="text-gray-500" />
                    <p className="text-xs text-gray-500">Аналитик</p>
                  </div>
                  <p className="text-sm text-white font-medium">{incident.analyst}</p>
                </div>
                <div className="bg-[#0C1220] rounded-2xl p-4 border border-[#1A2540]">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={13} className="text-gray-500" />
                    <p className="text-xs text-gray-500">Начало</p>
                  </div>
                  <p className="text-sm text-white font-medium">{incident.started}</p>
                </div>
              </div>
              <div className="bg-[#0C1220] rounded-2xl p-4 border border-[#1A2540]">
                <p className="text-xs text-gray-500 mb-1">Затронутые системы</p>
                <p className="text-sm font-mono text-[#00C8FF]">{incident.affected}</p>
              </div>
            </div>

            {/* Действия */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-[#00C8FF] text-[#06090F] py-2.5 rounded-xl font-semibold text-sm hover:bg-[#00aed9] transition-colors flex items-center justify-center gap-2">
                <Zap size={15} /> Начать реагирование
              </button>
              <button onClick={onClose}
                className="flex-1 bg-[#1A2540] text-gray-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#243050] transition-colors">
                Закрыть
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Панель уведомлений ───────────────────────────────────────────────────────
function NotificationPanel({ onClose, onMarkRead }: { onClose: () => void; onMarkRead: () => void }) {
  const [notes, setNotes] = useState(NOTIFICATIONS);
  const dismiss = (id: number) => setNotes(prev => prev.filter(n => n.id !== id));

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-14 right-4 w-80 bg-[#0D1929] border border-[#1A2540] rounded-3xl shadow-2xl z-40 overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A2540]">
        <h4 className="text-sm font-semibold text-white">Уведомления</h4>
        <div className="flex items-center gap-2">
          <button onClick={() => { onMarkRead(); setNotes(prev => prev.map(n => ({ ...n, read: true }))); }}
            className="text-xs text-[#00C8FF] hover:text-white transition-colors">Прочитать все</button>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <X size={13} className="text-gray-400" />
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {notes.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-gray-600">
              <CheckCircle2 size={24} className="mb-2 opacity-40" />
              <p className="text-sm">Нет новых уведомлений</p>
            </motion.div>
          )}
          {notes.map(n => (
            <motion.div key={n.id} layout
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className={`flex items-start gap-3 px-5 py-3 border-b border-[#1A2540] group transition-colors hover:bg-white/5 ${!n.read ? "bg-[#00C8FF05]" : ""}`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: n.color + "20" }}>
                <n.icon size={14} style={{ color: n.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF] flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{n.text}</p>
                <p className="text-xs text-gray-600 mt-0.5">{n.time}</p>
              </div>
              <button onClick={() => dismiss(n.id)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-0.5">
                <X size={10} className="text-gray-500" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Основное приложение ───────────────────────────────────────────────────────
const navItems = [
  { icon: LayoutDashboard, label: "Обзор",          key: "overview"  },
  { icon: ShieldCheck,    label: "Разведка угроз",  key: "threat",    badge: 7  },
  { icon: Network,        label: "Монитор сети",    key: "network"   },
  { icon: Bug,            label: "Уязвимости",      key: "vuln",      badge: 24 },
  { icon: FileWarning,    label: "Инциденты",       key: "incidents", badge: 7  },
  { icon: BarChart3,      label: "Отчёты",          key: "reports"   },
];

const TOP_TABS = ["Обзор", "Угрозы", "Сеть", "Узлы", "Журналы"];
const PERIODS = ["Последние 24ч", "Последние 7д", "Последние 30д"];

export default function App() {
  const [activeNav, setActiveNav]         = useState("overview");
  const [activeTab, setActiveTab]         = useState("Обзор");
  const [notifCount, setNotifCount]       = useState(3);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [selectedInc, setSelectedInc]     = useState<Incident | null>(null);
  const [period, setPeriod]               = useState("Последние 24ч");
  const [periodOpen, setPeriodOpen]       = useState(false);
  const [exportState, setExportState]     = useState<"idle" | "loading" | "done">("idle");
  const [searchVal, setSearchVal]         = useState("");

  const currentStats = PERIOD_STATS[period];

  const handleExport = () => {
    if (exportState !== "idle") return;
    setExportState("loading");
    setTimeout(() => { setExportState("done"); setTimeout(() => setExportState("idle"), 2000); }, 1500);
  };

  const stats = [
    { icon: AlertTriangle, label: "Всего угроз",          value: currentStats.threats,   change: "+12%", positive: false, color: "#EF4444", delay: 0.1  },
    { icon: Shield,        label: "Заблокировано атак",   value: currentStats.blocked,   change: "+8%",  positive: true,  color: "#10B981", delay: 0.18 },
    { icon: Bug,           label: "Уязвимости",           value: currentStats.vulns,     change: "+5",   positive: false, color: "#F97316", delay: 0.26 },
    { icon: Zap,           label: "Активных инцидентов",  value: currentStats.incidents, change: "-2",   positive: true,  color: "#00C8FF", delay: 0.34 },
  ];

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ backgroundColor: "#06090F", color: "white" }}>

      {/* ── Сайдбар ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className="w-[228px] flex-shrink-0 border-r border-[#1A2540] flex flex-col" style={{ backgroundColor: "#080C14" }}
      >
        {/* Логотип */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#1A2540]">
          <div className="w-8 h-8 bg-[#00C8FF] rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-[#06090F]" />
          </div>
          <div>
            <span className="font-bold text-white">CyberOps</span>
            <div className="text-xs text-gray-500">v2.4.1</div>
          </div>
        </div>

        {/* Пользователь */}
        <div className="px-6 py-4 border-b border-[#1A2540]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00C8FF20] border border-[#00C8FF30] flex items-center justify-center">
              <User size={16} className="text-[#00C8FF]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Алекс Иванов</p>
              <p className="text-xs text-gray-500">Аналитик SOC Ур. 2</p>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-xs text-gray-600 px-4 mb-2 font-medium tracking-wider">ОПЕРАЦИИ</p>
          <div className="space-y-0.5 mb-6">
            {navItems.map(item => (
              <SidebarItem key={item.key} icon={item.icon} label={item.label}
                active={activeNav === item.key} badge={item.badge}
                onClick={() => setActiveNav(item.key)} />
            ))}
          </div>
          <p className="text-xs text-gray-600 px-4 mb-2 font-medium tracking-wider">СИСТЕМА</p>
          <div className="space-y-0.5">
            <SidebarItem icon={Lock}     label="Контроль доступа" active={false} onClick={() => {}} />
            <SidebarItem icon={Cpu}      label="Реестр активов"   active={false} onClick={() => {}} />
            <SidebarItem icon={Globe}    label="Фиды угроз"        active={false} onClick={() => {}} />
            <SidebarItem icon={Settings} label="Настройки"         active={false} onClick={() => {}} />
          </div>
        </div>

        {/* Статус безопасности */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mx-3 mb-4 rounded-2xl p-4 border border-[#1A2540] relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0D1929 0%, #0C1220 100%)" }}
        >
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: "radial-gradient(circle at 80% 0%, #00C8FF08, transparent 60%)" }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}
                className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-green-400 font-medium">Системы в норме</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Последнее сканирование: 4 мин. назад</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Уровень угрозы</p>
                <p className="text-sm font-bold text-orange-400">ПОВЫШЕННЫЙ</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Рейтинг</p>
                <p className="text-sm font-bold text-[#00C8FF]">78/100</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Главный контент ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Верхняя панель */}
        <motion.div
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }}
          className="flex items-center justify-between px-6 py-3 border-b border-[#1A2540] flex-shrink-0 relative"
          style={{ backgroundColor: "#080C14" }}
        >
          {/* Вкладки */}
          <div className="flex items-center gap-1">
            {TOP_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {activeTab === tab && (
                  <motion.div layoutId="tabUnderline"
                    className="absolute inset-0 bg-[#00C8FF15] border border-[#00C8FF30] rounded-lg" />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          {/* Действия */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#0C1220] border border-[#1A2540] rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-500" />
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Угрозы, IP, CVE..."
                className="bg-transparent text-sm text-gray-300 outline-none w-40 placeholder-gray-600" />
              <AnimatePresence>
                {searchVal && (
                  <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    onClick={() => setSearchVal("")}>
                    <X size={12} className="text-gray-500 hover:text-gray-300" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => { setNotifOpen(o => !o); setNotifCount(0); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-[#1A2540] hover:bg-[#1A2540] transition-colors"
            >
              <Bell size={16} className={notifOpen ? "text-[#00C8FF]" : "text-gray-400"} />
              <AnimatePresence>
                {notifCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                    {notifCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#1A2540] hover:bg-[#1A2540] transition-colors">
              <Eye size={16} className="text-gray-400" />
            </button>
          </div>

          {/* Панель уведомлений */}
          <AnimatePresence>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} onMarkRead={() => setNotifCount(0)} />}
          </AnimatePresence>
        </motion.div>

        {/* Прокручиваемый контент */}
        <div className="flex-1 overflow-y-auto p-6" onClick={() => { if (notifOpen) setNotifOpen(false); if (periodOpen) setPeriodOpen(false); }}>

          {/* Заголовок страницы */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-0.5">Центр управления безопасностью</h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Дашборд</span>
                <span className="text-gray-700">›</span>
                <span className="text-[#00C8FF]">Обзор</span>
                <span className="text-gray-700">·</span>
                <span>Обновлено 2 мин. назад</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Период */}
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setPeriodOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-2 border border-[#1A2540] rounded-xl hover:bg-[#1A2540] text-sm text-gray-300 transition-colors">
                  <span>{period}</span>
                  <motion.span animate={{ rotate: periodOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {periodOpen && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                      className="absolute top-full mt-1 right-0 bg-[#0D1929] border border-[#1A2540] rounded-xl overflow-hidden z-20 w-44">
                      {PERIODS.map(p => (
                        <button key={p} onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            period === p ? "text-[#00C8FF] bg-[#1A2540]" : "text-gray-300 hover:bg-[#1A2540]"
                          }`}>{p}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="flex items-center gap-2 px-3 py-2 border border-[#1A2540] rounded-xl hover:bg-[#1A2540] text-sm text-gray-300 transition-colors">
                <Filter size={14} /><span>Фильтр</span>
              </button>

              {/* Экспорт */}
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleExport}
                className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-sm font-medium transition-colors ${
                  exportState === "done"
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-[#1A2540] hover:bg-[#1A2540] text-gray-300"
                }`}
              >
                <AnimatePresence mode="wait">
                  {exportState === "idle" && (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2">
                      <Download size={14} /><span>Экспорт</span>
                    </motion.span>
                  )}
                  {exportState === "loading" && (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="inline-block w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full" />
                      <span>Экспорт...</span>
                    </motion.span>
                  )}
                  {exportState === "done" && (
                    <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2">
                      <CheckCircle2 size={14} /><span>Готово!</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          {/* Карточки статистики */}
          <AnimatePresence mode="wait">
            <motion.div key={period} className="grid grid-cols-4 gap-4 mb-6"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              {stats.map(s => <StatCard key={s.label} {...s} />)}
            </motion.div>
          </AnimatePresence>

          {/* Основная сетка */}
          <div className="grid grid-cols-12 gap-5">
            <motion.div className="col-span-5"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.4 }}>
              <ThreatBreakdown />
            </motion.div>

            <div className="col-span-7 grid grid-rows-2 gap-5">
              <ActiveIncidentsCard onSelectIncident={setSelectedInc} />
              <VulnerabilityCard />
            </div>

            <motion.div className="col-span-7"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}>
              <NetworkTraffic />
            </motion.div>

            <motion.div className="col-span-5 grid grid-rows-2 gap-5"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.4 }}>
              <SecurityScore />
              <ThreatAlerts />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Модальное окно инцидента ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedInc && <IncidentModal incident={selectedInc} onClose={() => setSelectedInc(null)} />}
      </AnimatePresence>
    </div>
  );
}
