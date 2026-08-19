import { useEffect, useRef } from 'react';

// World city coordinates mapped to spherical coordinates (lat, lon)
const WORLD_CITIES = [
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, flag: 'HND' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, flag: 'CDG' },
  { name: 'New York', lat: 40.7128, lon: -74.006, flag: 'JFK' },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, flag: 'DXB' },
  { name: 'London', lat: 51.5074, lon: -0.1278, flag: 'LHR' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, flag: 'SIN' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, flag: 'SYD' },
  { name: 'Cairo', lat: 30.0444, lon: 31.2357, flag: 'CAI' },
  { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, flag: 'GIG' },
  { name: 'New Delhi', lat: 28.6139, lon: 77.209, flag: 'DEL' },
  { name: 'Bali', lat: -8.4095, lon: 115.1889, flag: 'DPS' },
  { name: 'Reykjavik', lat: 64.1466, lon: -21.9426, flag: 'KEF' },
];

// Active flight routes between global hubs
const FLIGHT_ROUTES = [
  { from: 'New York', to: 'London', color: '#60a5fa' },
  { from: 'London', to: 'Dubai', color: '#93c5fd' },
  { from: 'Dubai', to: 'Singapore', color: '#38bdf8' },
  { from: 'Singapore', to: 'Tokyo', color: '#60a5fa' },
  { from: 'Tokyo', to: 'Sydney', color: '#38bdf8' },
  { from: 'Paris', to: 'New Delhi', color: '#93c5fd' },
  { from: 'New Delhi', to: 'Bali', color: '#60a5fa' },
  { from: 'London', to: 'Cairo', color: '#38bdf8' },
  { from: 'New York', to: 'Rio de Janeiro', color: '#93c5fd' },
  { from: 'London', to: 'Reykjavik', color: '#60a5fa' },
];

