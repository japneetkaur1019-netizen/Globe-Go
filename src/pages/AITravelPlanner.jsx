import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Compass } from 'lucide-react';
import AIModeSelector from '../components/AIModeSelector.jsx';
import AIPlannerInput from '../components/AIPlannerInput.jsx';
import AIConversation from '../components/AIConversation.jsx';
import LoadingAI from '../components/LoadingAI.jsx';
import TripOverview from '../components/TripOverview.jsx';
import Itinerary from '../components/Itinerary.jsx';
import BudgetBreakdown from '../components/BudgetBreakdown.jsx';
import HotelRecommendations from '../components/HotelRecommendations.jsx';
import ActivityRecommendations from '../components/ActivityRecommendations.jsx';
import FoodRecommendations from '../components/FoodRecommendations.jsx';
import TravelTips from '../components/TravelTips.jsx';
import SmartActions from '../components/SmartActions.jsx';
import ModifyTripModal from '../components/ModifyTripModal.jsx';
import SuggestDestinationPanel from '../components/SuggestDestinationPanel.jsx';
import BudgetAdvicePanel from '../components/BudgetAdvicePanel.jsx';
import TravelQuestionsPanel from '../components/TravelQuestionsPanel.jsx';
import { useApp } from '../context/AppContext.jsx';
import { generateTrip, planFromText } from '../data/mockAI.js';
import { getPremiumHotels } from '../data/hotels.js';
import { getActivitiesForStyles, getMoreActivities } from '../data/activities.js';
import { DESTINATIONS } from '../data/destinations.js';
import { scaleBreakdownToTarget, budgetStatus, formatINR } from '../utils/budgetCalculator.js';

