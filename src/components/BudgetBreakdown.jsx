import { useState, useMemo, useEffect } from 'react';
import {
  Plane,
  Building2,
  Utensils,
  Train,
  Ticket,
  ShoppingBag,
  AlertTriangle,
  Sparkles,
  PieChart,
  Sliders,
  List,
  Users,
  Calendar,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  TrendingDown,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import '../styles/BudgetBreakdown.css';

// Currency exchange rates relative to INR
const FX_RATES = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.0116, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.0108, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0091, label: 'GBP (£)' },
  AED: { symbol: 'AED ', rate: 0.0427, label: 'AED (د.إ)' },
  JPY: { symbol: '¥', rate: 1.72, label: 'JPY (¥)' },
};

const CATEGORIES = [
  {
    key: 'flights',
    label: 'Flights & Airfare',
    subLabel: 'Roundtrip, baggage & taxes',
    color: '#2563eb',
    bgLight: '#eff6ff',
    icon: Plane,
    subItems: [
      { id: 'f1', name: 'Main Cabin Roundtrip Tickets', priceRatio: 0.82, fixed: true },
      { id: 'f2', name: 'Checked Baggage Allowance (20kg)', priceRatio: 0.10, defaultChecked: true },
      { id: 'f3', name: 'Seat Selection & Airport Taxes', priceRatio: 0.08, defaultChecked: true },
    ],
  },
  {
    key: 'hotels',
    label: 'Hotels & Accommodation',
    subLabel: 'Curated stays & city taxes',
    color: '#7c3aed',
    bgLight: '#f5f3ff',
    icon: Building2,
    subItems: [
      { id: 'h1', name: 'Selected Stays / Boutique Hotel', priceRatio: 0.78, fixed: true },
      { id: 'h2', name: 'Daily Breakfast Buffet Package', priceRatio: 0.14, defaultChecked: true },
      { id: 'h3', name: 'Municipal Tourism & City Tax', priceRatio: 0.08, defaultChecked: true },
    ],
  },
  {
    key: 'food',
    label: 'Food & Gourmet Dining',
    subLabel: 'Dinners, street eats & cafes',
    color: '#059669',
    bgLight: '#ecfdf5',
    icon: Utensils,
    subItems: [
      { id: 'fd1', name: 'Curated Dinners & Signature Dining', priceRatio: 0.55, fixed: true },
      { id: 'fd2', name: 'Street Food & Artisan Markets', priceRatio: 0.30, defaultChecked: true },
      { id: 'fd3', name: 'Cafes, Snacks & Refreshments', priceRatio: 0.15, defaultChecked: true },
    ],
  },
  {
    key: 'transport',
    label: 'Local Transit & Express Rail',
    subLabel: 'Metro passes, cabs & transfers',
    color: '#d97706',
    bgLight: '#fffbeb',
    icon: Train,
    subItems: [
      { id: 't1', name: 'Unlimited Tourist Metro / Rail Pass', priceRatio: 0.60, fixed: true },
      { id: 't2', name: 'Airport Express Train / Transfer', priceRatio: 0.25, defaultChecked: true },
      { id: 't3', name: 'On-Demand Cabs & Rideshare Pool', priceRatio: 0.15, defaultChecked: true },
    ],
  },
  {
    key: 'activities',
    label: 'Attractions & Guided Tours',
    subLabel: 'Entry tickets, museums & guides',
    color: '#ec4899',
    bgLight: '#fdf2f8',
    icon: Ticket,
    subItems: [
      { id: 'a1', name: 'Priority Sightseeing & Museum Passes', priceRatio: 0.65, fixed: true },
      { id: 'a2', name: 'Expert Guided Walking Tours', priceRatio: 0.22, defaultChecked: true },
      { id: 'a3', name: 'Cultural Audio Guides & Extras', priceRatio: 0.13, defaultChecked: true },
    ],
  },
  {
    key: 'misc',
    label: 'Shopping & Miscellaneous',
    subLabel: 'Souvenirs, SIM/eSIM & buffer',
    color: '#0891b2',
    bgLight: '#ecfeff',
    icon: ShoppingBag,
    subItems: [
      { id: 'm1', name: 'Local Souvenirs & Crafts Reserve', priceRatio: 0.50, fixed: true },
      { id: 'm2', name: 'High-Speed eSIM / Travel Connectivity', priceRatio: 0.25, defaultChecked: true },
      { id: 'm3', name: 'Contingency & Emergency Buffer', priceRatio: 0.25, defaultChecked: true },
    ],
  },
];

