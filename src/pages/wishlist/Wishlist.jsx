import { useState } from "react";
import { useNavigate } from "react-router-dom";

import destinations from "../../data/destinations";
import { useWishlist } from "../../context/WishlistContext";

import "./Wishlist.css";

function Wishlist() {
  const navigate = useNavigate();

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist
  } = useWishlist();

  const [search, setSearch] = useState("");

  // Search destinations
  const searchResults = destinations.filter((destination) =>
    destination.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="wishlist-page">

      <div className="wishlist-container">

 {/* =========================
    WISHLIST BANNER
========================= */}

<div className="wishlist-banner">

  <div className="wishlist-banner-overlay">

    <div className="wishlist-banner-content">

      <span className="wishlist-banner-eyebrow">
        ♡ YOUR SAVED PLACES
      </span>

      <h1>
        Your Travel Wishlist
      </h1>

      <p>
        Keep your favorite destinations close
        and start planning your next adventure.
      </p>

    </div>

    <div className="wishlist-count">

      <strong>
        {wishlist.length}
      </strong>

      <span>
        {wishlist.length === 1
          ? "Destination"
          : "Destinations"}
      </span>

    </div>

  </div>

</div>
        {/* SEARCH */}

        <div className="wishlist-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search for a destination..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* SEARCH RESULTS */}

        {search && (

          <div className="wishlist-search-results">

            {searchResults.length === 0 ? (

              <p className="no-search-result">
                No destination found.
              </p>

            ) : (

              searchResults.map((destination) => {

                const alreadySaved =
                  wishlist.some(
                    (item) =>
                      item.id === destination.id
                  );

                return (

                  <div
                    className="wishlist-search-item"
                    key={destination.id}
                  >

                    <div>

                      <strong>
                        {destination.name}
                      </strong>

                      <span>
                        📍 {destination.country}
                      </span>

                    </div>


                    <button
                      className="btn btn-primary"
                      disabled={alreadySaved}
                      onClick={() => {

                        addToWishlist(destination);

                        setSearch("");

                      }}
                    >

                      {alreadySaved
                        ? "✓ Added"
                        : "♡ Add"}

                    </button>

                  </div>

                );

              })

            )}

          </div>

        )}


        {/* WISHLIST */}

        {wishlist.length === 0 ? (

          <div className="wishlist-empty card">

            <div className="empty-icon">
              🌍
            </div>

            <h2>
              Your wishlist is empty
            </h2>

            <p>
              Search for a destination above
              and add it to your wishlist.
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate("/explore")
              }
            >
              Explore Destinations →
            </button>

          </div>

        ) : (

          <>

            <div className="wishlist-grid">

              {wishlist.map((destination) => (

                <div
                  className="wishlist-card"
                  key={destination.id}
                >

                  {/* Image */}

                  <div className="wishlist-image">

                    <img
                      src={destination.image}
                      alt={destination.name}
                    />

                    <button
                      className="remove-wishlist"
                      onClick={() =>
                        removeFromWishlist(
                          destination.id
                        )
                      }
                    >
                      ♥
                    </button>

                    <span>
                      {destination.category}
                    </span>

                  </div>


                  {/* Information */}

                  <div className="wishlist-info">

                    <div className="wishlist-title">

                      <div>

                        <h2>
                          {destination.name}
                        </h2>

                        <p>
                          📍 {destination.country}
                        </p>

                      </div>

                      <div className="wishlist-rating">
                        ★ {destination.rating}
                      </div>

                    </div>


                    <div className="wishlist-details">

                      <div>

                        <span>
                          Estimated starting price
                        </span>

                        <strong>
                          ₹
                          {destination.price.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                      <button
                        className="wishlist-explore"
                        onClick={() =>
                          navigate("/explore")
                        }
                      >
                        Explore →
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>


            <div className="wishlist-bottom">

              <button
                className="btn btn-outline"
                onClick={() =>
                  navigate("/explore")
                }
              >
                ← Continue Exploring
              </button>

            </div>

          </>

        )}

      </div>

    </div>
  );
}

export default Wishlist;