let idCounter = 0;
const nextId = () => { idCounter += 1; return `msg_${Date.now()}_${idCounter}`; };

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AITravelPlanner() {
  const { preferences, saveTrip, notifyTripUpdated, notifyBudgetUpdated } = useApp();

  const [mode, setMode] = useState('plan');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [showModify, setShowModify] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const pushMessage = (from, text) => {
    setMessages((m) => [...m, { id: nextId(), from, text }]);
  };

  const runPlan = async (text) => {
    pushMessage('user', text);
    setTyping(true);
    await wait(500);

    const result = planFromText(text, preferences);

    if (!result.ok) {
      setTyping(false);
      pushMessage('ai', result.message);
      return;
    }

    const { trip: newTrip, usedDefaults } = result;
    const parts = [
      `Destination: ${newTrip.destination}${usedDefaults.destination ? ' (matched to your profile)' : ''}`,
      `Duration: ${newTrip.duration} days${usedDefaults.duration ? ' (standard)' : ''}`,
      `Budget: ${formatINR(newTrip.budget)}${usedDefaults.budget ? ' (computed)' : ''}`,
    ];
    setTyping(false);
    pushMessage('ai', `Parameters identified — ${parts.join(' · ')}. Computing your optimized itinerary...`);

    setLoading(true);
    await wait(1400);
    setTrip(newTrip);
    setIsSaved(false);
    setLoading(false);
    pushMessage('ai', `Your customized ${newTrip.destination} itinerary is ready below.`);
  };

  const handleExplore = (suggestion) => {
    setMode('plan');
    runPlan(`Plan a 5-day trip to ${suggestion.name} under ₹${suggestion.estimatedBudget}`);
  };

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handoff = location.state;
    if (!handoff) return;

    if (handoff.initialMode) setMode(handoff.initialMode);
    if (handoff.initialQuery) {
      setMode('plan');
      runPlan(handoff.initialQuery);
    }
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    if (!trip || isSaved) return;
    saveTrip(trip);
    setIsSaved(true);
  };

  const handleOptimize = () => {
    if (!trip) return;
    const newBreakdown = scaleBreakdownToTarget(trip.budgetBreakdown, Math.round(trip.budgetBreakdown.total * 0.85));
    const newStatus = budgetStatus(newBreakdown.total, trip.budget);
    setTrip({ ...trip, budgetBreakdown: newBreakdown, budgetStatus: newStatus });
    notifyBudgetUpdated(trip.destination, newBreakdown.total);
  };

  const handleSmartAction = (actionId) => {
    if (!trip) return;
    const destination = DESTINATIONS[trip.destinationId];

    switch (actionId) {
      case 'cheaper':
        handleOptimize();
        break;
      case 'upgradeHotels':
        setTrip({ ...trip, hotels: getPremiumHotels(trip.destinationId) });
        break;
      case 'moreActivities': {
        const existingCategories = trip.activities.map((a) => a.category);
        setTrip({ ...trip, activities: [...trip.activities, ...getMoreActivities(destination, existingCategories)] });
        break;
      }
      case 'moreFood': {
        const foodGroup = getActivitiesForStyles(destination, ['food'])[0];
        const extraFood = foodGroup.items.map((it) => ({ name: it.name, desc: it.desc, price: 650, image: it.image }));
        setTrip({ ...trip, food: [...trip.food, ...extraFood] });
        break;
      }
      case 'relaxed': {
        const relaxed = trip.itinerary.map((d) => (
          d.day % 2 === 0
            ? { ...d, afternoon: { iconType: 'Wind', name: 'Free afternoon for relaxation & leisure' } }
            : d
        ));
        setTrip({ ...trip, itinerary: relaxed });
        break;
      }
      case 'regenerate': {
        const seedOffset = Math.floor(Math.random() * 11) + 1;
        const regenerated = generateTrip({
          destinationId: trip.destinationId,
          duration: trip.duration,
          budget: trip.budget,
          currency: trip.currency,
          travelers: trip.travelers,
          preferences: { travelStyle: trip.travelStyle, climate: trip.climate, budget: preferences.budget },
          seedOffset,
        });
        setTrip(regenerated);
        setIsSaved(false);
        notifyTripUpdated(regenerated.destination);
        break;
      }
      default:
        break;
    }
  };

  const handleModifyRegenerate = (form) => {
    const updated = generateTrip({
      destinationId: form.destinationId,
      duration: form.duration,
      budget: form.budget,
      currency: trip?.currency || 'INR',
      travelers: form.travelers,
      preferences: { ...preferences, travelStyle: form.travelStyle, climate: form.climate },
    });
    setTrip(updated);
    setIsSaved(false);
    setShowModify(false);
    notifyTripUpdated(updated.destination);
  };

  const isPlannerMode = mode === 'plan' || mode === 'itinerary';

  return (
    <>
      <header className="page-header">
        <div className="eyebrow">
          <Sparkles size={14} />
          <span>GlobeGo AI Engine</span>
        </div>
        <h1>AI Travel Planner &amp; Concierge</h1>
        <p className="page-subtitle">Instant bespoke itineraries, VIP hotels, transparent budgets and verified activities.</p>
      </header>

      <div className="container">
        <div className="agent-shell">
          <AIModeSelector activeMode={mode} onSelect={setMode} />

          <main className="agent-main">
            {isPlannerMode && (
              <>
                <AIPlannerInput onSubmit={runPlan} isLoading={loading} />
                <AIConversation messages={messages} typing={typing} />

                {loading && <LoadingAI />}

                {!loading && trip && (
                  <>
                    <TripOverview trip={trip} onSave={handleSave} onModify={() => setShowModify(true)} isSaved={isSaved} />

                    <div className="panel" style={{ marginBottom: 28, background: 'var(--pine-50)', borderColor: 'var(--pine-400)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Sparkles size={18} color="#006ce4" />
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--pine-900)' }}>AI Intelligence Summary</h3>
                      </div>
                      <p style={{ margin: 0, color: 'var(--ink-800)', fontSize: '0.94rem', lineHeight: 1.55 }}>
                        {trip.aiSummary}
                      </p>
                    </div>

                    <Itinerary days={trip.itinerary} />
                    <BudgetBreakdown
                      breakdown={trip.budgetBreakdown}
                      userBudget={trip.budget}
                      status={trip.budgetStatus}
                      onOptimize={handleOptimize}
                    />
                    <HotelRecommendations hotels={trip.hotels} />
                    <ActivityRecommendations groups={trip.activities} />
                    <FoodRecommendations food={trip.food} destinationName={trip.destination} />
                    <TravelTips tips={trip.tips} />
                    <SmartActions onAction={handleSmartAction} />
                  </>
                )}

                {!loading && !trip && !messages.length && (
                  <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: 'var(--pine-100)',
                        color: 'var(--expedia-blue)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                      }}
                    >
                      <Compass size={26} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>Ready to plan your next journey?</h3>
                    <p style={{ color: 'var(--ink-500)', fontSize: '0.92rem', maxWidth: 460, margin: '0 auto' }}>
                      Enter your desired destination, trip length or budget in the input box above to generate a complete personalized itinerary.
                    </p>
                  </div>
                )}
              </>
            )}

            {mode === 'suggest' && (
              <SuggestDestinationPanel preferences={preferences} onExplore={handleExplore} />
            )}

            {mode === 'budget' && <BudgetAdvicePanel />}

            {mode === 'qa' && <TravelQuestionsPanel />}
          </main>
        </div>
      </div>

      {showModify && trip && (
        <ModifyTripModal trip={trip} onClose={() => setShowModify(false)} onRegenerate={handleModifyRegenerate} />
      )}
    </>
  );
}
