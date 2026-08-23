import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Star,
  MapPin,
  Sparkles,
  Plane,
  SlidersHorizontal,
  Compass
} from "lucide-react";

import destinations from "../../data/destination";
import { useWishlist } from "../../context/WishlistContext";

import "./Explore.css";

const DESTINATION_LIST = Array.isArray(destinations)
  ? destinations
  : [];

const CATEGORIES = [
  "All",
  "Beach",
  "Adventure",
  "Culture",
  "Romantic",
  "Nature",
  "Luxury"
];

/* =========================================================
   OPTIMIZE UNSPLASH IMAGES
   ========================================================= */

const getOptimizedImage = (url, width = 800) => {
  if (!url) return "";

  return `${url}?auto=format&fit=crop&w=${width}&q=75`;
};

/* =========================================================
   EXPLORE PAGE
   ========================================================= */

export default function Explore() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  } = useWishlist();

  /* =========================================================
     FILTER + SORT DESTINATIONS
     ========================================================= */

  const filteredDestinations = useMemo(() => {
    let result = DESTINATION_LIST.filter((destination) => {
      const name = destination.name?.toLowerCase() || "";
      const country = destination.country?.toLowerCase() || "";
      const searchValue = search.toLowerCase();

      const matchesSearch =
        name.includes(searchValue) ||
        country.includes(searchValue);

      const matchesCategory =
        category === "All" ||
        destination.category === category;

      return matchesSearch && matchesCategory;
    });

    /* SORTING */

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, category, sortBy]);

  /* =========================================================
     AI PLANNER
     ========================================================= */

  const handlePlanAI = (destName) => {
    navigate("/ai-planner", {
      state: {
        initialQuery: `Plan a 5-day trip to ${destName} with best attractions and hotels`
      }
    });
  };

  /* =========================================================
     FIND FLIGHTS
     ========================================================= */

  const handleFindFlights = (destination) => {
    navigate("/flights", {
      state: {
        prefillDestination: destination.name
      }
    });
  };

  /* =========================================================
     RESET FILTERS
     ========================================================= */

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("rating");
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="explore-page">

      {/* =====================================================
          HERO BANNER
      ===================================================== */}

      <section className="explore-hero">

        <div className="explore-hero-content">

          <div className="explore-hero-pill">
            <Compass size={15} />

            <span>
              CURATED DESTINATIONS
            </span>
          </div>

          <h1>
            Where will you go next?
          </h1>

          <p>
            Discover breathtaking global destinations,
            verified traveler ratings, and seamlessly
            generate custom AI itineraries.
          </p>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="explore-container">

        {/* ===================================================
            SEARCH + SORT
        =================================================== */}

        <div className="explore-controls card">

          {/* SEARCH */}

          <div className="destination-search">

            <Search
              size={18}
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Search destinations or countries (e.g. Paris, Tokyo, Bali)..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search-link"
                onClick={() => setSearch("")}
              >
                Clear
              </button>
            )}

          </div>

          {/* SORT */}

          <div className="sort-controls">

            <SlidersHorizontal
              size={16}
              className="sort-icon"
            />

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              aria-label="Sort destinations"
            >

              <option value="rating">
                Highest Rated
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

            </select>

          </div>

        </div>

        {/* ===================================================
            CATEGORY SECTION
        =================================================== */}

        <div className="category-section">

          <div className="category-header">

            <h3>
              Explore by travel interest
            </h3>

            <span className="category-count">
              {filteredDestinations.length} places available
            </span>

          </div>

          <div className="category-pills">

            {CATEGORIES.map((item) => (

              <button
                key={item}
                type="button"
                className={`category-pill${
                  category === item
                    ? " active"
                    : ""
                }`}
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        {/* ===================================================
            DESTINATION RESULTS
        =================================================== */}

        {filteredDestinations.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="explore-empty card">

            <div className="empty-icon-wrap">
              <Compass
                size={44}
                strokeWidth={1.75}
              />
            </div>

            <h2>
              No destinations found
            </h2>

            <p>
              Try adjusting your search query or
              selecting a different category filter.
            </p>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>

          </div>

        ) : (

          /* =================================================
             DESTINATION GRID
          ================================================= */

          <div className="destination-grid">

            {filteredDestinations.map(
              (destination, index) => {

                const saved =
                  isInWishlist(destination.id);

                return (

                  <div
                    className="destination-card"
                    key={destination.id}
                  >

                    {/* =====================================
                        IMAGE
                    ===================================== */}

                    <div className="destination-image">

                      <img
                        src={getOptimizedImage(
                          destination.image
                        )}
                        alt={destination.name}
                        loading={
                          index < 6
                            ? "eager"
                            : "lazy"
                        }
                        decoding="async"
                      />

                      {/* =================================
                          WISHLIST
                      ================================= */}

                      <button
                        type="button"
                        className={`wishlist-button${
                          saved
                            ? " saved"
                            : ""
                        }`}
                        title={
                          saved
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        aria-label={
                          saved
                            ? `Remove ${destination.name} from wishlist`
                            : `Add ${destination.name} to wishlist`
                        }
                        onClick={() => {

                          if (saved) {

                            removeFromWishlist(
                              destination.id
                            );

                          } else {

                            addToWishlist(
                              destination
                            );

                          }

                        }}
                      >

                        <Heart
                          size={18}
                          fill={
                            saved
                              ? "#ff385c"
                              : "none"
                          }
                          color={
                            saved
                              ? "#ff385c"
                              : "#ffffff"
                          }
                        />

                      </button>

                      {/* =================================
                          CATEGORY
                      ================================= */}

                      <span className="destination-category">
                        {destination.category}
                      </span>

                    </div>

                    {/* =====================================
                        DESTINATION INFORMATION
                    ===================================== */}

                    <div className="destination-info">

                      <div className="destination-title">

                        <div>

                          <h3>
                            {destination.name}
                          </h3>

                          <p className="destination-country">

                            <MapPin size={13} />

                            {destination.country}

                          </p>

                        </div>

                        {/* ===============================
                            RATING
                        =============================== */}

                        <div className="rating-badge">

                          <Star
                            size={13}
                            fill="#ffc72c"
                            color="#ffc72c"
                          />

                          <span>
                            {destination.rating}
                          </span>

                        </div>

                      </div>

                      {/* =================================
                          CARD BOTTOM
                      ================================= */}

                      <div className="destination-bottom">

                        {/* PRICE */}

                        <div className="price-box">

                          <span className="price-tag-label">
                            Starting from
                          </span>

                          <strong>
                            ₹
                            {destination.price.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                        {/* ACTION BUTTONS */}

                        <div className="destination-actions">

                          {/* AI PLAN */}

                          <button
                            type="button"
                            className="btn-card btn-plan-ai"
                            onClick={() =>
                              handlePlanAI(
                                destination.name
                              )
                            }
                            title="Generate AI itinerary"
                          >

                            <Sparkles size={14} />

                            AI Plan

                          </button>

                          {/* FLIGHTS */}

                          <button
                            type="button"
                            className="btn-card btn-flights"
                            onClick={() =>
                              handleFindFlights(
                                destination
                              )
                            }
                            title="Search flights"
                          >

                            <Plane size={14} />

                            Flights

                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}