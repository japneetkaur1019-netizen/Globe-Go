import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinationWeather } from '../store/weatherSlice.js';

export default function DestinationWeather({ destination }) {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather.byDestination[destination.id]);

  useEffect(() => {
    dispatch(fetchDestinationWeather(destination));
  }, [dispatch, destination]);

  if (weather?.status === 'failed') {
    return (
      <button className="hero-reel-toggle-btn" type="button"
        title={weather.error} aria-label={`Retry weather for ${destination.title}`}
        onClick={() => dispatch(fetchDestinationWeather(destination))}>
        Weather unavailable · Retry
      </button>
    );
  }
  return (
    <span className="reel-dest-tag" aria-live="polite">
      {weather?.status === 'succeeded' ? (
        <span title={`Current temperature for ${destination.title}, reported ${weather.time} local time`}>
          {Math.round(weather.temperature)}°C now · <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>
        </span>
      ) : 'Loading weather…'}
    </span>
  );
}
