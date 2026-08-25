
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Heart,
  Search,
  Star,
  MapPin,
  Plane,
  ArrowRight,
  Compass,
  Check,
  Plus,
  X,
  ZoomIn,
  StickyNote,
  Flag,
  TrendingUp,
  Globe2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
  Wallet,
} from "lucide-react";

import destinations from "../../data/destination";
import { useWishlist } from "../../context/WishlistContext";
import "./Wishlist.css";

/* ─── Priority options ─────────────────────────────────── */
const PRIORITIES = [
  { key: "dream",    label: "Dream",     emoji: "✨" },
  { key: "planned",  label: "Planned",   emoji: "📅" },
  { key: "next",     label: "Next Trip", emoji: "🚀" },
];

/* ─── Extra gallery images per destination (Unsplash themed) ─── */
const GALLERY_EXTRAS = {
  1:  ["photo-1431274172761-fca41d930114", "photo-1499856374427-1e745d9d8b4f"],
  2:  ["photo-1582672060674-bc2bd808a8b5", "photo-1493246507139-91e8fad9978e"],
  3:  ["photo-1513407030348-c983a97b98d8", "photo-1528360983277-13d401cdc186"],
  4:  ["photo-1558618666-fcd25c85cd64", "photo-1573790387438-4da905039392"],
  5:  ["photo-1486325212027-8081e485255e", "photo-1529655683826-aba9b3e77383"],
  6:  ["photo-1586500036706-41963de24d8b", "photo-1540202404-d0c7fe46a087"],
  7:  ["photo-1534430480872-3498386e7856", "photo-1522083165195-3424ed129620"],
  8:  ["photo-1510798831971-661eb04b3739", "photo-1507003211169-0a1dd7228f2d"],
  9:  ["photo-1533105079780-92b9be482077", "photo-1601581875309-faf6711e37d6"],
  10: ["photo-1555992336-03a23c7b20ee", "photo-1529260830199-42c24126f198"],
  11: ["photo-1524413840807-0c3cb6fa808d", "photo-1528360983277-13d401cdc186"],
  12: ["photo-1518464922534-4cd1ee3571a9", "photo-1577086664693-894d8405334a"],
  13: ["photo-1465188162913-8fb5709d6d57", "photo-1524293763966-7d1dc4c89e5d"],
  14: ["photo-1595435934249-5df7ed86e1c0", "photo-1564507592333-c60657eea523"],
  15: ["photo-1569973024915-05af1b6a0e2b", "photo-1541849546-216549ae216d"],
  16: ["photo-1571336786461-72f5e30f5791", "photo-1525625293386-3f8f99389edd"],
  17: ["photo-1483729558449-99ef09a8c325", "photo-1516306580123-e6e52b1b7b5f"],
  18: ["photo-1544551763-77ef2d0cfc6c", "photo-1528543606781-2f6e6857f318"],
  19: ["photo-1516496636080-14fb876e029d", "photo-1501440853124-d887bae460eb"],
  20: ["photo-1579282240050-352db0a14c21", "photo-1464790719320-516ecd75af6c"],
};

function getGallery(dest) {
  const extras = GALLERY_EXTRAS[dest.id] || [];
  return [
    dest.image + "?w=1400&q=90",
    ...extras.map((id) => `https://images.unsplash.com/${id}?w=1400&q=90`),
  ];
}

/* ─── Category → color map ─────────────────────────────── */
const CAT_COLOR = {
  Beach: "#0ea5e9", Romantic: "#ec4899", Adventure: "#f97316",
  Luxury: "#a78bfa", Culture: "#10b981", City: "#3b82f6",
  History: "#d97706", default: "#6366f1",
};