const SAVINGS_TIPS = [
  { id: 'st_transit', label: 'Use 7-Day Tourist Transit Pass', saveAmount: 2800, category: 'transport' },
  { id: 'st_museum', label: 'Book Combined City Attraction Pass', saveAmount: 3200, category: 'activities' },
  { id: 'st_food', label: 'Mix Local Market Dinners with Fine Dining', saveAmount: 3500, category: 'food' },
  { id: 'st_hotel', label: 'Opt for Boutique Verified Stays', saveAmount: 4800, category: 'hotels' },
];

export default function BudgetBreakdown({
  breakdown = {},
  userBudget = null,
  status: _status = null,
  onOptimize,
  tripDuration = 5,
  initialTravelers = 2,
}) {
  // State
  const [categoriesBudget, setCategoriesBudget] = useState(() => ({
    flights: breakdown.flights || 32000,
    hotels: breakdown.hotels || 28000,
    food: breakdown.food || 14000,
    transport: breakdown.transport || 9500,
    activities: breakdown.activities || 12000,
    misc: breakdown.misc || 7000,
  }));

  const [activeTier, setActiveTier] = useState('balanced');
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'customize' | 'itemized'
  const [currency, setCurrency] = useState('INR');
  const [travelers, setTravelers] = useState(initialTravelers || 2);
  const [duration, setDuration] = useState(tripDuration || 5);
  const [displayUnit, setDisplayUnit] = useState('total'); // 'total' | 'person' | 'day'
  const [hoveredCatKey, setHoveredCatKey] = useState(null);
  const [expandedCats, setExpandedCats] = useState({});
  const [appliedSavings, setAppliedSavings] = useState([]);
  const [toastText, setToastText] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync when initial breakdown changes
  useEffect(() => {
    if (breakdown && Object.keys(breakdown).length > 0) {
      setCategoriesBudget({
        flights: breakdown.flights || 32000,
        hotels: breakdown.hotels || 28000,
        food: breakdown.food || 14000,
        transport: breakdown.transport || 9500,
        activities: breakdown.activities || 12000,
        misc: breakdown.misc || 7000,
      });
    }
  }, [breakdown]);

  // Compute total
  const currentTotal = useMemo(() => {
    return Object.values(categoriesBudget).reduce((sum, val) => sum + (Number(val) || 0), 0);
  }, [categoriesBudget]);

  // Target budget comparison
  const effectiveTarget = userBudget || (breakdown.total ? breakdown.total : currentTotal);
  const isOverBudget = effectiveTarget ? currentTotal > effectiveTarget : false;
  const budgetDiff = effectiveTarget ? Math.abs(currentTotal - effectiveTarget) : 0;
  const utilizationPct = effectiveTarget ? Math.round((currentTotal / effectiveTarget) * 100) : 100;

  // Format currency helper
  const formatAmount = (inrAmount) => {
    if (inrAmount == null || Number.isNaN(inrAmount)) return `${FX_RATES[currency].symbol}0`;

    let value = inrAmount;

    if (displayUnit === 'person' && travelers > 0) {
      value = value / travelers;
    } else if (displayUnit === 'day' && duration > 0) {
      value = value / duration;
    }

    const converted = value * FX_RATES[currency].rate;

    if (currency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    if (currency === 'JPY') {
      return `¥${Math.round(converted).toLocaleString('ja-JP')}`;
    }
    return `${FX_RATES[currency].symbol}${Math.round(converted).toLocaleString('en-US')}`;
  };

  // Switch Tier
  const handleTierChange = (tier) => {
    setActiveTier(tier);
    const base = breakdown.flights
      ? breakdown
      : { flights: 32000, hotels: 28000, food: 14000, transport: 9500, activities: 12000, misc: 7000 };

    if (tier === 'budget') {
      setCategoriesBudget({
        flights: Math.round(base.flights * 0.88),
        hotels: Math.round(base.hotels * 0.65),
        food: Math.round(base.food * 0.72),
        transport: Math.round(base.transport * 0.8),
        activities: Math.round(base.activities * 0.7),
        misc: Math.round(base.misc * 0.6),
      });
      showToast('Switched to Budget & Backpacker Tier');
    } else if (tier === 'luxury') {
      setCategoriesBudget({
        flights: Math.round(base.flights * 1.35),
        hotels: Math.round(base.hotels * 1.65),
        food: Math.round(base.food * 1.45),
        transport: Math.round(base.transport * 1.3),
        activities: Math.round(base.activities * 1.4),
        misc: Math.round(base.misc * 1.5),
      });
      showToast('Switched to Luxury & VIP Experience Tier');
    } else {
      setCategoriesBudget({
        flights: base.flights,
        hotels: base.hotels,
        food: base.food,
        transport: base.transport,
        activities: base.activities,
        misc: base.misc,
      });
      showToast('Reset to Balanced Standard Tier');
    }
  };

  // Adjust Category Slider
  const handleCategorySlider = (key, newVal) => {
    setCategoriesBudget((prev) => ({
      ...prev,
      [key]: Number(newVal),
    }));
  };

  // Toggle Category Expand
  const toggleCategoryExpand = (key) => {
    setExpandedCats((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle Smart Saving Chip
  const toggleSavingTip = (tip) => {
    if (appliedSavings.includes(tip.id)) {
      setAppliedSavings((prev) => prev.filter((id) => id !== tip.id));
      setCategoriesBudget((prev) => ({
        ...prev,
        [tip.category]: prev[tip.category] + tip.saveAmount,
      }));
      showToast(`Removed: ${tip.label}`);
    } else {
      setAppliedSavings((prev) => [...prev, tip.id]);
      setCategoriesBudget((prev) => ({
        ...prev,
        [tip.category]: Math.max(500, prev[tip.category] - tip.saveAmount),
      }));
      showToast(`Applied savings: -₹${tip.saveAmount.toLocaleString('en-IN')}`);
    }
  };

  // Quick Auto-Balance to Target
  const handleAutoFitToBudget = () => {
    if (!effectiveTarget || currentTotal <= effectiveTarget) return;

    const flights = categoriesBudget.flights;
    const scalableTotal = currentTotal - flights;
    const targetScalable = Math.max(effectiveTarget - flights, scalableTotal * 0.4);
    const ratio = targetScalable / scalableTotal;

    const scaled = { ...categoriesBudget };
    ['hotels', 'food', 'transport', 'activities', 'misc'].forEach((k) => {
      scaled[k] = Math.max(500, Math.round(scaled[k] * ratio));
    });

    setCategoriesBudget(scaled);
    showToast('Auto-scaled flexible categories to match your target budget!');
    if (onOptimize) onOptimize();
  };

  // Toast notification
  const showToast = (msg) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText('');
    }, 3200);
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    const lines = [
      `✈️ GLOBEGO TRIP BUDGET SUMMARY`,
      `==============================`,
      `Total Estimated Cost: ${formatAmount(currentTotal)}`,
      `Travelers: ${travelers} pax | Duration: ${duration} days`,
      `Per Person: ${formatAmount(currentTotal / travelers)}`,
      `Per Day: ${formatAmount(currentTotal / duration)}`,
      `------------------------------`,
      ...CATEGORIES.map(
        (c) => `${c.label}: ${formatAmount(categoriesBudget[c.key])} (${Math.round((categoriesBudget[c.key] / currentTotal) * 100)}%)`
      ),
      `==============================`,
      `Target Budget: ${formatAmount(effectiveTarget)} (${utilizationPct}% utilized)`,
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    showToast('Budget summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Donut chart segments calculations
  const donutData = useMemo(() => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = 0;

    return CATEGORIES.map((cat) => {
      const amount = categoriesBudget[cat.key] || 0;
      const pct = currentTotal > 0 ? amount / currentTotal : 0;
      const strokeLength = pct * circumference;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += strokeLength;

      return {
        ...cat,
        amount,
        pct: Math.round(pct * 100),
        strokeLength,
        strokeDashoffset,
        circumference,
      };
    });
  }, [categoriesBudget, currentTotal]);

  const activeHoverCategory = useMemo(() => {
    if (!hoveredCatKey) return null;
    return donutData.find((d) => d.key === hoveredCatKey);
  }, [hoveredCatKey, donutData]);

  // Largest category
  const largestCategory = useMemo(() => {
    return donutData.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev), donutData[0]);
  }, [donutData]);

  return (
    <section className="budget-breakdown-card">
      {/* Header */}
      <div className="bb-header">
        <div className="bb-title-group">
          <h2 className="bb-main-title">
            <span className="bb-sparkle-badge">
              <Sparkles size={16} />
            </span>
            <span>Transparent Dynamic Budget</span>
          </h2>
          <p className="bb-sub-text">
            Interactive AI cost modeling with live currency conversion, customizable allocations, and category drill-downs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="bb-controls-row">
          {/* Unit Toggle */}
          <div className="bb-pill-group">
            <button
              type="button"
              className={`bb-pill-btn ${displayUnit === 'total' ? 'active' : ''}`}
              onClick={() => setDisplayUnit('total')}
            >
              Total
            </button>
            <button
              type="button"
              className={`bb-pill-btn ${displayUnit === 'person' ? 'active' : ''}`}
              onClick={() => setDisplayUnit('person')}
            >
              <Users size={13} />
              Per Person
            </button>
            <button
              type="button"
              className={`bb-pill-btn ${displayUnit === 'day' ? 'active' : ''}`}
              onClick={() => setDisplayUnit('day')}
            >
              <Calendar size={13} />
              Per Day
            </button>
          </div>

          {/* Currency Switcher */}
          <select
            className="bb-currency-select"
            value={currency}
            aria-label="Select display currency"
            onChange={(e) => setCurrency(e.target.value)}
          >
            {Object.entries(FX_RATES).map(([code, info]) => (
              <option key={code} value={code}>
                {info.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="bb-kpi-grid">
        <div className="bb-kpi-card highlight">
          <div className="bb-kpi-label">
            <span>Estimated Total</span>
            <DollarSign size={14} />
          </div>
          <div className="bb-kpi-val">{formatAmount(currentTotal)}</div>
          <div className="bb-kpi-sub">
            {displayUnit === 'person'
              ? `Split among ${travelers} travelers`
              : displayUnit === 'day'
              ? `Averaged over ${duration} days`
              : `Complete itinerary for ${travelers} travelers`}
          </div>
        </div>

        <div className="bb-kpi-card">
          <div className="bb-kpi-label">
            <span>Target Budget</span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 7px',
                borderRadius: 6,
                background: isOverBudget ? '#fee2e2' : '#dcfce7',
                color: isOverBudget ? '#dc2626' : '#16a34a',
                fontWeight: 700,
              }}
            >
              {utilizationPct}% Utilized
            </span>
          </div>
          <div className="bb-kpi-val" style={{ color: isOverBudget ? '#dc2626' : '#107c41' }}>
            {formatAmount(effectiveTarget)}
          </div>
          <div className="bb-kpi-sub">
            {isOverBudget ? (
              <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={12} /> {formatAmount(budgetDiff)} over target
              </span>
            ) : (
              <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={12} /> Within target budget
              </span>
            )}
          </div>
        </div>

        <div className="bb-kpi-card">
          <div className="bb-kpi-label">
            <span>Daily Burn Rate</span>
            <Calendar size={14} />
          </div>
          <div className="bb-kpi-val">{formatAmount(currentTotal / (duration || 1))}</div>
          <div className="bb-kpi-sub">Est. {duration} days total duration</div>
        </div>

        <div className="bb-kpi-card">
          <div className="bb-kpi-label">
            <span>Primary Expense</span>
            <Sparkles size={14} />
          </div>
          <div className="bb-kpi-val" style={{ fontSize: '1.2rem', color: largestCategory?.color }}>
            {largestCategory?.label.split('&')[0]}
          </div>
          <div className="bb-kpi-sub">
            {largestCategory?.pct}% of total spending
          </div>
        </div>
      </div>

      {/* Tier Selector Strip */}
      <div className="bb-tier-strip">
        <div className="bb-tier-title">
          <Zap size={16} />
          <span>Experience Tier Presets:</span>
        </div>
        <div className="bb-tier-options">
          <button
            type="button"
            className={`bb-tier-btn ${activeTier === 'budget' ? 'active' : ''}`}
            onClick={() => handleTierChange('budget')}
          >
            🎒 Backpacker (-20%)
          </button>
          <button
            type="button"
            className={`bb-tier-btn ${activeTier === 'balanced' ? 'active' : ''}`}
            onClick={() => handleTierChange('balanced')}
          >
            ⚖️ Balanced Standard
          </button>
          <button
            type="button"
            className={`bb-tier-btn ${activeTier === 'luxury' ? 'active' : ''}`}
            onClick={() => handleTierChange('luxury')}
          >
            💎 Luxury VIP (+40%)
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div className="bb-pill-group">
          <button
            type="button"
            className={`bb-pill-btn ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            <PieChart size={14} />
            Overview &amp; Visual Chart
          </button>
          <button
            type="button"
            className={`bb-pill-btn ${activeView === 'customize' ? 'active' : ''}`}
            onClick={() => setActiveView('customize')}
          >
            <Sliders size={14} />
            Interactive Sliders
          </button>
          <button
            type="button"
            className={`bb-pill-btn ${activeView === 'itemized' ? 'active' : ''}`}
            onClick={() => setActiveView('itemized')}
          >
            <List size={14} />
            Line-Item Drilldown
          </button>
        </div>

        {activeView === 'customize' && (
          <button
            type="button"
            className="bb-secondary-btn"
            onClick={() => handleTierChange('balanced')}
          >
            <RotateCcw size={13} />
            Reset Allocations
          </button>
        )}
      </div>

      {/* VIEW 1: OVERVIEW WITH DONUT CHART & CATEGORY LIST */}
      {activeView === 'overview' && (
        <div className="bb-split-view">
          {/* Donut Chart */}
          <div className="bb-chart-card">
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Spending Breakdown
            </div>

            <div className="bb-donut-wrapper">
              <svg className="bb-donut-svg" viewBox="0 0 200 200">
                {donutData.map((seg) => (
                  <circle
                    key={seg.key}
                    className={`bb-donut-segment ${hoveredCatKey === seg.key ? 'active' : ''}`}
                    cx="100"
                    cy="100"
                    r="80"
                    stroke={seg.color}
                    strokeDasharray={`${seg.strokeLength} ${seg.circumference}`}
                    strokeDashoffset={seg.strokeDashoffset}
                    onMouseEnter={() => setHoveredCatKey(seg.key)}
                    onMouseLeave={() => setHoveredCatKey(null)}
                  />
                ))}
              </svg>

              <div className="bb-donut-center">
                <div className="bb-center-category">
                  {activeHoverCategory ? activeHoverCategory.label.split('&')[0] : 'Total Budget'}
                </div>
                <div className="bb-center-amount">
                  {activeHoverCategory
                    ? formatAmount(activeHoverCategory.amount)
                    : formatAmount(currentTotal)}
                </div>
                <div
                  className="bb-center-pct"
                  style={{
                    color: activeHoverCategory ? activeHoverCategory.color : '#2563eb',
                    background: activeHoverCategory ? activeHoverCategory.bgLight : 'var(--off-white)',
                  }}
                >
                  {activeHoverCategory ? `${activeHoverCategory.pct}% of total` : `${utilizationPct}% target`}
                </div>
              </div>
            </div>

            {/* Mini Legend */}
            <div className="bb-chart-legend">
              {donutData.map((seg) => (
                <div
                  key={seg.key}
                  className={`bb-legend-item ${hoveredCatKey === seg.key ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredCatKey(seg.key)}
                  onMouseLeave={() => setHoveredCatKey(null)}
                >
                  <span className="bb-legend-dot" style={{ background: seg.color }} />
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {seg.label.split('&')[0]} ({seg.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category List */}
          <div className="bb-category-list">
            {CATEGORIES.map((cat) => {
              const amount = categoriesBudget[cat.key] || 0;
              const pct = currentTotal > 0 ? Math.round((amount / currentTotal) * 100) : 0;
              const isHovered = hoveredCatKey === cat.key;
              const isExpanded = expandedCats[cat.key];
              const IconComponent = cat.icon;

              return (
                <div
                  key={cat.key}
                  className={`bb-cat-row ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredCatKey(cat.key)}
                  onMouseLeave={() => setHoveredCatKey(null)}
                >
                  <div className="bb-cat-header" onClick={() => toggleCategoryExpand(cat.key)}>
                    <div className="bb-cat-left">
                      <div
                        className="bb-cat-icon-box"
                        style={{ background: cat.bgLight, color: cat.color }}
                      >
                        <IconComponent size={20} />
                      </div>
                      <div className="bb-cat-meta">
                        <div className="bb-cat-title">{cat.label}</div>
                        <div className="bb-cat-subtitle">{cat.subLabel}</div>
                      </div>
                    </div>

                    <div className="bb-cat-right">
                      <div className="bb-cat-numbers">
                        <div className="bb-cat-price">{formatAmount(amount)}</div>
                        <div className="bb-cat-pct-tag">{pct}% of trip</div>
                      </div>
                      <button
                        type="button"
                        className="bb-cat-expand-btn"
                        aria-label={`Toggle ${cat.label} sub-items`}
                      >
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="bb-cat-progress-track">
                    <div
                      className="bb-cat-progress-bar"
                      style={{ width: `${pct}%`, background: cat.color }}
                    />
                  </div>

                  {/* Expanded Sub-items */}
                  {isExpanded && (
                    <div className="bb-cat-subitems">
                      {cat.subItems.map((item) => (
                        <div key={item.id} className="bb-subitem-row">
                          <div className="bb-subitem-left">
                            <ShieldCheck size={14} color={cat.color} />
                            <span>{item.name}</span>
                          </div>
                          <span className="bb-subitem-price">
                            {formatAmount(Math.round(amount * item.priceRatio))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE SLIDERS CUSTOMIZER */}
      {activeView === 'customize' && (
        <div>
          <p style={{ fontSize: '0.86rem', color: 'var(--ink-500)', marginBottom: 16 }}>
            Fine-tune individual category budgets. Totals, chart shares, and per-day costs will update dynamically in real time.
          </p>
          <div className="bb-sliders-grid">
            {CATEGORIES.map((cat) => {
              const val = categoriesBudget[cat.key] || 0;
              const IconComponent = cat.icon;
              const maxVal = Math.max(val * 2.5, 60000);

              return (
                <div key={cat.key} className="bb-slider-box">
                  <div className="bb-slider-top">
                    <div className="bb-slider-label-group">
                      <IconComponent size={17} color={cat.color} />
                      <span>{cat.label}</span>
                    </div>
                    <span className="bb-slider-val" style={{ color: cat.color }}>
                      {formatAmount(val)}
                    </span>
                  </div>

                  <input
                    type="range"
                    className="bb-range-input"
                    min="1000"
                    max={maxVal}
                    step="500"
                    value={val}
                    style={{ accentColor: cat.color }}
                    onChange={(e) => handleCategorySlider(cat.key, e.target.value)}
                  />

                  <div className="bb-slider-limits">
                    <span>Min: {formatAmount(1000)}</span>
                    <span>Max: {formatAmount(maxVal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: ITEMIZED LINE-ITEM DRILLDOWN */}
      {activeView === 'itemized' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
          {CATEGORIES.map((cat) => {
            const catTotal = categoriesBudget[cat.key] || 0;
            const IconComponent = cat.icon;

            return (
              <div
                key={cat.key}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 14,
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ padding: 6, borderRadius: 8, background: cat.bgLight, color: cat.color }}>
                      <IconComponent size={18} />
                    </div>
                    <strong style={{ fontSize: '0.96rem', color: 'var(--ink-900)' }}>{cat.label}</strong>
                  </div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: cat.color }}>
                    {formatAmount(catTotal)}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cat.subItems.map((sub) => {
                    const itemCost = Math.round(catTotal * sub.priceRatio);
                    return (
                      <div
                        key={sub.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: 8,
                          background: 'var(--cream)',
                          fontSize: '0.84rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <CheckCircle2 size={15} color={cat.color} />
                          <span style={{ color: 'var(--ink-800)', fontWeight: 500 }}>{sub.name}</span>
                        </div>
                        <strong style={{ color: 'var(--ink-900)' }}>{formatAmount(itemCost)}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Segmented Multi-Category Progress Bar */}
      <div className="bb-multi-bar-container">
        <div className="bb-multi-bar-meta">
          <span>Target Budget Utilization ({utilizationPct}%)</span>
          <span>
            {formatAmount(currentTotal)} / {formatAmount(effectiveTarget)}
          </span>
        </div>
        <div className="bb-multi-bar-track">
          {donutData.map((seg) => (
            <div
              key={seg.key}
              className="bb-multi-bar-segment"
              style={{
                width: `${seg.pct}%`,
                background: seg.color,
              }}
              title={`${seg.label}: ${formatAmount(seg.amount)} (${seg.pct}%)`}
              onMouseEnter={() => setHoveredCatKey(seg.key)}
              onMouseLeave={() => setHoveredCatKey(null)}
            />
          ))}
        </div>
      </div>

      {/* Over-Budget Alert Box */}
      {isOverBudget && (
        <div className="bb-alert-box">
          <AlertTriangle size={22} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
          <div className="bb-alert-content">
            <h4 className="bb-alert-title">Target Budget Exceeded</h4>
            <p className="bb-alert-desc">
              Your customized itinerary is currently approximately{' '}
              <strong>{formatAmount(budgetDiff)}</strong> above your desired target of{' '}
              <strong>{formatAmount(effectiveTarget)}</strong>. You can automatically adjust flexible ground
              categories to match your goal without compromising essential flight bookings.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ background: '#dc2626', borderColor: '#dc2626' }}
              onClick={handleAutoFitToBudget}
            >
              <Sparkles size={14} />
              <span>Auto-Fit Itinerary to Target ({formatAmount(effectiveTarget)})</span>
            </button>
          </div>
        </div>
      )}

      {/* Smart Savings Chips */}
      <div className="bb-savings-box">
        <div className="bb-savings-header">
          <TrendingDown size={18} color="#166534" />
          <h4 className="bb-savings-title">AI Smart Savings Opportunities</h4>
        </div>
        <div className="bb-savings-chips">
          {SAVINGS_TIPS.map((tip) => {
            const isApplied = appliedSavings.includes(tip.id);
            return (
              <button
                key={tip.id}
                type="button"
                className={`bb-savings-chip ${isApplied ? 'applied' : ''}`}
                onClick={() => toggleSavingTip(tip)}
              >
                {isApplied ? <Check size={13} /> : <Sparkles size={13} />}
                <span>
                  {tip.label} (-{formatAmount(tip.saveAmount)})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Toolbar */}
      <div className="bb-footer-toolbar">
        {/* Travelers & Duration quick adjuster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div className="bb-travelers-counter">
            <Users size={15} />
            <span>Travelers:</span>
            <button
              type="button"
              className="bb-counter-btn"
              onClick={() => setTravelers((t) => Math.max(1, t - 1))}
              aria-label="Decrease travelers"
            >
              -
            </button>
            <span style={{ fontWeight: 800, minWidth: 16, textAlign: 'center' }}>{travelers}</span>
            <button
              type="button"
              className="bb-counter-btn"
              onClick={() => setTravelers((t) => Math.min(12, t + 1))}
              aria-label="Increase travelers"
            >
              +
            </button>
          </div>

          <div className="bb-travelers-counter">
            <Calendar size={15} />
            <span>Days:</span>
            <button
              type="button"
              className="bb-counter-btn"
              onClick={() => setDuration((d) => Math.max(1, d - 1))}
              aria-label="Decrease duration"
            >
              -
            </button>
            <span style={{ fontWeight: 800, minWidth: 16, textAlign: 'center' }}>{duration}</span>
            <button
              type="button"
              className="bb-counter-btn"
              onClick={() => setDuration((d) => Math.min(30, d + 1))}
              aria-label="Increase duration"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bb-action-btns">
          <button type="button" className="bb-secondary-btn" onClick={handleCopySummary}>
            {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          {onOptimize && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOptimize}
            >
              <Sparkles size={14} />
              <span>Optimize by 15%</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Toast */}
      {toastText && (
        <div className="bb-toast">
          <Check size={16} color="#4ade80" />
          <span>{toastText}</span>
        </div>
      )}
    </section>
  );
}
