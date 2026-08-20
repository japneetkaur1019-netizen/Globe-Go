import { useMemo, useState } from "react";
import destinations from "../../data/destination";

import { useWishlist } from "../../context/WishlistContext";

import "./Explore.css";

function Explore() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
const {
  addToWishlist,
  removeFromWishlist,
  isInWishlist
} = useWishlist();
  const categories = [
    "All",
    "Beach",
    "Adventure",
    "Romantic",
    "Luxury",
    "Culture",
    "City"
  ];

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {

    let result = destinations.filter((destination) => {

      const matchesSearch =
        destination.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        destination.country
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        destination.category === category;

      return matchesSearch && matchesCategory;
    });

    // Sorting
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


  return (

    <div className="explore-page">

      {/* Hero */}

      <section className="explore-hero">

        <div className="explore-hero-content">

          <p className="flight-label">
            EXPLORE THE WORLD
          </p>

          <h1>
            Where will you go next?
          </h1>

          <p>
            Discover amazing destinations and
            plan your next unforgettable journey.
          </p>

        </div>

      </section>


      <div className="explore-container">

        {/* Search + Sort */}

        <div className="explore-controls">

          <div className="destination-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search destinations or countries..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
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


        {/* Categories */}

        <div className="category-section">

          <h3>Explore by interest</h3>

          <div className="category-pills">

            {categories.map((item) => (

              <button
                key={item}
                className={
                  category === item
                    ? "category-pill active"
                    : "category-pill"
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>

            ))}

          </div>

        </div>


        {/* Results */}

        <div className="explore-heading">

          <div>

            <p className="flight-label">
              DESTINATIONS
            </p>

            <h2>
              Discover your next adventure
            </h2>

          </div>

          <span>
            {filteredDestinations.length} places
          </span>

        </div>


        {/* Destination Cards */}

        {filteredDestinations.length === 0 ? (

          <div className="explore-empty card">

            <div>🌍</div>

            <h2>
              No destinations found
            </h2>

            <p>
              Try another destination or category.
            </p>

          </div>

        ) : (

          <div className="destination-grid">

            {filteredDestinations.map(
              (destination) => (

                <div
                  className="destination-card"
                  key={destination.id}
                >

                  <div className="destination-image">

                    <img
                      src={destination.image}
                      alt={destination.name}
                    />

                   <button
  className={
    isInWishlist(destination.id)
      ? "wishlist-button saved"
      : "wishlist-button"
  }
  onClick={() => {

    if (isInWishlist(destination.id)) {

      removeFromWishlist(destination.id);

    } else {

      addToWishlist(destination);

    }

  }}
>
  {isInWishlist(destination.id) ? "♥" : "♡"}
</button>

                    <span className="destination-category">
                      {destination.category}
                    </span>

                  </div>


                  <div className="destination-info">

                    <div className="destination-title">

                      <div>

                        <h3>
                          {destination.name}
                        </h3>

                        <p>
                          📍 {destination.country}
                        </p>

                      </div>

                      <span className="rating">
                        ★ {destination.rating}
                      </span>

                    </div>


                    <div className="destination-bottom">

                      <div>

                        <span>
                          Starting from
                        </span>

                        <strong>
                          ₹{destination.price.toLocaleString("en-IN")}
                        </strong>

                      </div>

                      <button className="view-button">
                        Explore →
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}


export default Explore;