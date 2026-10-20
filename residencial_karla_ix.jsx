import { useState, useEffect, useRef } from "react";
import {
  Building2, LayoutDashboard, Users, Wallet, Flame, ClipboardList,
  ScrollText, LogOut, Plus, Trash2, Check, X, Eye, EyeOff, Globe,
  ArrowUpRight, ArrowDownRight, Send, CircleDollarSign
} from "lucide-react";
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

/* ---------------------------------------------------------------------- */
/* Constants & seed data (sample data — not real figures) */
/* ---------------------------------------------------------------------- */

const MONTHS_SEED = [
  "2025-09","2025-10","2025-11","2025-12","2026-01","2026-02",
  "2026-03","2026-04","2026-05","2026-06","2026-07","2026-08",
  "2026-09","2026-10","2026-11","2026-12"
];

const zip = (months, values) => {
  const o = {};
  months.forEach((m, i) => { o[m] = values[i]; });
  return o;
};

// NOTE: all figures below are SAMPLE DATA for demonstration only.
function buildApartmentsSeed() {
  const maint = {
    "1C": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "1D": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "2A": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "2B": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "2C": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "2D": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "3A": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "3B": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "3C": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "3D": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "4A": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "4B": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "4C": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
    "4D": [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,null,null,null,null],
  };
  const gas = {
    "1C": [1367.31,0,630.01,0,930.04,0,867.85,0,1483.77,0,1412.04,0,null,null,null,null],
    "1D": [1670.62,0,704.33,0,1106.31,0,635.76,0,862.37,0,1206.43,0,null,null,null,null],
    "2A": [631.84,0,838.61,0,1379.86,0,1253.93,0,864.53,0,1307.12,0,null,null,null,null],
    "2B": [1571.32,0,607.80,0,1566.98,0,1437.77,0,1008.30,0,786.58,0,null,null,null,null],
    "2C": [1748.66,0,1003.91,0,711.30,0,716.06,0,1616.99,0,1324.47,0,null,null,null,null],
    "2D": [1568.55,0,1475.68,0,1243.47,0,1767.74,0,1054.24,0,1262.45,0,null,null,null,null],
    "3A": [1595.29,0,1342.22,0,1634.05,0,1292.82,0,1445.49,0,654.99,0,null,null,null,null],
    "3B": [873.48,0,947.27,0,695.75,0,879.35,0,721.20,0,933.57,0,null,null,null,null],
    "3C": [1362.82,0,1037.80,0,1044.22,0,851.41,0,920.37,0,1723.99,0,null,null,null,null],
    "3D": [1377.64,0,1330.96,0,805.37,0,1474.95,0,796.08,0,1055.35,0,null,null,null,null],
    "4A": [1787.43,0,1368,0,1268.34,0,1421.54,0,1611.42,0,1531.20,0,null,null,null,null],
    "4B": [874.86,0,638.52,0,978.54,0,921.29,0,853.18,0,1731.49,0,null,null,null,null],
    "4C": [1651.64,0,977.61,0,1386.53,0,1074.76,0,1697.46,0,1150.62,0,null,null,null,null],
    "4D": [917.86,0,895.95,0,1273.64,0,915.29,0,1301.50,0,1677.39,0,null,null,null,null],
  };
  const pending = { "1C":4000, "1D":2000, "2A":0, "2B":0, "2C":6000, "2D":4000, "3A":0, "3B":0, "3C":0, "3D":0, "4A":0, "4B":4000, "4C":6000, "4D":0 };
  return Object.keys(maint).map(id => ({
    id, residentName: "", username: id.toLowerCase(), password: "CHANGE_ME",
    pendingBalance: pending[id] ?? 0, maint: zip(MONTHS_SEED, maint[id]), gas: zip(MONTHS_SEED, gas[id]),
  }));
}

