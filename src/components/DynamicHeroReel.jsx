import { useState, useEffect } from 'react';
import { Play, Pause, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const REEL_DESTINATIONS = [
  {
    id: 'santorini',
    title: 'Santorini, Greece',
    subtitle: 'Aegean Sea Cliffside Villas & Windmills at Dusk',
    tag: 'Mediterranean Sunset',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2200&q=85',
  },
  {
    id: 'istanbul',
    title: 'Istanbul, Turkey',
    subtitle: 'Bosphorus Bridge & City Lights over the Strait',
    tag: 'Historic Skyline',
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=2200&q=85',
  },
  {
    id: 'chiangmai',
    title: 'Chiang Mai, Thailand',
    subtitle: 'Yi Peng Lantern Festival Floating into Night Skies',
    tag: 'Golden Lanterns',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2200&q=85',
  },
  {
    id: 'norway',
    title: 'Lofoten Islands, Norway',
    subtitle: 'Emerald Aurora Borealis dancing over Snowy Fjords',
    tag: 'Northern Lights',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2200&q=85',
  },
  {
    id: 'newyork',
    title: 'New York City, USA',
    subtitle: 'Golden Hour Sunset over Manhattan & Harbor',
    tag: 'Iconic Metropolis',
    image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=2200&q=85',
  },
  {
    id: 'kyoto',
    title: 'Kyoto, Japan',
    subtitle: 'Ancient Pagodas & Lantern-lit Temples at Twilight',
    tag: 'Cultural Heritage',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2200&q=85',
  },
  {
    id: 'swissalps',
    title: 'Zermatt, Switzerland',
    subtitle: 'Sunset Alpine Glow on Snow-Capped Matterhorn',
    tag: 'Alpine Wonder',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2200&q=85',
  },
  {
    id: 'bali',
    title: 'Uluwatu, Bali',
    subtitle: 'Cliffside Ocean Temple & Golden Coral Sunsets',
    tag: 'Tropical Paradise',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2200&q=85',
  },
];

export default function DynamicHeroReel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance slideshow like a cinematic travel video
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
      {/* Background Slides with Ken Burns Motion */}
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
          <span className="reel-dest-tag">{currentDest.tag}</span>
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
