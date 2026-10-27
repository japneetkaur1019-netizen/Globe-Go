import { useState, useEffect } from 'react';
import DestinationWeather from './DestinationWeather.jsx';
import homeData from '../data/db.json';
import { Play, Pause, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const REEL_DESTINATIONS = homeData.reelDestinations;

export default function DynamicHeroReel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REEL_DESTINATIONS.length);
    }, 4800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % REEL_DESTINATIONS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + REEL_DESTINATIONS.length) % REEL_DESTINATIONS.length);
  };

  const currentDest = REEL_DESTINATIONS[currentIndex];

  return (
    <div className="hero-reel-container">
      {REEL_DESTINATIONS.map((dest, idx) => (
        <div
          key={dest.id}
          className={`hero-reel-slide ${idx === currentIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${dest.image})`,
          }}
        />
      ))}

      {/* Cinematic Dark Overlay */}
      <div className="hero-reel-overlay" />

      {/* Top Destination Badge & Control Row */}
      <div className="hero-reel-badge-row">
        <div className="hero-reel-destination-pill" key={currentDest.id}>
          <MapPin size={15} className="reel-pin-icon" />
          <span className="reel-dest-name">{currentDest.title}</span>
          <span className="reel-dest-separator">•</span>
          <DestinationWeather destination={currentDest} />
        </div>

        {/* Play/Pause, Slide Navigation & Interactive Dots */}
        <div className="hero-reel-controls-group">
          <button
            type="button"
            className="hero-reel-nav-btn"
            onClick={prevSlide}
            aria-label="Previous destination"
            title="Previous destination"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="hero-reel-inline-dots">
            {REEL_DESTINATIONS.map((dest, idx) => (
              <button
                key={dest.id}
                type="button"
                className={`hero-reel-inline-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to ${dest.title}`}
                title={dest.title}
              />
            ))}
          </div>

          <button
            type="button"
            className="hero-reel-toggle-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label="Toggle auto reel"
            title={isPlaying ? 'Pause auto-changing reel' : 'Resume auto-changing reel'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Live Reel' : 'Paused'}</span>
          </button>

          <button
            type="button"
            className="hero-reel-nav-btn"
            onClick={nextSlide}
            aria-label="Next destination"
            title="Next destination"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