function buildExpensesSeed() {
  const residential = [
    ["Personal de Limpieza",[12770,13192,12936,12503,13106,13885,13361,12229,13770,13502,13537,12680,0,0,0,0]],
    ["Energía Eléctrica",[4294,4158,4003,4722,4720,4972,4762,4508,4106,4625,4842,4508,0,0,0,0]],
    ["Basura",[580,650,565,881,869,867,740,695,545,645,894,823,0,0,0,0]],
    ["Materiales de limpieza",[968,0,0,969,0,0,1197,0,0,855,0,0,0,0,0,0]],
    ["Mantenimiento Cerco Eléctrico",[3732,0,0,0,0,0,3816,0,0,0,0,0,0,0,0,0]],
    ["Servicio de Internet y Cámaras",[3956,0,0,0,3065,0,0,0,2252,0,0,0,0,0,0,0]],
    ["Servicio Plomería",[2490,0,0,0,0,0,2920,0,0,0,0,0,0,0,0,0]],
    ["Fumigación",[2583,0,0,0,0,0,2764,0,0,0,0,0,0,0,0,0]],
    ["Limpieza Cisterna",[2803,0,0,0,0,0,2982,0,0,0,0,0,0,0,0,0]],
    ["Servicio Eléctrico",[2893,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
  ];
  const gas = [["Pago suministro Gas Propano",[13510.53,0,13379.74,0,13425.90,0,12797.98,0,13343.37,0,12746.84,0,null,null,null,null]]];
  const toRows = (arr, prefix) => arr.map(([concept, values], i) => ({ id: `${prefix}-${i}`, concept, amounts: zip(MONTHS_SEED, values) }));
  return { residential: toRows(residential, "res"), gas: toRows(gas, "gas") };
}

// Default admin login — change it on first use.
const CONFIG_SEED = { residencialName: "Residencial Karla IX", months: MONTHS_SEED, adminUsername: "admin", adminPassword: "CHANGE_ME" };
const BALANCE_SEED = { balanceAnterior: 50000, ingresoGasAtrasado: 5000, ingresosDeudasPendientes: 3000, pagoExtraordinario: 10000 };

const COLORS = { income: "#0f766e", expense: "#be123c", net: "#1c1917", accent: "#0d9488" };

/* ---------------------------------------------------------------------- */
/* i18n                                                                    */
/* ---------------------------------------------------------------------- */

const DICT = {
  loginTitle: ["Portal del Residencial", "Residential Portal"],
  loginSubtitle: ["Administración financiera del residencial", "Building financial administration"],
  chooseRole: ["¿Cómo deseas ingresar?", "How would you like to sign in?"],
  roleAdmin: ["Administrador", "Administrator"],
  roleAdminDesc: ["Gestionar cuentas, ingresos y gastos", "Manage accounts, income and expenses"],
  roleResident: ["Residente", "Resident"],
  roleResidentDesc: ["Ver mi estado de cuenta y reportar pagos", "View my statement and report payments"],
  username: ["Usuario", "Username"],
  password: ["Contraseña", "Password"],
  signIn: ["Iniciar sesión", "Sign in"],
  back: ["Volver", "Back"],
  invalidCreds: ["Usuario o contraseña incorrectos.", "Incorrect username or password."],
  logout: ["Cerrar sesión", "Log out"],
  overview: ["Resumen", "Overview"],
  apartments: ["Apartamentos", "Apartments"],
  income: ["Ingresos Mantenimiento", "Maintenance Income"],
  expenses: ["Gastos", "Expenses"],
  gasSection: ["Gas Propano", "Propane Gas"],
  reports: ["Reportes de Pago", "Payment Reports"],
  finance: ["Estado Financiero", "Financial Statement"],
  myOverview: ["Mi Resumen", "My Overview"],
  reportPayment: ["Reportar Pago", "Report a Payment"],
  myReports: ["Mis Reportes", "My Reports"],
  total: ["Total", "Total"],
  pending: ["Pendiente", "Pending"],
  actions: ["Acciones", "Actions"],
  delete: ["Eliminar", "Delete"],
  confirmQ: ["¿Confirmar?", "Confirm?"],
  add: ["Agregar", "Add"],
  addMonth: ["Agregar mes", "Add month"],
  addApartment: ["Nuevo apartamento", "New apartment"],
  addConcept: ["Nuevo concepto", "New item"],
  save: ["Guardar cambios", "Save changes"],
  saved: ["Guardado ✓", "Saved ✓"],
  resident: ["Residente", "Resident"],
  apartment: ["Apartamento", "Apartment"],
  concept: ["Concepto", "Item"],
  month: ["Mes", "Month"],
  amount: ["Monto", "Amount"],
  note: ["Nota", "Note"],
  type: ["Tipo", "Type"],
  maintenance: ["Mantenimiento", "Maintenance"],
  status: ["Estado", "Status"],
  statusPending: ["Pendiente", "Pending"],
  statusApproved: ["Aprobado", "Approved"],
  statusRejected: ["Rechazado", "Rejected"],
  approve: ["Aprobar", "Approve"],
  reject: ["Rechazar", "Reject"],
  submit: ["Enviar reporte", "Submit report"],
  noReports: ["Aún no hay reportes.", "No reports yet."],
  pendingBalance: ["Saldo pendiente", "Balance due"],
  totalPaidMaint: ["Total pagado — mantenimiento", "Total paid — maintenance"],
  totalPaidGas: ["Total pagado — gas", "Total paid — gas"],
  fundsAvailable: ["Fondos actuales", "Funds available"],
  totalIncome: ["Ingresos totales", "Total income"],
  totalExpenses: ["Gastos totales", "Total expenses"],
  netResult: ["Resultado neto", "Net result"],
  previousBalance: ["Balance administración anterior", "Previous admin. balance"],
  lateGasIncome: ["Ingreso por gas atrasado", "Late gas income"],
  pendingDebtsIncome: ["Ingresos por deudas pendientes", "Income from pending debts"],
  extraordinaryPayment: ["Pago extraordinario", "Extraordinary payment"],
  createAccount: ["Crear cuenta", "Create account"],
  cancel: ["Cancelar", "Cancel"],
  securityNote: [
    "Las cuentas y los datos de este panel se guardan dentro de la app y los ve cualquiera con acceso a ella. No ingreses información más sensible de la necesaria para administrar el residencial.",
    "Accounts and data here are stored inside the app and visible to anyone with access to it. Don't enter more sensitive information than needed to run the building."
  ],
  welcome: ["Bienvenido/a", "Welcome"],
  reportSubmitted: ["Tu reporte fue enviado y quedará pendiente de aprobación.", "Your report was submitted and is now pending approval."],
  myPaymentsMaint: ["Historial de mantenimiento", "Maintenance history"],
  myPaymentsGas: ["Historial de gas propano", "Propane gas history"],
  noData: ["—", "—"],
  selectMonth: ["Selecciona un mes", "Select a month"],
  requiredFields: ["Completa todos los campos.", "Fill in all the fields."],
  usernameTaken: ["Ese usuario ya existe.", "That username is already taken."],
  show: ["Mostrar", "Show"],
  hide: ["Ocultar", "Hide"],
  loading: ["Cargando…", "Loading…"],
  overviewSubtitle: ["Panorama financiero del residencial", "Building's financial overview"],
  gasIncomeTitle: ["Ingresos por Gas Propano", "Propane Gas Income"],
  gasExpenseTitle: ["Gastos de Gas Propano", "Propane Gas Expenses"],
  residentialExpenseTitle: ["Gastos Residenciales", "Building Expenses"],
  incomeMaintTitle: ["Ingresos por Mantenimiento", "Maintenance Income"],
  monthlyTrend: ["Ingresos vs. Gastos por mes", "Income vs. Expenses by month"],
  residentName: ["Nombre del residente", "Resident name"],
  aptId: ["Identificador (ej. 5A)", "Unit ID (e.g. 5A)"],
  reportNewPayment: ["Reportar un nuevo pago", "Report a new payment"],
  history: ["Historial", "History"],
  adminNote: ["Nota del administrador", "Admin note"],
  optional: ["opcional", "optional"],
  editPassword: ["Cambiar contraseña", "Change password"],
  newPassword: ["Nueva contraseña", "New password"],
  keepCurrent: ["dejar en blanco para no cambiar", "leave blank to keep current"],
  language: ["Idioma", "Language"],
};

function useT(lang) {
  return (key) => (DICT[key] ? DICT[key][lang === "en" ? 1 : 0] : key);
}

function detectLang() {
  try {
    const nav = (navigator.language || (navigator.languages && navigator.languages[0]) || "es").toLowerCase();
    return nav.startsWith("en") ? "en" : "es";
  } catch {
    return "es";
  }
}

function monthLabel(key, lang) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString(lang === "en" ? "en-US" : "es-DO", { month: "short", year: "numeric" });
}

function nextMonthKey(months) {
  const last = months[months.length - 1];
  const [y, m] = last.split("-").map(Number);
  const d = new Date(y, m, 1); // m is already +1 index (0-based next month)
  const ny = d.getFullYear();
  const nm = String(d.getMonth() + 1).padStart(2, "0");
  return `${ny}-${nm}`;
}

function fmt(n, lang) {
  const v = Number(n) || 0;
  return "RD$ " + v.toLocaleString(lang === "en" ? "en-US" : "es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function sumAmounts(amounts, months) {
  return months.reduce((s, m) => s + (Number(amounts[m]) || 0), 0);
}

/* ---------------------------------------------------------------------- */
/* Storage helpers                                                         */
/* ---------------------------------------------------------------------- */

async function loadKey(key, seed) {
  try {
    const res = await window.storage.get(key, true);
    if (res && res.value != null) return JSON.parse(res.value);
    throw new Error("empty");
  } catch {
    await window.storage.set(key, JSON.stringify(seed), true);
    return seed;
  }
}

async function saveKey(key, value) {
  await window.storage.set(key, JSON.stringify(value), true);
}

/* ---------------------------------------------------------------------- */
/* Small shared UI atoms                                                   */
/* ---------------------------------------------------------------------- */

function SavedPing({ show }) {
  if (!show) return null;
  return <span className="text-emerald-700 text-sm font-medium ml-3 animate-pulse">Guardado ✓</span>;
}

function StatCard({ label, value, tone = "neutral", icon: Icon }) {
  const toneClasses = {
    neutral: "bg-white border-stone-200 text-stone-900",
    good: "bg-emerald-50 border-emerald-200 text-emerald-900",
    bad: "bg-rose-50 border-rose-200 text-rose-900",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneClasses}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wide opacity-70">{label}</span>
        {Icon && <Icon size={16} className="opacity-60" />}
      </div>
      <div className="text-2xl font-semibold" style={{ fontFamily: "'Source Serif 4', serif" }}>{value}</div>
    </div>
  );
}

function StatusBadge({ status, t }) {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
  };
  const label = { pending: t("statusPending"), approved: t("statusApproved"), rejected: t("statusRejected") }[status];
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>{label}</span>;
}

