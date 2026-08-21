import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  Star,
  MapPin,
  Sparkles,
  Plane,
  ArrowRight,
  Compass,
  Check,
  Plus
} from "lucide-react";
import destinations from "../../data/destination";
import { useWishlist } from "../../context/WishlistContext";
import "./Wishlist.css";

export default function Wishlist() {
  const navigate = useNavigate();

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist
  } = useWishlist();

  const [search, setSearch] = useState("");

  // Search destinations safely from destinations array
  const destinationList = Array.isArray(destinations) ? destinations : [];
  const searchResults = search.trim() === ""
    ? []
    : destinationList.filter((destination) =>
        destination.name.toLowerCase().includes(search.toLowerCase()) ||
        destination.country.toLowerCase().includes(search.toLowerCase())
      );

  const handlePlanAI = (destinationName) => {
    navigate("/ai-planner", {
      state: {
        initialQuery: `Plan a luxury 5-day holiday to ${destinationName} with top hotel and activity recommendations`,
      }
    });
  };

  const handleFindFlights = (destination) => {
    navigate("/flights", {
      state: {
        prefillDestination: destination.name,
      }
    });
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">

        {/* Wishlist Banner */}
        <div className="wishlist-banner">
          <div className="wishlist-banner-overlay">
            <div className="wishlist-banner-content">
              <div className="wishlist-banner-eyebrow">
                <Heart size={14} className="fill-amber" />
                <span>YOUR SAVED PLACES</span>
              </div>

              <h1>Your Travel Wishlist</h1>

              <p>
                Keep your bucket-list destinations organized and instantly launch AI itineraries or book flights in one click.
              </p>
            </div>

            <div className="wishlist-count-badge">
              <strong>{wishlist.length}</strong>
              <span>{wishlist.length === 1 ? "Destination Saved" : "Destinations Saved"}</span>
            </div>
          </div>
        </div>

        {/* Search & Add bar */}
        <div className="wishlist-search-section">
          <div className="wishlist-search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search & quick-add destinations (e.g. Paris, Tokyo, Bali, Dubai)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch("")}
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Search Dropdown Results */}
          {search && (
            <div className="wishlist-search-results card">
              {searchResults.length === 0 ? (
                <p className="no-search-result">
                  No matching destinations found. Try searching for Paris, Tokyo, Bali, Rome, Maldives, etc.
                </p>
              ) : (
                <div className="search-results-grid">
                  {searchResults.map((dest) => {
                    const alreadySaved = wishlist.some((item) => item.id === dest.id);

                    return (
                      <div className="wishlist-search-item" key={dest.id}>
                        <div className="search-item-info">
                          <img src={dest.image} alt={dest.name} className="search-item-thumb" />
                          <div>
                            <strong>{dest.name}</strong>
                            <span className="search-item-country">
                              <MapPin size={12} /> {dest.country} · {dest.category}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`btn ${alreadySaved ? "btn-outline saved" : "btn-primary"}`}
                          disabled={alreadySaved}
                          onClick={() => {
                            addToWishlist(dest);
                            setSearch("");
                          }}
                        >
                          {alreadySaved ? (
                            <>
                              <Check size={14} /> Added
                            </>
                          ) : (
                            <>
                              <Plus size={14} /> Add to Wishlist
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saved Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="wishlist-empty card">
            <div className="empty-globe-icon">
              <Compass size={48} strokeWidth={1.75} />
            </div>

            <h2>Your wishlist is empty</h2>

            <p>
              Explore our hand-curated collection of world wonders, tropical beaches, and cultural hubs.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/explore")}
            >
              Explore Destinations <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="wishlist-grid">
              {wishlist.map((destination) => (
                <div className="wishlist-card" key={destination.id}>
                  {/* Image */}
                  <div className="wishlist-image-wrap">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      loading="lazy"
                    />

                    <button
                      type="button"
                      className="remove-wishlist-btn"
                      title="Remove from wishlist"
                      onClick={() => removeFromWishlist(destination.id)}
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={18} fill="#ff385c" color="#ff385c" />
                    </button>

                    <span className="wishlist-category-tag">
                      {destination.category}
                    </span>
                  </div>

                  {/* Information */}
                  <div className="wishlist-body">
                    <div className="wishlist-header-row">
                      <div>
                        <h3 className="wishlist-dest-name">
                          {destination.name}
                        </h3>
                        <span className="wishlist-dest-country">
                          <MapPin size={14} /> {destination.country}
                        </span>
                      </div>

                      <div className="rating-pill">
                        <Star size={13} fill="#ffc72c" color="#ffc72c" />
                        <span>{destination.rating}</span>
                      </div>
                    </div>

                    <div className="wishlist-pricing-row">
                      <div className="price-stack">
                        <span className="price-label">Starting from</span>
                        <strong className="price-value">
                          ₹{destination.price.toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    <div className="wishlist-actions-row">
                      <button
                        type="button"
                        className="btn-action btn-ai"
                        onClick={() => handlePlanAI(destination.name)}
                        title="Generate AI Itinerary"
                      >
                        <Sparkles size={14} /> AI Planner
                      </button>

                      <button
                        type="button"
                        className="btn-action btn-flight"
                        onClick={() => handleFindFlights(destination)}
                        title="Find flights to this destination"
                      >
                        <Plane size={14} /> Flights
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="wishlist-bottom-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/explore")}
              >
                ← Continue Exploring
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/ai-planner")}
              >
                <Sparkles size={16} /> Plan Master Trip with AI
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
