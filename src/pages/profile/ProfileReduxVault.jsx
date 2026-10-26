/**
 * ProfileReduxVault.jsx
 *
 * Dedicated Redux Toolkit Feature Component for Profile Page.
 *
 * Demonstrates:
 *  - useSelector to extract state from store (documents, rewards, bucketList, emergencyContacts, preferences, lastAction)
 *  - useDispatch to trigger Redux Toolkit slice actions (addDocument, removeDocument, claimDailyReward, redeemBenefit, etc.)
 *  - LocalStorage synchronization via Redux store subscriber
 *  - Live action inspector showcasing dispatched actions
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShieldCheck,
  Award,
  Sparkles,
  FileText,
  Users,
  Compass,
  CheckCircle2,
  Trash2,
  Plus,
  Coins,
  ArrowUpRight,
  Gift,
  Bell,
  Lock,
  Calendar,
  AlertCircle,
  ExternalLink,
  Zap,
  Tag,
  Phone,
  Mail,
  Plane,
  Eye,
  Check,
} from 'lucide-react';
import {
  addDocument,
  removeDocument,
  toggleDocumentVerified,
  addEmergencyContact,
  removeEmergencyContact,
  setPrimaryContact,
  claimDailyReward,
  redeemBenefit,
  addBucketListItem,
  toggleBucketVisited,
  removeBucketListItem,
  togglePreference,
} from '../../store/profileSlice';

const PERKS_CATALOG = [
  {
    id: 'perk-lounge',
    title: 'VIP Lounge Day Pass',
    desc: 'Access to priority international lounges with complimentary dining & Wi-Fi',
    cost: 2000,
    icon: '🍸',
  },
  {
    id: 'perk-seat',
    title: 'Extra Legroom Seat Selection',
    desc: 'Pick exit-row or bulk-head seating on your next flight at zero cost',
    cost: 1500,
    icon: '💺',
  },
  {
    id: 'perk-baggage',
    title: '+10kg Extra Checked Baggage',
    desc: 'Additional check-in allowance for long-haul international flights',
    cost: 3000,
    icon: '🧳',
  },
  {
    id: 'perk-meal',
    title: 'In-Flight Gourmet Chef Meal',
    desc: 'Pre-order a gourmet three-course meal with sparkling beverages',
    cost: 800,
    icon: '🍽️',
  },
];

export default function ProfileReduxVault() {
  const dispatch = useDispatch();

  // Extract slices from Redux store using useSelector
  const {
    documents,
    emergencyContacts,
    rewardWallet,
    bucketList,
    preferences,
    lastAction,
  } = useSelector((state) => state.profile);

  // Sub-tabs inside the Redux Vault
  const [subTab, setSubTab] = useState('rewards'); // 'rewards' | 'docs' | 'bucket' | 'contacts' | 'settings'

  // Modal / Form states
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    type: 'Passport',
    number: '',
    issuingCountry: 'India',
    expiryDate: '',
    notes: '',
  });

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: 'Family Member',
    phone: '',
    email: '',
  });

  const [bucketModalOpen, setBucketModalOpen] = useState(false);
  const [newBucket, setNewBucket] = useState({
    destination: '',
    country: '',
    targetYear: 2026,
    priority: 'High',
  });

  // Feedback banner
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Handlers
  const handleAddDoc = (e) => {
    e.preventDefault();
    if (!newDoc.number.trim()) return;
    dispatch(addDocument(newDoc));
    setNewDoc({ type: 'Passport', number: '', issuingCountry: 'India', expiryDate: '', notes: '' });
    setDocModalOpen(false);
    showFeedback(`Document ${newDoc.type} saved to Redux Store!`);
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.phone.trim()) return;
    dispatch(addEmergencyContact(newContact));
    setNewContact({ name: '', relationship: 'Family Member', phone: '', email: '' });
    setContactModalOpen(false);
    showFeedback(`Companion ${newContact.name} saved to Redux Store!`);
  };

  const handleAddBucket = (e) => {
    e.preventDefault();
    if (!newBucket.destination.trim()) return;
    dispatch(addBucketListItem(newBucket));
    setNewBucket({ destination: '', country: '', targetYear: 2026, priority: 'High' });
    setBucketModalOpen(false);
    showFeedback(`Added ${newBucket.destination} to Dream Bucket List!`);
  };

  const handleClaimDaily = () => {
    if (rewardWallet.dailyCheckinClaimed) {
      showFeedback('Daily miles bonus already claimed for today! Check back tomorrow.');
      return;
    }
    dispatch(claimDailyReward());
    showFeedback('🎉 +250 Voyager Miles credited to your Redux Wallet!');
  };

  const handleRedeem = (perk) => {
    if (rewardWallet.milesBalance < perk.cost) {
      showFeedback(`Insufficient miles! You need ${perk.cost.toLocaleString('en-IN')} miles (Current: ${rewardWallet.milesBalance.toLocaleString('en-IN')}).`);
      return;
    }
    dispatch(redeemBenefit({ title: perk.title, cost: perk.cost }));
    showFeedback(`🎉 Success! Redeemed "${perk.title}" for -${perk.cost} miles!`);
  };

  const visitedCount = bucketList.filter((b) => b.visited).length;
  const visitedPct = bucketList.length > 0 ? Math.round((visitedCount / bucketList.length) * 100) : 0;

  return (
    <div className="redux-vault-wrapper card" style={{ padding: '28px', background: '#ffffff', borderRadius: '24px', border: '1px solid rgba(26,115,232,0.18)', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
      {/* ── REDUX TOOLKIT HEADER INSPECTOR ──────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(118, 74, 188, 0.12)', color: '#764abc', borderRadius: '999px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
            <Zap size={13} fill="#764abc" /> REDUX TOOLKIT STATE MANAGER
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink-900, #0f172a)', margin: 0 }}>
            Voyager Travel Vault &amp; Loyalty Wallet
          </h2>
          <p style={{ color: 'var(--ink-600, #475569)', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Fully reactive profile sub-features managed with Redux Toolkit slices, reducers, and automatic local storage persistence.
          </p>
        </div>

        {/* Live Redux Action Telemetry */}
        <div style={{ background: '#0f172a', color: '#f8fafc', padding: '10px 16px', borderRadius: '12px', fontSize: '12px', minWidth: '260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ color: '#94a3b8', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              Redux Action Dispatched
            </span>
            <span style={{ color: '#38bdf8', fontSize: '10.5px' }}>{lastAction?.timestamp || 'live'}</span>
          </div>
          <div style={{ fontFamily: 'monospace', color: '#a5b4fc', fontWeight: 700, fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lastAction?.type || '@@INIT'}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '11px', marginTop: '3px' }}>
            {lastAction?.message || 'Store ready'}
          </div>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {feedbackMsg && (
        <div style={{ marginTop: '16px', padding: '12px 18px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#065f46', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeUp 0.2s ease' }}>
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ── REDUX SUB-NAVIGATION TABS ────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
        <button
          type="button"
          className={`btn ${subTab === 'rewards' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSubTab('rewards')}
          style={{ fontSize: '12.5px', padding: '8px 16px', borderRadius: '10px' }}
        >
          <Coins size={14} /> Rewards &amp; Miles Wallet ({rewardWallet.milesBalance.toLocaleString('en-IN')})
        </button>

        <button
          type="button"
          className={`btn ${subTab === 'docs' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSubTab('docs')}
          style={{ fontSize: '12.5px', padding: '8px 16px', borderRadius: '10px' }}
        >
          <FileText size={14} /> Travel Documents ({documents.length})
        </button>

        <button
          type="button"
          className={`btn ${subTab === 'bucket' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSubTab('bucket')}
          style={{ fontSize: '12.5px', padding: '8px 16px', borderRadius: '10px' }}
        >
          <Compass size={14} /> Dream Bucket List ({visitedCount}/{bucketList.length})
        </button>

        <button
          type="button"
          className={`btn ${subTab === 'contacts' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSubTab('contacts')}
          style={{ fontSize: '12.5px', padding: '8px 16px', borderRadius: '10px' }}
        >
          <Users size={14} /> Companions &amp; Contacts ({emergencyContacts.length})
        </button>

        <button
          type="button"
          className={`btn ${subTab === 'settings' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSubTab('settings')}
          style={{ fontSize: '12.5px', padding: '8px 16px', borderRadius: '10px' }}
        >
          <Lock size={14} /> Redux Privacy &amp; Alerts
        </button>
      </div>

      {/* ════════════════════════════════════════════════════
          SUB-TAB 1: REWARDS & MILES WALLET
          ════════════════════════════════════════════════════ */}
      {subTab === 'rewards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Miles Balance Banner */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)', color: '#fff', borderRadius: '20px', padding: '26px 30px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85, fontWeight: 700 }}>
                  Active Redux Voyager Wallet
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-1px', margin: '6px 0' }}>
                  {rewardWallet.milesBalance.toLocaleString('en-IN')} <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Miles</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', opacity: 0.9 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', background: 'rgba(255,255,255,0.18)', borderRadius: '999px', fontWeight: 700 }}>
                    <Award size={13} /> {rewardWallet.tier}
                  </span>
                  <span>Lifetime Earned: {rewardWallet.lifetimeEarned.toLocaleString('en-IN')} Miles</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="btn"
                  onClick={handleClaimDaily}
                  disabled={rewardWallet.dailyCheckinClaimed}
                  style={{
                    background: rewardWallet.dailyCheckinClaimed ? 'rgba(255,255,255,0.2)' : 'var(--amber, #f59e0b)',
                    color: rewardWallet.dailyCheckinClaimed ? '#cbd5e1' : '#000',
                    fontWeight: 800,
                    padding: '12px 22px',
                    borderRadius: '14px',
                    border: 'none',
                    cursor: rewardWallet.dailyCheckinClaimed ? 'not-allowed' : 'pointer',
                    boxShadow: rewardWallet.dailyCheckinClaimed ? 'none' : '0 4px 16px rgba(245,158,11,0.4)',
                  }}
                >
                  <Sparkles size={16} />
                  <span>{rewardWallet.dailyCheckinClaimed ? '✓ Daily Bonus Claimed' : 'Claim Daily Bonus (+250 Miles)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Perks Catalog */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gift size={18} color="var(--primary, #1a73e8)" /> Redeem Rewards via Redux Actions
            </h3>
            <p style={{ color: 'var(--ink-500, #64748b)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Dispatch Redux state mutations to instantly redeem real travel benefits.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {PERKS_CATALOG.map((perk) => {
                const canAfford = rewardWallet.milesBalance >= perk.cost;
                return (
                  <div
                    key={perk.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '18px',
                      background: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{perk.icon}</div>
                      <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800 }}>{perk.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45 }}>{perk.desc}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>
                        {perk.cost.toLocaleString('en-IN')} <span style={{ fontSize: '11px', color: '#64748b' }}>miles</span>
                      </strong>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => handleRedeem(perk)}
                        disabled={!canAfford}
                        style={{
                          fontSize: '11.5px',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: canAfford ? 'var(--primary, #1a73e8)' : '#cbd5e1',
                          color: '#fff',
                          border: 'none',
                          cursor: canAfford ? 'pointer' : 'not-allowed',
                          fontWeight: 700,
                        }}
                      >
                        {canAfford ? 'Redeem Perk' : 'Need More Miles'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Redux Transaction Ledger */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>Miles Activity Ledger</h4>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
              {rewardWallet.history.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 18px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: tx.type === 'credit' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: tx.type === 'credit' ? '#10b981' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 800,
                      }}
                    >
                      {tx.type === 'credit' ? '+' : '-'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{tx.title}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{tx.date}</div>
                    </div>
                  </div>
                  <strong style={{ color: tx.type === 'credit' ? '#10b981' : '#ef4444', fontSize: '13.5px' }}>
                    {tx.type === 'credit' ? `+${tx.amount.toLocaleString('en-IN')}` : `${tx.amount.toLocaleString('en-IN')}`} Miles
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          SUB-TAB 2: TRAVEL DOCUMENTS & VISAS
          ════════════════════════════════════════════════════ */}
      {subTab === 'docs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Verified Travel Documents</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0' }}>
                Securely stored in Redux state for fast international flight check-in and hotel bookings.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setDocModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Add Document
            </button>
          </div>

          {docModalOpen && (
            <form onSubmit={handleAddDoc} style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 800 }}>Add New Travel Document</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Document Type</label>
                  <select
                    value={newDoc.type}
                    onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  >
                    <option value="Passport">Passport</option>
                    <option value="Schengen Visa">Schengen Visa</option>
                    <option value="US Tourist Visa (B1/B2)">US Tourist Visa (B1/B2)</option>
                    <option value="UK Standard Visitor Visa">UK Standard Visitor Visa</option>
                    <option value="International Driving Permit">International Driving Permit</option>
                    <option value="Travel Health Insurance">Travel Health Insurance</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Document / Passport Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Z1234567"
                    value={newDoc.number}
                    onChange={(e) => setNewDoc({ ...newDoc, number: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Issuing Country / Authority</label>
                  <input
                    type="text"
                    value={newDoc.issuingCountry}
                    onChange={(e) => setNewDoc({ ...newDoc, issuingCountry: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Expiry Date</label>
                  <input
                    type="date"
                    value={newDoc.expiryDate}
                    onChange={(e) => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save to Redux
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setDocModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {documents.map((doc) => (
              <div
                key={doc.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '18px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={18} color="#2563eb" />
                      <strong style={{ fontSize: '15px' }}>{doc.type}</strong>
                    </div>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: doc.verified ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                        color: doc.verified ? '#10b981' : '#d97706',
                      }}
                    >
                      {doc.verified ? '✓ Verified' : 'Pending Verification'}
                    </span>
                  </div>

                  <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>
                    {doc.number}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Issued by: {doc.issuingCountry} {doc.expiryDate && `· Valid until ${doc.expiryDate}`}
                  </div>
                  {doc.notes && <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '6px' }}>{doc.notes}</div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    type="button"
                    onClick={() => dispatch(toggleDocumentVerified(doc.id))}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    {doc.verified ? 'Mark Unverified' : 'Mark Verified'}
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(removeDocument(doc.id))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    title="Delete document"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          SUB-TAB 3: DREAM BUCKET LIST
          ════════════════════════════════════════════════════ */}
      {subTab === 'bucket' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Dream Travel Bucket List</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0' }}>
                Completed {visitedCount} of {bucketList.length} destinations ({visitedPct}%)
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setBucketModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Add Destination
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '999px', overflow: 'hidden', marginBottom: '18px' }}>
            <div style={{ width: `${visitedPct}%`, background: 'var(--success, #10b981)', height: '100%', transition: 'width 0.4s ease' }} />
          </div>

          {bucketModalOpen && (
            <form onSubmit={handleAddBucket} style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 800 }}>Add Bucket List Goal</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Destination</label>
                  <input
                    type="text"
                    placeholder="e.g. Machu Picchu Inca Trail"
                    value={newBucket.destination}
                    onChange={(e) => setNewBucket({ ...newBucket, destination: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Country</label>
                  <input
                    type="text"
                    placeholder="e.g. Peru"
                    value={newBucket.country}
                    onChange={(e) => setNewBucket({ ...newBucket, country: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Target Year</label>
                  <input
                    type="number"
                    value={newBucket.targetYear}
                    onChange={(e) => setNewBucket({ ...newBucket, targetYear: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Priority</label>
                  <select
                    value={newBucket.priority}
                    onChange={(e) => setNewBucket({ ...newBucket, priority: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button type="submit" className="btn btn-primary btn-sm">Save Goal</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setBucketModalOpen(false)}>Cancel</button>
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {bucketList.map((item) => (
              <div
                key={item.id}
                style={{
                  border: item.visited ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                  background: item.visited ? 'rgba(16,185,129,0.04)' : '#ffffff',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={item.visited}
                    onChange={() => dispatch(toggleBucketVisited(item.id))}
                    style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  <div>
                    <strong style={{ fontSize: '14px', textDecoration: item.visited ? 'line-through' : 'none', color: item.visited ? '#64748b' : '#0f172a' }}>
                      {item.destination}
                    </strong>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {item.country} · Target {item.targetYear} · <span style={{ fontWeight: 700, color: item.priority === 'High' ? '#ef4444' : '#2563eb' }}>{item.priority}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(removeBucketListItem(item.id))}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  title="Remove goal"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          SUB-TAB 4: COMPANIONS & EMERGENCY CONTACTS
          ════════════════════════════════════════════════════ */}
      {subTab === 'contacts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Companions &amp; Emergency Contacts</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0' }}>
                Synced directly into flight booking passenger autofill and airline manifest rosters.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setContactModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Add Contact
            </button>
          </div>

          {contactModalOpen && (
            <form onSubmit={handleAddContact} style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 800 }}>Add Companion / Emergency Contact</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Maya Patel"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Relationship</label>
                  <select
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  >
                    <option value="Spouse / Partner">Spouse / Partner</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Friend / Travel Buddy">Friend / Travel Buddy</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="contact@example.com"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button type="submit" className="btn btn-primary btn-sm">Save Contact</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setContactModalOpen(false)}>Cancel</button>
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                style={{
                  border: contact.isPrimary ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '15px' }}>{contact.name}</strong>
                    {contact.isPrimary && (
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', background: 'rgba(37,99,235,0.1)', color: '#2563eb', borderRadius: '999px' }}>
                        Primary Contact
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{contact.relationship}</div>

                  <div style={{ marginTop: '10px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} color="#2563eb" />
                      <a href={`tel:${contact.phone}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                        {contact.phone}
                      </a>
                    </div>
                    {contact.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} color="#2563eb" />
                        <span style={{ color: '#64748b' }}>{contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  {!contact.isPrimary ? (
                    <button
                      type="button"
                      onClick={() => dispatch(setPrimaryContact(contact.id))}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      Make Primary
                    </button>
                  ) : <span />}
                  <button
                    type="button"
                    onClick={() => dispatch(removeEmergencyContact(contact.id))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    title="Remove contact"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          SUB-TAB 5: REDUX PRIVACY & ALERTS TOGGLES
          ════════════════════════════════════════════════════ */}
      {subTab === 'settings' && (
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px' }}>Redux-Backed Account Toggles</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 18px' }}>
            Instant state updates managed through Redux Toolkit actions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { key: 'twoFactorAuth', title: 'Two-Factor Authentication (2FA)', desc: 'Require biometric OTP authentication when booking flights or redeeming miles.' },
              { key: 'priceDropAlerts', title: 'Real-Time Flight Price Drop Alerts', desc: 'Notify instantly when monitored airfares dip below your preferred budget threshold.' },
              { key: 'flightStatusSMS', title: 'Gate Change & Delay SMS Notifications', desc: 'Direct alerts to mobile phone during travel days for departure time changes.' },
              { key: 'autoCheckIn', title: 'Automated 24h Web Check-in', desc: 'Let GlobeGo automatically assign preferred window/aisle seats upon window opening.' },
              { key: 'shareStatsPublicly', title: 'Public Voyager Badges Profile', desc: 'Allow friends and travel groups to view your unlocked travel badges and visited countries.' },
            ].map((setting) => (
              <div
                key={setting.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  background: preferences[setting.key] ? 'rgba(37,99,235,0.02)' : '#ffffff',
                }}
              >
                <div>
                  <strong style={{ fontSize: '14px', display: 'block', color: '#0f172a' }}>{setting.title}</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{setting.desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(togglePreference(setting.key))}
                  style={{
                    width: '48px',
                    height: '26px',
                    borderRadius: '999px',
                    background: preferences[setting.key] ? 'var(--primary, #1a73e8)' : '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: preferences[setting.key] ? '25px' : '3px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