function ConfirmButton({ label, confirmLabel, onConfirm, className }) {
  const [confirming, setConfirming] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => timer.current && clearTimeout(timer.current), []);
  if (confirming) {
    return (
      <button
        className={`text-rose-700 font-semibold text-xs underline ${className || ""}`}
        onClick={() => { setConfirming(false); onConfirm(); }}
      >
        {confirmLabel}
      </button>
    );
  }
  return (
    <button
      className={`text-rose-600 hover:text-rose-800 text-xs ${className || ""}`}
      onClick={() => { setConfirming(true); timer.current = setTimeout(() => setConfirming(false), 3000); }}
    >
      {label}
    </button>
  );
}

/* Generic month-by-row editable grid, used for income & expense tables */
function MonthGridTable({ rows, months, lang, t, editable, onCellChange, rowLabelHeader, onDeleteRow, canDeleteRow, secondaryLabel }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-stone-900 text-stone-50">
            <th className="sticky left-0 z-10 bg-stone-900 px-3 py-2.5 text-left font-medium whitespace-nowrap">{rowLabelHeader}</th>
            {months.map((m) => (
              <th key={m} className="px-3 py-2.5 text-right font-medium whitespace-nowrap">{monthLabel(m, lang)}</th>
            ))}
            <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap">{t("total")}</th>
            {canDeleteRow && <th className="px-2 py-2.5" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            const total = sumAmounts(r.amounts, months);
            return (
              <tr key={r.id} className={idx % 2 ? "bg-stone-50" : "bg-white"}>
                <td className={`sticky left-0 z-10 px-3 py-2 font-medium text-stone-800 whitespace-nowrap ${idx % 2 ? "bg-stone-50" : "bg-white"}`}>
                  {r.label}
                  {secondaryLabel && r.sub ? <div className="text-xs font-normal text-stone-500">{r.sub}</div> : null}
                </td>
                {months.map((m) => {
                  const val = r.amounts[m];
                  return (
                    <td key={m} className="px-1 py-1 text-right">
                      {editable ? (
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={val ?? ""}
                          placeholder="—"
                          onBlur={(e) => onCellChange(r.id, m, e.target.value)}
                          className="w-24 text-right rounded border border-stone-200 px-1.5 py-1 text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                      ) : (
                        <span className={val == null ? "text-stone-300" : "text-stone-700"}>{val == null ? "—" : fmt(val, lang)}</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-right font-semibold text-teal-800 whitespace-nowrap">{fmt(total, lang)}</td>
                {canDeleteRow && (
                  <td className="px-2 py-2 text-center">
                    <ConfirmButton label={t("delete")} confirmLabel={t("confirmQ")} onConfirm={() => onDeleteRow(r.id)} />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Login screen                                                            */
/* ---------------------------------------------------------------------- */

function LoginScreen({ lang, setLang, t, config, apartments, onLogin }) {
  const [role, setRole] = useState(null); // 'admin' | 'resident'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (role === "admin") {
      if (username === config.adminUsername && password === config.adminPassword) {
        onLogin({ role: "admin" });
        return;
      }
    } else {
      const apt = apartments.find(
        (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password
      );
      if (apt) {
        onLogin({ role: "resident", aptId: apt.id });
        return;
      }
    }
    setError(t("invalidCreds"));
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');`}</style>
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-sm"
          >
            <Globe size={15} /> {lang === "es" ? "English" : "Español"}
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
          <div className="flex items-center gap-2 text-teal-700 mb-1">
            <Building2 size={20} />
            <span className="text-sm font-medium tracking-wide">{config.residencialName}</span>
          </div>
          <h1 className="text-3xl text-stone-900 mb-1" style={{ fontFamily: "'Source Serif 4', serif" }}>{t("loginTitle")}</h1>
          <p className="text-stone-500 text-sm mb-6">{t("loginSubtitle")}</p>

          {!role ? (
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setRole("admin")}
                className="text-left rounded-xl border border-stone-200 p-4 hover:border-teal-600 hover:bg-teal-50/50 transition-colors"
              >
                <div className="font-semibold text-stone-900">{t("roleAdmin")}</div>
                <div className="text-sm text-stone-500">{t("roleAdminDesc")}</div>
              </button>
              <button
                onClick={() => setRole("resident")}
                className="text-left rounded-xl border border-stone-200 p-4 hover:border-teal-600 hover:bg-teal-50/50 transition-colors"
              >
                <div className="font-semibold text-stone-900">{t("roleResident")}</div>
                <div className="text-sm text-stone-500">{t("roleResidentDesc")}</div>
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t("username")}</label>
                <input
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t("password")}</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-2 top-2.5 text-stone-400">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-rose-600 text-sm">{error}</p>}
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="flex-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg py-2.5 font-medium transition-colors">
                  {t("signIn")}
                </button>
                <button
                  type="button"
                  onClick={() => { setRole(null); setError(""); setUsername(""); setPassword(""); }}
                  className="text-stone-500 hover:text-stone-800 text-sm px-2"
                >
                  {t("back")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Admin App                                                                */
/* ---------------------------------------------------------------------- */

function AdminApp({ lang, setLang, t, data, actions, onLogout }) {
  const [tab, setTab] = useState("overview");
  const { config, apartments, expenses, balance, reports } = data;
  const [saved, setSaved] = useState(false);
  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1500); };

  const tabs = [
    { key: "overview", label: t("overview"), icon: LayoutDashboard },
    { key: "apartments", label: t("apartments"), icon: Users },
    { key: "income", label: t("income"), icon: Wallet },
    { key: "expenses", label: t("expenses"), icon: ClipboardList },
    { key: "gas", label: t("gasSection"), icon: Flame },
    { key: "reports", label: t("reports"), icon: Send },
    { key: "finance", label: t("finance"), icon: ScrollText },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');`}</style>

      <aside className="w-60 shrink-0 bg-stone-900 text-stone-200 flex flex-col">
        <div className="px-5 py-6 border-b border-stone-800">
          <div className="flex items-center gap-2 text-teal-400 mb-1">
            <Building2 size={18} />
            <span className="text-xs uppercase tracking-wide">{t("roleAdmin")}</span>
          </div>
          <div className="font-semibold text-white leading-tight" style={{ fontFamily: "'Source Serif 4', serif" }}>
            {config.residencialName}
          </div>
        </div>
        <nav className="flex-1 py-3">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors ${
                tab === tb.key ? "bg-teal-700/90 text-white" : "text-stone-300 hover:bg-stone-800"
              }`}
            >
              <tb.icon size={16} /> {tb.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-800 space-y-2">
          <button onClick={() => setLang(lang === "es" ? "en" : "es")} className="flex items-center gap-2 text-stone-400 hover:text-white text-sm">
            <Globe size={14} /> {lang === "es" ? "English" : "Español"}
          </button>
          <button onClick={onLogout} className="flex items-center gap-2 text-stone-400 hover:text-white text-sm">
            <LogOut size={14} /> {t("logout")}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-x-auto">
        {tab === "overview" && <OverviewTab t={t} lang={lang} config={config} apartments={apartments} expenses={expenses} balance={balance} />}

        {tab === "apartments" && (
          <ApartmentsTab
            t={t} lang={lang} apartments={apartments}
            onSave={async (next) => { await actions.saveApartments(next); flashSaved(); }}
          />
        )}

        {tab === "income" && (
          <SectionHeader title={t("incomeMaintTitle")} saved={saved}>
            <GridSection
              t={t} lang={lang} months={config.months}
              rows={apartments.map((a) => ({ id: a.id, label: `${a.id}${a.residentName ? " · " + a.residentName : ""}`, amounts: a.maint }))}
              rowLabelHeader={t("apartment")}
              onCellChange={(id, month, value) => {
                const next = apartments.map((a) => a.id === id ? { ...a, maint: { ...a.maint, [month]: value === "" ? null : Number(value) } } : a);
                actions.saveApartments(next);
                flashSaved();
              }}
              onAddMonth={() => { actions.addMonth(); flashSaved(); }}
              addMonthLabel={t("addMonth")}
            />
          </SectionHeader>
        )}

        {tab === "expenses" && (
          <SectionHeader title={t("residentialExpenseTitle")} saved={saved}>
            <ExpenseGrid
              t={t} lang={lang} months={config.months}
              rows={expenses.residential.map((r) => ({ id: r.id, label: r.concept, amounts: r.amounts }))}
              onCellChange={(id, month, value) => {
                const next = {
                  ...expenses,
                  residential: expenses.residential.map((r) => r.id === id ? { ...r, amounts: { ...r.amounts, [month]: value === "" ? null : Number(value) } } : r),
                };
                actions.saveExpenses(next); flashSaved();
              }}
              onAddRow={(concept) => {
                const id = "res-" + Date.now();
                const next = { ...expenses, residential: [...expenses.residential, { id, concept, amounts: {} }] };
                actions.saveExpenses(next); flashSaved();
              }}
              onDeleteRow={(id) => {
                const next = { ...expenses, residential: expenses.residential.filter((r) => r.id !== id) };
                actions.saveExpenses(next); flashSaved();
              }}
              onAddMonth={() => { actions.addMonth(); flashSaved(); }}
            />
          </SectionHeader>
        )}

        {tab === "gas" && (
          <div className="space-y-10">
            <SectionHeader title={t("gasIncomeTitle")} saved={saved}>
              <GridSection
                t={t} lang={lang} months={config.months}
                rows={apartments.map((a) => ({ id: a.id, label: `${a.id}${a.residentName ? " · " + a.residentName : ""}`, amounts: a.gas }))}
                rowLabelHeader={t("apartment")}
                onCellChange={(id, month, value) => {
                  const next = apartments.map((a) => a.id === id ? { ...a, gas: { ...a.gas, [month]: value === "" ? null : Number(value) } } : a);
                  actions.saveApartments(next); flashSaved();
                }}
                onAddMonth={() => { actions.addMonth(); flashSaved(); }}
                addMonthLabel={t("addMonth")}
              />
            </SectionHeader>
            <SectionHeader title={t("gasExpenseTitle")} saved={false}>
              <ExpenseGrid
                t={t} lang={lang} months={config.months}
                rows={expenses.gas.map((r) => ({ id: r.id, label: r.concept, amounts: r.amounts }))}
                onCellChange={(id, month, value) => {
                  const next = { ...expenses, gas: expenses.gas.map((r) => r.id === id ? { ...r, amounts: { ...r.amounts, [month]: value === "" ? null : Number(value) } } : r) };
                  actions.saveExpenses(next); flashSaved();
                }}
                onAddRow={(concept) => {
                  const id = "gas-" + Date.now();
                  const next = { ...expenses, gas: [...expenses.gas, { id, concept, amounts: {} }] };
                  actions.saveExpenses(next); flashSaved();
                }}
                onDeleteRow={(id) => {
                  const next = { ...expenses, gas: expenses.gas.filter((r) => r.id !== id) };
                  actions.saveExpenses(next); flashSaved();
                }}
                onAddMonth={() => { actions.addMonth(); flashSaved(); }}
              />
            </SectionHeader>
          </div>
        )}

        {tab === "reports" && (
          <ReportsTab
            t={t} lang={lang} reports={reports} apartments={apartments}
            onDecide={async (id, decision) => { await actions.decideReport(id, decision); flashSaved(); }}
          />
        )}

        {tab === "finance" && (
          <FinanceTab
            t={t} lang={lang} config={config} apartments={apartments} expenses={expenses} balance={balance}
            onSaveBalance={async (next) => { await actions.saveBalance(next); flashSaved(); }}
          />
        )}
      </main>
    </div>
  );
}

function SectionHeader({ title, saved, children }) {
  return (
    <section>
      <div className="flex items-center mb-4">
        <h2 className="text-xl text-stone-900" style={{ fontFamily: "'Source Serif 4', serif" }}>{title}</h2>
        <SavedPing show={saved} />
      </div>
      {children}
    </section>
  );
}

function GridSection({ t, lang, months, rows, rowLabelHeader, onCellChange, onAddMonth, addMonthLabel }) {
  return (
    <div className="space-y-3">
      <MonthGridTable rows={rows} months={months} lang={lang} t={t} editable onCellChange={onCellChange} rowLabelHeader={rowLabelHeader} />
      <button onClick={onAddMonth} className="flex items-center gap-1.5 text-teal-700 hover:text-teal-900 text-sm font-medium">
        <Plus size={15} /> {addMonthLabel}
      </button>
    </div>
  );
}

function ExpenseGrid({ t, lang, months, rows, onCellChange, onAddRow, onDeleteRow, onAddMonth }) {
  const [newConcept, setNewConcept] = useState("");
  return (
    <div className="space-y-3">
      <MonthGridTable rows={rows} months={months} lang={lang} t={t} editable onCellChange={onCellChange} rowLabelHeader={t("concept")} canDeleteRow onDeleteRow={onDeleteRow} />
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={newConcept}
          onChange={(e) => setNewConcept(e.target.value)}
          placeholder={t("concept")}
          className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
        <button
          onClick={() => { if (newConcept.trim()) { onAddRow(newConcept.trim()); setNewConcept(""); } }}
          className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-3 py-1.5 text-sm font-medium"
        >
          <Plus size={14} /> {t("addConcept")}
        </button>
        <button onClick={onAddMonth} className="flex items-center gap-1.5 text-teal-700 hover:text-teal-900 text-sm font-medium ml-2">
          <Plus size={15} /> {t("addMonth")}
        </button>
      </div>
    </div>
  );
}

function OverviewTab({ t, lang, config, apartments, expenses, balance }) {
  const months = config.months;
  const totalMaint = apartments.reduce((s, a) => s + sumAmounts(a.maint, months), 0);
  const totalGasIn = apartments.reduce((s, a) => s + sumAmounts(a.gas, months), 0);
  const totalResExp = expenses.residential.reduce((s, r) => s + sumAmounts(r.amounts, months), 0);
  const totalGasExp = expenses.gas.reduce((s, r) => s + sumAmounts(r.amounts, months), 0);
  const totalIncome = totalMaint + totalGasIn;
  const totalExpense = totalResExp + totalGasExp;
  const totalPending = apartments.reduce((s, a) => s + (Number(a.pendingBalance) || 0), 0);

  const netAdjustment = balance.balanceAnterior + balance.ingresoGasAtrasado + balance.ingresosDeudasPendientes - balance.pagoExtraordinario;
  const fundsAvailable = netAdjustment + (totalIncome - totalExpense);

  const chartData = months.map((m) => {
    const inc = apartments.reduce((s, a) => s + (Number(a.maint[m]) || 0) + (Number(a.gas[m]) || 0), 0);
    const exp =
      expenses.residential.reduce((s, r) => s + (Number(r.amounts[m]) || 0), 0) +
      expenses.gas.reduce((s, r) => s + (Number(r.amounts[m]) || 0), 0);
    return { month: monthLabel(m, lang), Ingresos: Math.round(inc), Gastos: Math.round(exp), Neto: Math.round(inc - exp) };
  });

  return (
    <section>
      <h2 className="text-2xl text-stone-900 mb-1" style={{ fontFamily: "'Source Serif 4', serif" }}>{t("overview")}</h2>
      <p className="text-stone-500 text-sm mb-6">{t("overviewSubtitle")}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label={t("totalIncome")} value={fmt(totalIncome, lang)} tone="good" icon={ArrowUpRight} />
        <StatCard label={t("totalExpenses")} value={fmt(totalExpense, lang)} tone="bad" icon={ArrowDownRight} />
        <StatCard label={t("fundsAvailable")} value={fmt(fundsAvailable, lang)} tone={fundsAvailable >= 0 ? "good" : "bad"} icon={CircleDollarSign} />
        <StatCard label={t("pendingBalance")} value={fmt(totalPending, lang)} tone="bad" icon={Wallet} />
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-8">
        <h3 className="text-stone-700 font-medium mb-4">{t("monthlyTrend")}</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => fmt(v, lang)} />
              <Bar dataKey="Ingresos" fill={COLORS.income} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Gastos" fill={COLORS.expense} radius={[3, 3, 0, 0]} />
              <Line type="monotone" dataKey="Neto" stroke={COLORS.net} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        {t("securityNote")}
      </div>
    </section>
  );
}

function ApartmentsTab({ t, lang, apartments, onSave }) {
  const [showPw, setShowPw] = useState({});
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ id: "", residentName: "", username: "", password: "" });
  const [error, setError] = useState("");

  const update = (id, field, value) => {
    onSave(apartments.map((a) => a.id === id ? { ...a, [field]: value } : a));
  };

  const addApartment = () => {
    if (!form.id.trim() || !form.residentName.trim() || !form.username.trim() || !form.password.trim()) {
      setError(t("requiredFields")); return;
    }
    if (apartments.some((a) => a.username.toLowerCase() === form.username.trim().toLowerCase())) {
      setError(t("usernameTaken")); return;
    }
    onSave([...apartments, {
      id: form.id.trim(), residentName: form.residentName.trim(), username: form.username.trim(),
      password: form.password.trim(), pendingBalance: 0, maint: {}, gas: {},
    }]);
    setForm({ id: "", residentName: "", username: "", password: "" });
    setError(""); setAdding(false);
  };

  return (
    <section>
      <h2 className="text-xl text-stone-900 mb-4" style={{ fontFamily: "'Source Serif 4', serif" }}>{t("apartments")}</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mb-4">{t("securityNote")}</div>

      <div className="overflow-x-auto rounded-lg border border-stone-200 mb-4">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-900 text-stone-50">
            <tr>
              <th className="px-3 py-2.5 text-left font-medium">{t("apartment")}</th>
              <th className="px-3 py-2.5 text-left font-medium">{t("residentName")}</th>
              <th className="px-3 py-2.5 text-left font-medium">{t("username")}</th>
              <th className="px-3 py-2.5 text-left font-medium">{t("password")}</th>
              <th className="px-3 py-2.5 text-right font-medium">{t("pendingBalance")}</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {apartments.map((a, idx) => (
              <tr key={a.id} className={idx % 2 ? "bg-stone-50" : "bg-white"}>
                <td className="px-3 py-2 font-medium text-stone-800">{a.id}</td>
                <td className="px-3 py-2">
                  <input
                    defaultValue={a.residentName}
                    onBlur={(e) => update(a.id, "residentName", e.target.value)}
                    className="w-40 rounded border border-stone-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    defaultValue={a.username}
                    onBlur={(e) => update(a.id, "username", e.target.value)}
                    className="w-28 rounded border border-stone-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <input
                      type={showPw[a.id] ? "text" : "password"}
                      defaultValue={a.password}
                      onBlur={(e) => update(a.id, "password", e.target.value)}
                      className="w-28 rounded border border-stone-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <button onClick={() => setShowPw((s) => ({ ...s, [a.id]: !s[a.id] }))} className="text-stone-400 hover:text-stone-700">
                      {showPw[a.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  <input
                    type="number" step="0.01"
                    defaultValue={a.pendingBalance}
                    onBlur={(e) => update(a.id, "pendingBalance", Number(e.target.value) || 0)}
                    className="w-24 text-right rounded border border-stone-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  <ConfirmButton label={t("delete")} confirmLabel={t("confirmQ")} onConfirm={() => onSave(apartments.filter((x) => x.id !== a.id))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!adding ? (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-3 py-2 text-sm font-medium">
          <Plus size={15} /> {t("addApartment")}
        </button>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl p-4 max-w-xl">
          <h3 className="font-medium text-stone-800 mb-3">{t("createAccount")}</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input placeholder={t("aptId")} value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="rounded border border-stone-300 px-3 py-2" />
            <input placeholder={t("residentName")} value={form.residentName} onChange={(e) => setForm({ ...form, residentName: e.target.value })} className="rounded border border-stone-300 px-3 py-2" />
            <input placeholder={t("username")} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="rounded border border-stone-300 px-3 py-2" />
            <input placeholder={t("password")} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded border border-stone-300 px-3 py-2" />
          </div>
          {error && <p className="text-rose-600 text-sm mb-2">{error}</p>}
          <div className="flex gap-2">
            <button onClick={addApartment} className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-4 py-2 text-sm font-medium">{t("createAccount")}</button>
            <button onClick={() => { setAdding(false); setError(""); }} className="text-stone-500 hover:text-stone-800 text-sm px-2">{t("cancel")}</button>
          </div>
        </div>
      )}
    </section>
  );
}

function ReportsTab({ t, lang, reports, apartments, onDecide }) {
  const aptLabel = (id) => { const a = apartments.find((x) => x.id === id); return a ? `${a.id}${a.residentName ? " · " + a.residentName : ""}` : id; };
  const sorted = [...reports].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <section>
      <h2 className="text-xl text-stone-900 mb-4" style={{ fontFamily: "'Source Serif 4', serif" }}>{t("reports")}</h2>
      {sorted.length === 0 ? (
        <p className="text-stone-500 text-sm">{t("noReports")}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-200">
          <table className="min-w-full text-sm">
            <thead className="bg-stone-900 text-stone-50">
              <tr>
                <th className="px-3 py-2.5 text-left font-medium">{t("apartment")}</th>
                <th className="px-3 py-2.5 text-left font-medium">{t("type")}</th>
                <th className="px-3 py-2.5 text-left font-medium">{t("month")}</th>
                <th className="px-3 py-2.5 text-right font-medium">{t("amount")}</th>
                <th className="px-3 py-2.5 text-left font-medium">{t("note")}</th>
                <th className="px-3 py-2.5 text-left font-medium">{t("status")}</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, idx) => (
                <tr key={r.id} className={idx % 2 ? "bg-stone-50" : "bg-white"}>
                  <td className="px-3 py-2 font-medium text-stone-800">{aptLabel(r.aptId)}</td>
                  <td className="px-3 py-2 text-stone-600">{r.type === "gas" ? t("gasSection") : t("maintenance")}</td>
                  <td className="px-3 py-2 text-stone-600">{monthLabel(r.month, lang)}</td>
                  <td className="px-3 py-2 text-right font-medium text-stone-800">{fmt(r.amount, lang)}</td>
                  <td className="px-3 py-2 text-stone-500 max-w-[220px] truncate" title={r.note}>{r.note || "—"}</td>
                  <td className="px-3 py-2"><StatusBadge status={r.status} t={t} /></td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {r.status === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => onDecide(r.id, "approved")} className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 text-xs font-medium">
                          <Check size={13} /> {t("approve")}
                        </button>
                        <button onClick={() => onDecide(r.id, "rejected")} className="flex items-center gap-1 text-rose-600 hover:text-rose-800 text-xs font-medium">
                          <X size={13} /> {t("reject")}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function FinanceTab({ t, lang, config, apartments, expenses, balance, onSaveBalance }) {
  const months = config.months;
  const totalMaint = apartments.reduce((s, a) => s + sumAmounts(a.maint, months), 0);
  const totalGasIn = apartments.reduce((s, a) => s + sumAmounts(a.gas, months), 0);
  const totalResExp = expenses.residential.reduce((s, r) => s + sumAmounts(r.amounts, months), 0);
  const totalGasExp = expenses.gas.reduce((s, r) => s + sumAmounts(r.amounts, months), 0);
  const netAdjustment = balance.balanceAnterior + balance.ingresoGasAtrasado + balance.ingresosDeudasPendientes - balance.pagoExtraordinario;
  const fundsAvailable = netAdjustment + (totalMaint + totalGasIn) - (totalResExp + totalGasExp);

  const field = (key, label) => (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <input
        type="number" step="0.01"
        defaultValue={balance[key]}
        onBlur={(e) => onSaveBalance({ ...balance, [key]: Number(e.target.value) || 0 })}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
      />
    </div>
  );

  return (
    <section>
      <h2 className="text-xl text-stone-900 mb-4" style={{ fontFamily: "'Source Serif 4', serif" }}>{t("finance")}</h2>
      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mb-8">
        {field("balanceAnterior", t("previousBalance"))}
        {field("ingresoGasAtrasado", t("lateGasIncome"))}
        {field("ingresosDeudasPendientes", t("pendingDebtsIncome"))}
        {field("pagoExtraordinario", t("extraordinaryPayment"))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
        <StatCard label={t("totalPaidMaint")} value={fmt(totalMaint, lang)} />
        <StatCard label={t("totalPaidGas")} value={fmt(totalGasIn, lang)} />
        <StatCard label={t("totalExpenses")} value={fmt(totalResExp + totalGasExp, lang)} tone="bad" />
        <StatCard label={t("fundsAvailable")} value={fmt(fundsAvailable, lang)} tone={fundsAvailable >= 0 ? "good" : "bad"} />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Resident App                                                            */
/* ---------------------------------------------------------------------- */

function ResidentApp({ lang, setLang, t, data, actions, onLogout, aptId }) {
  const [tab, setTab] = useState("myOverview");
  const { config, apartments, reports } = data;
  const apt = apartments.find((a) => a.id === aptId);
  const myReports = reports.filter((r) => r.aptId === aptId).sort((a, b) => (a.date < b.date ? 1 : -1));

  if (!apt) return null;

  const totalMaint = sumAmounts(apt.maint, config.months);
  const totalGas = sumAmounts(apt.gas, config.months);

  const tabs = [
    { key: "myOverview", label: t("myOverview") },
    { key: "reportPayment", label: t("reportPayment") },
    { key: "myReports", label: t("myReports") },
  ];

  return (
    <div className="min-h-screen bg-stone-100" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');`}</style>

      <header className="bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs uppercase tracking-wide mb-0.5">
              <Building2 size={14} /> {config.residencialName}
            </div>
            <div className="font-semibold" style={{ fontFamily: "'Source Serif 4', serif" }}>
              {t("welcome")}, {apt.residentName || apt.id} · {t("apartment")} {apt.id}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === "es" ? "en" : "es")} className="flex items-center gap-1.5 text-stone-300 hover:text-white text-sm">
              <Globe size={15} /> {lang === "es" ? "EN" : "ES"}
            </button>
            <button onClick={onLogout} className="flex items-center gap-1.5 text-stone-300 hover:text-white text-sm">
              <LogOut size={15} /> {t("logout")}
            </button>
          </div>
        </div>
        <nav className="max-w-4xl mx-auto px-6 flex gap-1 border-t border-stone-800">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
                tab === tb.key ? "border-teal-400 text-white" : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {tab === "myOverview" && (
          <section>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard label={t("pendingBalance")} value={fmt(apt.pendingBalance, lang)} tone={apt.pendingBalance > 0 ? "bad" : "good"} icon={Wallet} />
              <StatCard label={t("totalPaidMaint")} value={fmt(totalMaint, lang)} tone="good" />
              <StatCard label={t("totalPaidGas")} value={fmt(totalGas, lang)} tone="good" />
            </div>

            <h3 className="text-lg text-stone-900 mb-2" style={{ fontFamily: "'Source Serif 4', serif" }}>{t("myPaymentsMaint")}</h3>
            <MonthGridTable rows={[{ id: apt.id, label: t("maintenance"), amounts: apt.maint }]} months={config.months} lang={lang} t={t} editable={false} rowLabelHeader={t("concept")} />

            <h3 className="text-lg text-stone-900 mt-8 mb-2" style={{ fontFamily: "'Source Serif 4', serif" }}>{t("myPaymentsGas")}</h3>
            <MonthGridTable rows={[{ id: apt.id, label: t("gasSection"), amounts: apt.gas }]} months={config.months} lang={lang} t={t} editable={false} rowLabelHeader={t("concept")} />
          </section>
        )}

        {tab === "reportPayment" && (
          <ReportPaymentForm t={t} months={config.months} lang={lang} onSubmit={(payload) => actions.submitReport({ ...payload, aptId: apt.id })} />
        )}

        {tab === "myReports" && (
          <section>
            <h2 className="text-xl text-stone-900 mb-4" style={{ fontFamily: "'Source Serif 4', serif" }}>{t("myReports")}</h2>
            {myReports.length === 0 ? (
              <p className="text-stone-500 text-sm">{t("noReports")}</p>
            ) : (
              <div className="space-y-3">
                {myReports.map((r) => (
                  <div key={r.id} className="bg-white border border-stone-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-stone-800">
                        {r.type === "gas" ? t("gasSection") : t("maintenance")} · {monthLabel(r.month, lang)}
                      </div>
                      <div className="text-sm text-stone-500">{fmt(r.amount, lang)}{r.note ? " — " + r.note : ""}</div>
                    </div>
                    <StatusBadge status={r.status} t={t} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function ReportPaymentForm({ t, months, lang, onSubmit }) {
  const [type, setType] = useState("maint");
  const [month, setMonth] = useState(months[months.length - 1]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onSubmit({ type, month, amount: Number(amount), note: note.trim() });
    setDone(true);
    setAmount(""); setNote("");
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <section className="max-w-md">
      <h2 className="text-xl text-stone-900 mb-4" style={{ fontFamily: "'Source Serif 4', serif" }}>{t("reportNewPayment")}</h2>
      <form onSubmit={submit} className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{t("type")}</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600">
            <option value="maint">{t("maintenance")}</option>
            <option value="gas">{t("gasSection")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{t("month")}</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600">
            {months.map((m) => <option key={m} value={m}>{monthLabel(m, lang)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{t("amount")}</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{t("note")} <span className="text-stone-400">({t("optional")})</span></label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" />
        </div>
        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg py-2.5 font-medium">
          <Send size={15} /> {t("submit")}
        </button>
        {done && <p className="text-emerald-700 text-sm text-center">{t("reportSubmitted")}</p>}
      </form>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Root App                                                                */
/* ---------------------------------------------------------------------- */

export default function App() {
  const [lang, setLang] = useState(detectLang());
  const t = useT(lang);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const [config, setConfig] = useState(null);
  const [apartments, setApartments] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    (async () => {
      const [c, a, e, b, r] = await Promise.all([
        loadKey("config", CONFIG_SEED),
        loadKey("apartments", buildApartmentsSeed()),
        loadKey("expenses", buildExpensesSeed()),
        loadKey("balance", BALANCE_SEED),
        loadKey("reports", []),
      ]);
      setConfig(c); setApartments(a); setExpenses(e); setBalance(b); setReports(r);
      setLoading(false);
    })();
  }, []);

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center text-stone-500" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {t("loading")}
      </div>
    );
  }

  const actions = {
    saveApartments: async (next) => { setApartments(next); await saveKey("apartments", next); },
    saveExpenses: async (next) => { setExpenses(next); await saveKey("expenses", next); },
    saveBalance: async (next) => { setBalance(next); await saveKey("balance", next); },
    addMonth: async () => {
      const nm = nextMonthKey(config.months);
      if (config.months.includes(nm)) return;
      const next = { ...config, months: [...config.months, nm] };
      setConfig(next); await saveKey("config", next);
    },
    submitReport: async (payload) => {
      const report = { id: "r-" + Date.now(), status: "pending", date: new Date().toISOString(), ...payload };
      const next = [...reports, report];
      setReports(next); await saveKey("reports", next);
    },
    decideReport: async (id, decision) => {
      const report = reports.find((r) => r.id === id);
      if (!report) return;
      const nextReports = reports.map((r) => r.id === id ? { ...r, status: decision } : r);
      setReports(nextReports); await saveKey("reports", nextReports);

      if (decision === "approved") {
        const nextApartments = apartments.map((a) => {
          if (a.id !== report.aptId) return a;
          const field = report.type === "gas" ? "gas" : "maint";
          const current = Number(a[field][report.month]) || 0;
          return {
            ...a,
            [field]: { ...a[field], [report.month]: current + report.amount },
            pendingBalance: Math.max(0, (Number(a.pendingBalance) || 0) - report.amount),
          };
        });
        setApartments(nextApartments); await saveKey("apartments", nextApartments);
      }
    },
  };

  const data = { config, apartments, expenses, balance, reports };

  if (!session) {
    return <LoginScreen lang={lang} setLang={setLang} t={t} config={config} apartments={apartments} onLogin={setSession} />;
  }

  if (session.role === "admin") {
    return <AdminApp lang={lang} setLang={setLang} t={t} data={data} actions={actions} onLogout={() => setSession(null)} />;
  }

  return <ResidentApp lang={lang} setLang={setLang} t={t} data={data} actions={actions} onLogout={() => setSession(null)} aptId={session.aptId} />;
}