export default function WorldGlobeBackground({ isPlaying = true }) {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);
  const rotationRef = useRef({ x: 0.2, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate globe surface particle points (Fibonacci Sphere Algorithm)
    const NUM_DOTS = 1400;
    const dots = [];
    const radius = Math.min(width, height) * 0.42;

    for (let i = 0; i < NUM_DOTS; i++) {
      const phi = Math.acos(-1 + (2 * i) / NUM_DOTS);
      const theta = Math.sqrt(NUM_DOTS * Math.PI) * phi;

      // Filter to shape continental clusters
      const lat = (Math.PI / 2 - phi) * (180 / Math.PI);
      const lon = (theta % (2 * Math.PI)) * (180 / Math.PI) - 180;

      // Approximate continent density mask
      const isLand =
        (lat > 10 && lat < 70 && lon > -130 && lon < -60) || // North America
        (lat > -55 && lat < 12 && lon > -80 && lon < -35) ||  // South America
        (lat > 35 && lat < 70 && lon > -10 && lon < 50) ||    // Europe
        (lat > -35 && lat < 35 && lon > -20 && lon < 50) ||   // Africa
        (lat > 5 && lat < 75 && lon > 50 && lon < 150) ||    // Asia
        (lat > -45 && lat < -10 && lon > 110 && lon < 155);  // Australia

      dots.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: -Math.cos(phi),
        z: Math.sin(theta) * Math.sin(phi),
        isLand: isLand,
        baseAlpha: isLand ? 0.75 : 0.15,
        size: isLand ? 1.6 : 0.9,
      });
    }

    // Starfield particles in space background
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * 0.02 + 0.005,
    }));

    let flightProgress = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient backdrop
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        radius * 0.2,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0a2342');
      bgGrad.addColorStop(0.5, '#07172c');
      bgGrad.addColorStop(1, '#030a14');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Twinkling Stars
      stars.forEach((star) => {
        star.alpha += star.twinkle;
        if (star.alpha > 1 || star.alpha < 0.2) star.twinkle = -star.twinkle;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const centerX = width * 0.5;
      const centerY = height * 0.52;
      const globeRadius = Math.min(width, height) * 0.38;

      // Auto rotation when playing
      if (isPlaying && !isDraggingRef.current) {
        rotationRef.current.y += 0.0035;
      }
      flightProgress = (flightProgress + 0.008) % 1;

      const rotY = rotationRef.current.y;
      const rotX = rotationRef.current.x;

      // Outer Atmospheric Glowing Halo
      const haloGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.85,
        centerX,
        centerY,
        globeRadius * 1.35
      );
      haloGrad.addColorStop(0, 'rgba(26, 115, 232, 0.22)');
      haloGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.08)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Globe Sphere Silhouette
      const sphereGrad = ctx.createRadialGradient(
        centerX - globeRadius * 0.3,
        centerY - globeRadius * 0.3,
        globeRadius * 0.1,
        centerX,
        centerY,
        globeRadius
      );
      sphereGrad.addColorStop(0, '#0c2e59');
      sphereGrad.addColorStop(0.7, '#071c36');
      sphereGrad.addColorStop(1, '#020914');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Project spherical coordinates with 3D rotation
      const project = (x, y, z) => {
        // Y-axis rotation
        let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
        let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);

        // X-axis rotation
        let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        return {
          screenX: centerX + x1 * globeRadius,
          screenY: centerY + y2 * globeRadius,
          z: z2,
          visible: z2 > 0,
        };
      };

      // Draw Globe Mesh Grid Lines (Latitude & Longitude)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 0.8;
      for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
        const phi = (90 - latDeg) * (Math.PI / 180);
        ctx.beginPath();
        let first = true;
        for (let lonDeg = 0; lonDeg <= 360; lonDeg += 10) {
          const theta = lonDeg * (Math.PI / 180);
          const px = Math.cos(theta) * Math.sin(phi);
          const py = -Math.cos(phi);
          const pz = Math.sin(theta) * Math.sin(phi);
          const p = project(px, py, pz);
          if (p.visible) {
            if (first) {
              ctx.moveTo(p.screenX, p.screenY);
              first = false;
            } else {
              ctx.lineTo(p.screenX, p.screenY);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Draw Continental Particles
      dots.forEach((dot) => {
        const p = project(dot.x, dot.y, dot.z);
        if (p.visible) {
          const depthAlpha = ((p.z + 1) / 2) * dot.baseAlpha;
          ctx.fillStyle = dot.isLand
            ? `rgba(96, 165, 250, ${depthAlpha})`
            : `rgba(30, 58, 138, ${depthAlpha * 0.5})`;
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, dot.size * (0.8 + p.z * 0.4), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // City Coordinates Helper
      const cityMap = {};
      WORLD_CITIES.forEach((city) => {
        const phi = (90 - city.lat) * (Math.PI / 180);
        const theta = (city.lon + 180) * (Math.PI / 180);
        const px = -Math.sin(theta) * Math.sin(phi);
        const py = -Math.cos(phi);
        const pz = Math.cos(theta) * Math.sin(phi);
        cityMap[city.name] = { ...city, proj: project(px, py, pz) };
      });

      // Draw Animated Parabolic Flight Routes
      FLIGHT_ROUTES.forEach((route, idx) => {
        const from = cityMap[route.from];
        const to = cityMap[route.to];
        if (!from || !to) return;

        const p1 = from.proj;
        const p2 = to.proj;

        if (p1.visible || p2.visible) {
          // Midpoint elevated curve
          const midX = (p1.screenX + p2.screenX) / 2;
          const midY = (p1.screenY + p2.screenY) / 2 - globeRadius * 0.22;

          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.quadraticCurveTo(midX, midY, p2.screenX, p2.screenY);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Animated Flight Plane Pulse
          const t = (flightProgress + idx * 0.12) % 1;
          const currentX = (1 - t) * (1 - t) * p1.screenX + 2 * (1 - t) * t * midX + t * t * p2.screenX;
          const currentY = (1 - t) * (1 - t) * p1.screenY + 2 * (1 - t) * t * midY + t * t * p2.screenY;

          // Glowing pulse on route
          const pulseGrad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
          pulseGrad.addColorStop(0, '#ffffff');
          pulseGrad.addColorStop(0.4, '#38bdf8');
          pulseGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = pulseGrad;
          ctx.beginPath();
          ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Global City Radar Pins & Badges
      Object.values(cityMap).forEach((city) => {
        const p = city.proj;
        if (p.visible && p.z > 0.15) {
          const pulse = (Math.sin(Date.now() * 0.005 + p.screenX) + 1) / 2;

          // Outer Radar Ripple
          ctx.strokeStyle = `rgba(255, 199, 44, ${0.7 - pulse * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, 3 + pulse * 6, 0, Math.PI * 2);
          ctx.stroke();

          // Core Pin Point
          ctx.fillStyle = '#ffc72c';
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // City Label Tag
          ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillText(city.name, p.screenX + 6, p.screenY + 3);
        }
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    // Mouse Interaction for interactive globe rotation
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      rotationRef.current.y += deltaX * 0.005;
      rotationRef.current.x = Math.max(-0.6, Math.min(0.6, rotationRef.current.x - deltaY * 0.005));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const canvasEl = canvasRef.current;
    canvasEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (canvasEl) canvasEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPlaying]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'grab',
      }}
      title="Click and drag to rotate the 3D world globe"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
