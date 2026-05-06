'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

// ─────────────────────────────────────────────────────────────────────────────
// Business & Entrepreneur Tools — 5 Kuwait-focused calculators
// Embedded in the About page as a free-tools section.
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared UI ────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] tracking-widest uppercase text-ink-muted mb-1">
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
  prefix,
  min = 0,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  min?: number;
}) {
  return (
    <div className="flex items-center border border-cream-400 rounded-md bg-cream-50 overflow-hidden focus-within:border-emerald-700 transition-colors">
      {prefix && (
        <span className="px-3 text-xs text-ink-muted bg-cream-200 self-stretch flex items-center border-e border-cream-400">
          {prefix}
        </span>
      )}
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent px-3 py-2 text-sm text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-cream-400 rounded-md bg-cream-50 px-3 py-2 text-sm text-ink outline-none focus:border-emerald-700 transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 border-b border-cream-400 last:border-b-0 ${highlight ? 'font-medium' : ''}`}
    >
      <p className={`text-sm ${highlight ? 'text-emerald-700' : 'text-ink'}`}>{label}</p>
      <p
        className={`text-sm font-mono ${
          highlight ? 'text-emerald-700 font-semibold text-base' : 'text-ink'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ResultCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 bg-cream-100 border border-cream-400 rounded-card p-5">
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-6 bg-cream-100 border border-dashed border-cream-400 rounded-card p-6 text-center">
      <p className="text-sm text-ink-muted">{text}</p>
    </div>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-KW', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(n);
}

// ── Calculator 1 — End-of-Service Gratuity ───────────────────────────────────

function GratuityCalc() {
  const [salary, setSalary] = useState('');
  const [years, setYears] = useState('');
  const [reason, setReason] = useState('end');

  const s = parseFloat(salary) || 0;
  const y = parseFloat(years) || 0;

  const calc = () => {
    if (s <= 0 || y < 1) return null;

    const dailyRate = s / 26; // Kuwaiti private sector uses 26 working days

    // Base entitlement (Labour Law No. 6/2010)
    let base = 0;
    if (y <= 5) {
      base = 15 * dailyRate * y;
    } else {
      base = 15 * dailyRate * 5 + s * (y - 5); // 1 month per year beyond 5
    }

    // Resignation multiplier
    let mult = 1;
    if (reason === 'resign') {
      if (y < 3) mult = 0.5;
      else if (y < 5) mult = 0.75;
      else mult = 1;
    }

    const total = base * mult;
    const annualLeave = (s / 26) * 30; // 30 days annual leave provision
    return { base, total, annualLeave, dailyRate };
  };

  const result = calc();

  return (
    <div>
      <p className="text-[13px] leading-[1.7] text-ink-muted mb-5">
        Calculates end-of-service gratuity under Kuwait Labour Law No. 6/2010 (Private Sector).
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Monthly Basic Salary (KD)</Label>
          <NumberInput value={salary} onChange={setSalary} placeholder="e.g. 600" prefix="KD" />
        </div>
        <div>
          <Label>Years of Service</Label>
          <NumberInput value={years} onChange={setYears} placeholder="e.g. 4.5" />
        </div>
        <div className="sm:col-span-2">
          <Label>Reason for Leaving</Label>
          <Select
            value={reason}
            onChange={setReason}
            options={[
              { value: 'end', label: 'Contract End / Dismissal without cause' },
              { value: 'resign', label: 'Voluntary Resignation' },
            ]}
          />
        </div>
      </div>

      {result ? (
        <ResultCard>
          <p className="eyebrow mb-3">Gratuity Estimate</p>
          <ResultRow label="Daily Rate" value={`KD ${fmt(result.dailyRate)}`} />
          <ResultRow label="Base Entitlement" value={`KD ${fmt(result.base)}`} />
          {reason === 'resign' && parseFloat(years) < 5 && (
            <ResultRow
              label={`Resignation Reduction (${parseFloat(years) < 3 ? '50%' : '75%'})`}
              value={`− KD ${fmt(result.base - result.total)}`}
            />
          )}
          <ResultRow label="Total Gratuity Due" value={`KD ${fmt(result.total)}`} highlight />
          <p className="text-[11px] text-ink-muted mt-3">
            * Based on basic salary only. Allowances are excluded unless stipulated in the contract.
            Consult a legal advisor for precise entitlements.
          </p>
        </ResultCard>
      ) : (
        <EmptyState text="Enter salary and years of service to calculate gratuity." />
      )}
    </div>
  );
}

// ── Calculator 2 — Employee Total Cost ───────────────────────────────────────

function EmployeeCostCalc() {
  const [salary, setSalary] = useState('');
  const [headcount, setHeadcount] = useState('1');
  const [nationality, setNationality] = useState('expat');

  const s = parseFloat(salary) || 0;
  const n = parseInt(headcount) || 1;

  const calc = () => {
    if (s <= 0) return null;

    // PIFSS — Private sector Kuwaiti nationals only
    const pifssEmployer = nationality === 'kuwaiti' ? s * 0.115 : 0;

    // Annual leave provision — 30 days / year → monthly accrual
    const leaveProvision = (s / 26) * 30 / 12;

    // Gratuity provision — 15 days/year for first 5 yrs ≈ monthly accrual
    const gratuityProvision = (s / 26) * 15 / 12;

    const totalPerEmployee = s + pifssEmployer + leaveProvision + gratuityProvision;
    const totalAll = totalPerEmployee * n;

    return { pifssEmployer, leaveProvision, gratuityProvision, totalPerEmployee, totalAll };
  };

  const result = calc();

  return (
    <div>
      <p className="text-[13px] leading-[1.7] text-ink-muted mb-5">
        Total monthly cost to employer including PIFSS (for Kuwaitis), leave, and gratuity accrual.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Monthly Basic Salary (KD)</Label>
          <NumberInput value={salary} onChange={setSalary} placeholder="e.g. 500" prefix="KD" />
        </div>
        <div>
          <Label>Number of Employees</Label>
          <NumberInput value={headcount} onChange={setHeadcount} placeholder="1" min={1} />
        </div>
        <div className="sm:col-span-2">
          <Label>Nationality</Label>
          <Select
            value={nationality}
            onChange={setNationality}
            options={[
              { value: 'expat', label: 'Expatriate (no PIFSS)' },
              { value: 'kuwaiti', label: 'Kuwaiti National (PIFSS 11.5%)' },
            ]}
          />
        </div>
      </div>

      {result ? (
        <ResultCard>
          <p className="eyebrow mb-3">Monthly Cost Per Employee</p>
          <ResultRow label="Basic Salary" value={`KD ${fmt(s)}`} />
          {nationality === 'kuwaiti' && (
            <ResultRow label="PIFSS (Employer 11.5%)" value={`KD ${fmt(result.pifssEmployer)}`} />
          )}
          <ResultRow label="Annual Leave Accrual" value={`KD ${fmt(result.leaveProvision)}`} />
          <ResultRow label="Gratuity Accrual" value={`KD ${fmt(result.gratuityProvision)}`} />
          <ResultRow label="Total Per Employee / Month" value={`KD ${fmt(result.totalPerEmployee)}`} highlight />
          {n > 1 && (
            <ResultRow label={`Total for ${n} Employees / Month`} value={`KD ${fmt(result.totalAll)}`} highlight />
          )}
        </ResultCard>
      ) : (
        <EmptyState text="Enter salary to see the full cost breakdown." />
      )}
    </div>
  );
}

// ── Calculator 3 — Company Setup Cost ────────────────────────────────────────

type EntityType = 'wll' | 'sole' | 'foreign' | 'holding';

const ENTITY_DATA: Record<EntityType, { label: string; min: number; max: number; notes: string[] }> = {
  wll: {
    label: 'Limited Liability Company (WLL)',
    min: 1500,
    max: 4500,
    notes: [
      'Minimum share capital: KD 1,000 (waived for some sectors)',
      'Ministry of Commerce registration + Commercial Court authentication',
      'Chamber of Commerce membership',
      'Municipal license',
    ],
  },
  sole: {
    label: 'Sole Trader / Individual Establishment',
    min: 400,
    max: 1200,
    notes: [
      'Kuwaiti national or sponsored expat only',
      'Simpler registration, no share capital required',
      'Municipal license and Chamber membership required',
    ],
  },
  foreign: {
    label: 'Foreign Company Branch',
    min: 3000,
    max: 8000,
    notes: [
      'Requires local agent or government project',
      'Central Bank / MOCI approval for regulated sectors',
      'Annual renewal fees apply',
    ],
  },
  holding: {
    label: 'Holding / Shareholding Company (KSCC)',
    min: 8000,
    max: 25000,
    notes: [
      'Minimum capital: KD 250,000',
      'Capital Markets Authority involvement for public companies',
      'Legal and audit fees significant',
    ],
  },
};

function SetupCostCalc() {
  const [entity, setEntity] = useState<EntityType>('wll');
  const [sector, setSector] = useState('general');

  const d = ENTITY_DATA[entity];
  const sectorMult = sector === 'financial' ? 1.4 : sector === 'real_estate' ? 1.2 : 1;
  const min = Math.round(d.min * sectorMult);
  const max = Math.round(d.max * sectorMult);

  return (
    <div>
      <p className="text-[13px] leading-[1.7] text-ink-muted mb-5">
        Estimated government fees and professional costs for setting up a company in Kuwait.
        Does not include premises rental or staffing.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label>Entity Type</Label>
          <Select
            value={entity}
            onChange={(v) => setEntity(v as EntityType)}
            options={Object.entries(ENTITY_DATA).map(([k, v]) => ({ value: k, label: v.label }))}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Business Sector</Label>
          <Select
            value={sector}
            onChange={setSector}
            options={[
              { value: 'general', label: 'General / Trading / Services' },
              { value: 'real_estate', label: 'Real Estate' },
              { value: 'financial', label: 'Financial Services / Fintech' },
            ]}
          />
        </div>
      </div>

      <ResultCard>
        <p className="eyebrow mb-3">Estimated Setup Cost</p>
        <ResultRow label="Entity" value={d.label} />
        <ResultRow
          label="Estimated Range"
          value={`KD ${fmt(min)} – KD ${fmt(max)}`}
          highlight
        />
        <div className="mt-4 pt-4 border-t border-cream-400">
          <p className="text-[11px] tracking-widest uppercase text-ink-muted mb-3">What's Included</p>
          <ul className="space-y-1">
            {d.notes.map((note, i) => (
              <li key={i} className="flex gap-2 text-[12.5px] leading-[1.6] text-ink">
                <span className="text-gold-400 mt-0.5 shrink-0">—</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[11px] text-ink-muted mt-3">
          * Fees change periodically. Always confirm with a licensed law firm or business setup service.
        </p>
      </ResultCard>
    </div>
  );
}

// ── Calculator 4 — Kuwaitization Compliance ──────────────────────────────────

const SECTOR_QUOTAS: Record<string, { label: string; quota: number; penalty: string }> = {
  banking: { label: 'Banking & Finance', quota: 0.60, penalty: 'CBK licence review + fines' },
  insurance: { label: 'Insurance', quota: 0.40, penalty: 'MOC penalties' },
  telecom: { label: 'Telecommunications', quota: 0.40, penalty: 'CITRA fines' },
  oil: { label: 'Oil & Gas (support)', quota: 0.35, penalty: 'Contract termination risk' },
  private: { label: 'General Private Sector', quota: 0.15, penalty: 'Work permit restrictions' },
  retail: { label: 'Retail & FMCG', quota: 0.20, penalty: 'MOC penalties + permit hold' },
};

function KuwaitizationCalc() {
  const [total, setTotal] = useState('');
  const [kuwaiti, setKuwaiti] = useState('');
  const [sector, setSector] = useState('private');

  const t = parseInt(total) || 0;
  const k = parseInt(kuwaiti) || 0;
  const { quota, penalty } = SECTOR_QUOTAS[sector];

  const currentRatio = t > 0 ? k / t : 0;
  const required = Math.ceil(t * quota);
  const gap = Math.max(0, required - k);
  const compliant = k >= required;

  return (
    <div>
      <p className="text-[13px] leading-[1.7] text-ink-muted mb-5">
        Check your Nationalization ratio against Kuwait's sector-specific Kuwaitization targets.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Total Employees</Label>
          <NumberInput value={total} onChange={setTotal} placeholder="e.g. 80" min={1} />
        </div>
        <div>
          <Label>Kuwaiti Nationals</Label>
          <NumberInput value={kuwaiti} onChange={setKuwaiti} placeholder="e.g. 12" />
        </div>
        <div className="sm:col-span-2">
          <Label>Sector</Label>
          <Select
            value={sector}
            onChange={setSector}
            options={Object.entries(SECTOR_QUOTAS).map(([k, v]) => ({ value: k, label: v.label }))}
          />
        </div>
      </div>

      {t > 0 && k >= 0 ? (
        <ResultCard>
          <p className="eyebrow mb-3">Compliance Status</p>
          <ResultRow
            label="Current Ratio"
            value={`${(currentRatio * 100).toFixed(1)}%`}
          />
          <ResultRow label="Required Ratio" value={`${(quota * 100).toFixed(0)}%`} />
          <ResultRow label="Required Kuwaitis" value={`${required} employees`} />
          <div className={`flex items-center justify-between py-3 mt-1 rounded-md px-3 ${compliant ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <p className={`text-sm font-medium ${compliant ? 'text-emerald-700' : 'text-red-600'}`}>
              {compliant ? '✓ Compliant' : `✗ Short by ${gap} Kuwaiti ${gap === 1 ? 'employee' : 'employees'}`}
            </p>
            {!compliant && (
              <p className="text-[11px] text-red-500">{penalty}</p>
            )}
          </div>
          {!compliant && (
            <p className="text-[11px] text-ink-muted mt-3">
              You need to hire {gap} more Kuwaiti {gap === 1 ? 'national' : 'nationals'} to meet the {SECTOR_QUOTAS[sector].label} quota.
            </p>
          )}
        </ResultCard>
      ) : (
        <EmptyState text="Enter headcount to check your Kuwaitization compliance." />
      )}
    </div>
  );
}

// ── Calculator 5 — Startup Runway ────────────────────────────────────────────

function RunwayCalc() {
  const [capital, setCapital] = useState('');
  const [burn, setBurn] = useState('');
  const [revenue, setRevenue] = useState('');
  const [growth, setGrowth] = useState('0');

  const c = parseFloat(capital) || 0;
  const b = parseFloat(burn) || 0;
  const r = parseFloat(revenue) || 0;
  const g = parseFloat(growth) / 100 || 0;

  const calc = () => {
    if (c <= 0 || b <= 0) return null;

    const netBurn = b - r;

    if (netBurn <= 0) {
      return { runway: Infinity, breakEven: 0, months: [] as { month: number; cash: number; rev: number }[] };
    }

    // Project month by month
    const months: { month: number; cash: number; rev: number }[] = [];
    let cash = c;
    let rev = r;
    let breakEven = -1;

    for (let m = 1; m <= 60; m++) {
      rev = rev * (1 + g);
      const net = b - rev;
      cash -= Math.max(0, net);
      months.push({ month: m, cash, rev });
      if (breakEven === -1 && rev >= b) breakEven = m;
      if (cash <= 0) break;
    }

    const runway = months.filter((m) => m.cash > 0).length;
    return { runway, breakEven, months };
  };

  const result = calc();

  const runwayLabel =
    result == null
      ? null
      : result.runway === Infinity
      ? 'Already profitable'
      : result.runway >= 60
      ? '60+ months'
      : `${result.runway} months`;

  const dangerZone = result && result.runway !== Infinity && result.runway < 6;

  return (
    <div>
      <p className="text-[13px] leading-[1.7] text-ink-muted mb-5">
        How long can your startup survive? Project your runway and find your break-even point.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Starting Capital (KD)</Label>
          <NumberInput value={capital} onChange={setCapital} placeholder="e.g. 50,000" prefix="KD" />
        </div>
        <div>
          <Label>Monthly Burn Rate (KD)</Label>
          <NumberInput value={burn} onChange={setBurn} placeholder="e.g. 4,000" prefix="KD" />
        </div>
        <div>
          <Label>Current Monthly Revenue (KD)</Label>
          <NumberInput value={revenue} onChange={setRevenue} placeholder="e.g. 1,000" prefix="KD" />
        </div>
        <div>
          <Label>Monthly Revenue Growth (%)</Label>
          <NumberInput value={growth} onChange={setGrowth} placeholder="e.g. 5" prefix="%" />
        </div>
      </div>

      {result ? (
        <ResultCard>
          <p className="eyebrow mb-3">Runway Projection</p>
          <ResultRow label="Net Monthly Burn" value={`KD ${fmt(Math.max(0, b - r))}`} />
          {result.breakEven > 0 && (
            <ResultRow label="Break-even" value={`Month ${result.breakEven}`} />
          )}
          {result.breakEven === 0 && r > 0 && (
            <ResultRow label="Break-even" value="Already profitable" />
          )}
          <div
            className={`flex items-center justify-between py-3 mt-1 rounded-md px-3 ${
              dangerZone ? 'bg-red-50' : result.runway === Infinity ? 'bg-emerald-50' : 'bg-cream-200'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                dangerZone ? 'text-red-600' : result.runway === Infinity ? 'text-emerald-700' : 'text-ink'
              }`}
            >
              {dangerZone ? '⚠ Danger Zone — ' : result.runway === Infinity ? '✓ ' : ''}
              Runway: {runwayLabel}
            </p>
          </div>
          {dangerZone && (
            <p className="text-[11px] text-red-500 mt-2">
              Less than 6 months of runway. Start fundraising or cut costs immediately.
            </p>
          )}
          <p className="text-[11px] text-ink-muted mt-3">
            * Assumes constant burn rate with the specified revenue growth rate. Actual results will vary.
          </p>
        </ResultCard>
      ) : (
        <EmptyState text="Enter your capital and monthly burn to calculate runway." />
      )}
    </div>
  );
}

// ── Tab Shell ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'gratuity', label: 'End-of-Service', arLabel: 'مكافأة الخدمة', component: GratuityCalc },
  { id: 'cost', label: 'Employee Cost', arLabel: 'تكلفة الموظف', component: EmployeeCostCalc },
  { id: 'setup', label: 'Setup Cost', arLabel: 'تكلفة التأسيس', component: SetupCostCalc },
  { id: 'kuwaitization', label: 'Kuwaitization', arLabel: 'الكويتة', component: KuwaitizationCalc },
  { id: 'runway', label: 'Startup Runway', arLabel: 'مسار الشركة', component: RunwayCalc },
] as const;

export default function BusinessTools() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('gratuity');

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component ?? GratuityCalc;

  return (
    <section className="bg-cream-50 border border-cream-400 rounded-[12px] p-8 md:p-12 mb-4">
      {/* Header */}
      <div className="w-10 h-px bg-gold-400 mb-4" />
      <p className="eyebrow mb-4">
        {isAr ? 'أدوات مجانية' : 'Free Tools'}
      </p>
      <h2 className={`font-serif text-3xl md:text-[32px] leading-tight text-emerald-700 font-medium mb-2 max-w-2xl ${isAr ? 'font-serif-ar' : ''}`}>
        {isAr ? 'حاسبات الأعمال الكويتية' : 'Kuwait Business Calculators'}
      </h2>
      <p className="text-sm leading-[1.7] text-ink-muted max-w-xl mb-8">
        {isAr
          ? 'أدوات عملية للمديرين ورجال الأعمال والمؤسسين في الكويت والخليج.'
          : 'Practical tools for managers, business owners, and founders operating in Kuwait and the Gulf.'}
      </p>

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap mb-6 border-b border-cream-400 pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium rounded-t-md transition-colors border border-b-0 ${
              activeTab === tab.id
                ? 'bg-emerald-700 text-cream-50 border-emerald-700'
                : 'bg-cream-50 text-ink-muted border-cream-300 hover:border-emerald-700 hover:text-emerald-700'
            }`}
          >
            {isAr ? tab.arLabel : tab.label}
          </button>
        ))}
      </div>

      {/* Active calculator */}
      <div className="min-h-[300px]">
        <ActiveComponent />
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-ink-muted mt-8 border-t border-cream-400 pt-4">
        {isAr
          ? 'هذه الأدوات للإرشاد فقط. استشر محامياً أو مستشاراً قانونياً للحصول على نصائح ملزمة.'
          : 'These tools are for guidance only and do not constitute legal or financial advice. Results should be verified with a qualified professional.'}
      </p>
    </section>
  );
}