export default function Wishlist() {
  const navigate  = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  /* ── Search ──────────────────────────────────────────── */
  const [search, setSearch] = useState("");

  /* ── Per-card meta stored locally ───────────────────── */
  // { [id]: { priority: "dream"|"planned"|"next", note: "" } }
  const [cardMeta, setCardMeta] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wl_meta") || "{}"); }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem("wl_meta", JSON.stringify(cardMeta));
  }, [cardMeta]);

  const setMeta = (id, patch) =>
    setCardMeta((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), ...patch },
    }));

  /* ── Lightbox ────────────────────────────────────────── */
  const [lightbox, setLightbox] = useState(null); // { dest, imgIdx }

  const openLightbox  = (dest, imgIdx = 0) => setLightbox({ dest, imgIdx });
  const closeLightbox = () => setLightbox(null);

  const lightboxNext = useCallback(() => {
    if (!lightbox) return;
    const imgs = getGallery(lightbox.dest);
    setLightbox((lb) => ({ ...lb, imgIdx: (lb.imgIdx + 1) % imgs.length }));
  }, [lightbox]);

  const lightboxPrev = useCallback(() => {
    if (!lightbox) return;
    const imgs = getGallery(lightbox.dest);
    setLightbox((lb) => ({ ...lb, imgIdx: (lb.imgIdx - 1 + imgs.length) % imgs.length }));
  }, [lightbox]);

  /* Keyboard nav for lightbox */
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") lightboxNext();
      if (e.key === "ArrowLeft")  lightboxPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, lightboxNext, lightboxPrev]);

  /* ── Active note card (show textarea inline) ─────────── */
  const [activeNote, setActiveNote] = useState(null);

  /* ── Search helpers ──────────────────────────────────── */
  const destinationList = Array.isArray(destinations) ? destinations : [];

  const searchResults = search.trim() === ""
    ? []
    : destinationList.filter((d) => {
        const q = search.toLowerCase();
        return d.name?.toLowerCase().includes(q) || d.country?.toLowerCase().includes(q);
      });

  const handleFindFlights = (destination) =>
    navigate("/flights", { state: { prefillDestination: destination.name } });

  /* ── Stats ───────────────────────────────────────────── */
  const totalBudget = wishlist.reduce((s, d) => s + (d.price || 0), 0);
  const topCategory = wishlist.length
    ? Object.entries(
        wishlist.reduce((acc, d) => {
          acc[d.category] = (acc[d.category] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  /* ── Share ───────────────────────────────────────────── */
  const handleShare = (dest) => {
    const url = `${window.location.origin}/explore`;
    if (navigator.share) {
      navigator.share({ title: dest.name, text: `Check out ${dest.name}!`, url });
    } else {
      navigator.clipboard?.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  /* ──────────────────────────────────────────────────────
     RENDER
     ────────────────────────────────────────────────────── */
  return (
    <div className="wl-page">

      {/* ── BANNER ─────────────────────────────────────── */}
      <section className="wl-banner">
        <div className="wl-banner-inner">
          <div className="wl-banner-left">
            <div className="wl-eyebrow">
              <Heart size={13} fill="#ffc72c" color="#ffc72c" />
              <span>YOUR SAVED PLACES</span>
            </div>
            <h1>Your Travel Wishlist</h1>
            <p>
              Keep your bucket-list destinations organized and instantly
              launch AI itineraries or book flights in one click.
            </p>
          </div>

          <div className="wl-banner-right">
            <div className="wl-count-bubble">
              <strong>{wishlist.length}</strong>
              <span>{wishlist.length === 1 ? "Destination" : "Destinations"}</span>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="wl-banner-blob wl-blob1" />
        <div className="wl-banner-blob wl-blob2" />
      </section>


      {/* ── STATS BAR ──────────────────────────────────── */}
      {wishlist.length > 0 && (
        <div className="wl-stats-bar-wrap">
          <div className="wl-stats-bar">
            <div className="wl-stat">
              <Globe2 size={16} />
              <span><strong>{wishlist.length}</strong> Saved</span>
            </div>
            <div className="wl-stat-divider" />
            <div className="wl-stat">
              <Wallet size={16} />
              <span><strong>₹{totalBudget.toLocaleString("en-IN")}</strong> Est. Cost</span>
            </div>
            <div className="wl-stat-divider" />
            <div className="wl-stat">
              <TrendingUp size={16} />
              <span>Top: <strong>{topCategory}</strong></span>
            </div>
            <div className="wl-stat-divider" />
            <div className="wl-stat">
              <Star size={16} fill="#ffc72c" color="#ffc72c" />
              <span>Avg Rating: <strong>
                {wishlist.length
                  ? (wishlist.reduce((s,d)=>s+(d.rating||0),0)/wishlist.length).toFixed(1)
                  : "—"}
              </strong></span>
            </div>
          </div>
        </div>
      )}


      {/* ── SEARCH ─────────────────────────────────────── */}
      <section className="wl-search-wrap">
        <div className="wl-search-bar">
          <Search size={18} className="wl-search-icon" />
          <input
            type="text"
            placeholder="Search & quick-add destinations (Paris, Tokyo, Bali, Dubai…)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="wl-clear-btn" onClick={() => setSearch("")}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {search && (
          <div className="wl-search-results">
            {searchResults.length === 0 ? (
              <p className="wl-no-result">No destinations found. Try Paris, Bali, Tokyo, Rome…</p>
            ) : (
              <div className="wl-search-grid">
                {searchResults.map((dest) => {
                  const saved = wishlist.some((i) => i.id === dest.id);
                  return (
                    <div className="wl-search-item" key={dest.id}>
                      <div className="wl-search-thumb-wrap">
                        <img
                          src={dest.image + "?w=120&q=80"}
                          alt={dest.name}
                          className="wl-search-thumb"
                        />
                      </div>
                      <div className="wl-search-info">
                        <strong>{dest.name}</strong>
                        <span>
                          <MapPin size={11} /> {dest.country} · {dest.category}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`wl-add-btn ${saved ? "saved" : ""}`}
                        disabled={saved}
                        onClick={() => { if (!saved) addToWishlist(dest); setSearch(""); }}
                      >
                        {saved ? <><Check size={13}/> Saved</> : <><Plus size={13}/> Add</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>


      {/* ── EMPTY STATE ────────────────────────────────── */}
      {wishlist.length === 0 ? (
        <section className="wl-empty">
          <div className="wl-empty-icon">
            <Compass size={52} strokeWidth={1.5} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Explore our hand-curated collection of world wonders, tropical beaches, and cultural hubs.</p>
          <button
            type="button"
            className="wl-btn wl-btn-primary"
            onClick={() => navigate("/explore")}
          >
            Explore Destinations <ArrowRight size={16} />
          </button>
        </section>


      ) : (

        /* ── MASONRY GRID ────────────────────────────── */
        <section className="wl-grid-wrap">
          <div className="wl-masonry">

            {wishlist.map((dest, idx) => {
              const meta     = cardMeta[dest.id] || {};
              const priority = meta.priority || null;
              const note     = meta.note || "";
              const gallery  = getGallery(dest);
              const catColor = CAT_COLOR[dest.category] || CAT_COLOR.default;
              const isTall   = idx % 5 === 1 || idx % 5 === 3; // staggered tall cards

              return (
                <article
                  className={`wl-card ${isTall ? "wl-card--tall" : ""}`}
                  key={dest.id}
                >
                  {/* IMAGE */}
                  <div className="wl-card-img-wrap">
                    <img
                      src={dest.image + "?w=600&q=85"}
                      alt={dest.name}
                      className="wl-card-img"
                      loading="eager"
                    />

                    {/* Gradient overlay */}
                    <div className="wl-img-gradient" />

                    {/* Hover overlay */}
                    <div className="wl-card-hover-overlay">
                      <button
                        className="wl-overlay-btn"
                        onClick={() => openLightbox(dest, 0)}
                        title="View gallery"
                      >
                        <ZoomIn size={15} /> Gallery
                      </button>
                      <button
                        className="wl-overlay-btn"
                        onClick={() => handleFindFlights(dest)}
                        title="Book flights"
                      >
                        <Plane size={15} /> Fly There
                      </button>
                      <button
                        className="wl-overlay-btn"
                        onClick={() => handleShare(dest)}
                        title="Share"
                      >
                        <Share2 size={15} /> Share
                      </button>
                    </div>

                    {/* Top-right: remove */}
                    <button
                      className="wl-remove-btn"
                      onClick={() => removeFromWishlist(dest.id)}
                      title="Remove from wishlist"
                      aria-label={`Remove ${dest.name}`}
                    >
                      <Heart size={16} fill="#ff385c" color="#ff385c" />
                    </button>

                    {/* Photo count badge */}
                    {gallery.length > 1 && (
                      <span className="wl-photo-count">
                        <Sparkles size={10} /> {gallery.length} Photos
                      </span>
                    )}

                    {/* Category tag */}
                    <span
                      className="wl-cat-tag"
                      style={{ background: catColor + "dd" }}
                    >
                      {dest.category}
                    </span>

                    {/* Destination name overlay at bottom */}
                    <div className="wl-img-bottom-info">
                      <h3 className="wl-card-name">{dest.name}</h3>
                      <span className="wl-card-country">
                        <MapPin size={12} /> {dest.country}
                      </span>
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="wl-card-body">

                    {/* Rating + Price row */}
                    <div className="wl-card-meta-row">
                      <div className="wl-rating">
                        <Star size={13} fill="#ffc72c" color="#ffc72c" />
                        <span>{dest.rating}</span>
                      </div>
                      <div className="wl-price">
                        <span className="wl-price-from">from</span>
                        <strong>₹{Number(dest.price||0).toLocaleString("en-IN")}</strong>
                      </div>
                    </div>

                    {/* Priority selector */}
                    <div className="wl-priority-row">
                      <Flag size={12} className="wl-priority-icon" />
                      <span className="wl-priority-label">Priority:</span>
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          className={`wl-priority-pill wl-priority-${p.key} ${priority === p.key ? "active" : ""}`}
                          onClick={() => setMeta(dest.id, { priority: priority === p.key ? null : p.key })}
                        >
                          {p.emoji} {p.label}
                        </button>
                      ))}
                    </div>

                    {/* Note */}
                    <div className="wl-note-section">
                      {activeNote === dest.id ? (
                        <div className="wl-note-edit">
                          <textarea
                            className="wl-note-textarea"
                            placeholder="Add a personal note… (e.g. Visit in spring, Need visa, Budget trip)"
                            value={note}
                            autoFocus
                            onChange={(e) => setMeta(dest.id, { note: e.target.value })}
                          />
                          <button
                            type="button"
                            className="wl-note-save-btn"
                            onClick={() => setActiveNote(null)}
                          >
                            <Check size={13} /> Save Note
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={`wl-note-trigger ${note ? "has-note" : ""}`}
                          onClick={() => setActiveNote(dest.id)}
                        >
                          <StickyNote size={13} />
                          <span>{note || "Add a note…"}</span>
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="wl-card-actions">
                      <button
                        type="button"
                        className="wl-btn wl-btn-flight"
                        onClick={() => handleFindFlights(dest)}
                      >
                        <Plane size={13} /> Book Flights
                      </button>
                      <button
                        type="button"
                        className="wl-btn wl-btn-gallery"
                        onClick={() => openLightbox(dest, 0)}
                      >
                        <ZoomIn size={13} /> Gallery
                      </button>
                    </div>

                  </div>
                </article>
              );
            })}

          </div>

          {/* Bottom actions */}
          <div className="wl-bottom-actions">
            <button
              type="button"
              className="wl-btn wl-btn-outline"
              onClick={() => navigate("/explore")}
            >
              ← Continue Exploring
            </button>
            <button
              type="button"
              className="wl-btn wl-btn-primary"
              onClick={() => navigate("/flights")}
            >
              <Plane size={15} /> Search Flights
            </button>
          </div>
        </section>

      )}


      {/* ═══════════════════════════════════════════════════
          LIGHTBOX
          ═══════════════════════════════════════════════════ */}
      {lightbox && (() => {
        const { dest, imgIdx } = lightbox;
        const imgs = getGallery(dest);
        return (
          <div
            className="wl-lightbox-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
          >
            <div className="wl-lightbox">

              {/* Close */}
              <button className="wl-lb-close" onClick={closeLightbox}>
                <X size={20} />
              </button>

              {/* Main image */}
              <div className="wl-lb-img-wrap">
                <img
                  key={imgIdx}
                  src={imgs[imgIdx]}
                  alt={`${dest.name} ${imgIdx + 1}`}
                  className="wl-lb-img"
                />

                {/* Gradient overlay for text */}
                <div className="wl-lb-gradient" />

                {/* Info at bottom */}
                <div className="wl-lb-info">
                  <h2>{dest.name}</h2>
                  <span><MapPin size={14}/> {dest.country}</span>
                </div>

                {/* Prev / Next */}
                {imgs.length > 1 && (
                  <>
                    <button className="wl-lb-nav wl-lb-prev" onClick={lightboxPrev}>
                      <ChevronLeft size={24} />
                    </button>
                    <button className="wl-lb-nav wl-lb-next" onClick={lightboxNext}>
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {imgs.length > 1 && (
                <div className="wl-lb-thumbs">
                  {imgs.map((src, i) => (
                    <button
                      key={i}
                      className={`wl-lb-thumb ${i === imgIdx ? "active" : ""}`}
                      onClick={() => setLightbox((lb) => ({ ...lb, imgIdx: i }))}
                    >
                      <img src={src.replace("w=1400", "w=200")} alt={`thumb ${i+1}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Counter */}
              <div className="wl-lb-counter">
                {imgIdx + 1} / {imgs.length}
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
