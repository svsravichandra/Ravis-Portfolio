import { useEffect, useRef, useState, useMemo } from "react";

export default function HexagonalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    // Listen to window mouse events instead of container
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate hexagonal pattern - memoized for performance
  const hexagons = useMemo(() => {
    const hexSize = 40;
    const hexWidth = hexSize * 2;
    const hexHeight = hexSize * Math.sqrt(3);
    const horizontalSpacing = hexWidth * 0.75;
    const verticalSpacing = hexHeight;

    const getHexagonPoints = (centerX: number, centerY: number, size: number) => {
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = centerX + size * Math.cos(angle);
        const y = centerY + size * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      return points.join(' ');
    };

    const hexagons = [];
    const cols = Math.ceil(window.innerWidth / horizontalSpacing) + 2;
    const rows = Math.ceil(window.innerHeight / verticalSpacing) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * horizontalSpacing;
        const y = row * verticalSpacing + (col % 2 === 1 ? verticalSpacing / 2 : 0);
        
        hexagons.push({
          id: `hex-${row}-${col}`,
          x,
          y,
          points: getHexagonPoints(x, y, hexSize)
        });
      }
    }
    return hexagons;
  }, []);

  const getDistanceFromMouse = (hexX: number, hexY: number) => {
    const dx = mousePosition.x - hexX;
    const dy = mousePosition.y - hexY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ minWidth: '100vw', minHeight: '100vh' }}
      >
        <defs>
          {/* Glow filters for neon effect */}
          <filter id="hexGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="hexGlowActive" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Gradient definitions */}
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="50%" stopColor="rgba(34, 197, 94, 0.2)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.3)" />
          </linearGradient>

          <linearGradient id="neonGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="50%" stopColor="rgba(34, 197, 94, 0.6)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.8)" />
          </linearGradient>
        </defs>

        {hexagons.map((hex) => {
          const distance = getDistanceFromMouse(hex.x, hex.y);
          const maxDistance = 150;
          const isActive = distance < maxDistance;
          const intensity = isActive ? Math.max(0, 1 - distance / maxDistance) : 0;
          
          return (
            <g key={hex.id}>
              {/* Base hexagon */}
              <polygon
                points={hex.points}
                fill="none"
                stroke={isActive ? "url(#neonGradientActive)" : "url(#neonGradient)"}
                strokeWidth={isActive ? 1.5 : 0.5}
                opacity={isActive ? 0.3 + intensity * 0.7 : 0.15}
                filter={isActive ? "url(#hexGlowActive)" : "url(#hexGlow)"}
                className="transition-all duration-300 ease-out"
                style={{
                  transform: isActive ? `scale(${1 + intensity * 0.05})` : 'scale(1)',
                  transformOrigin: `${hex.x}px ${hex.y}px`
                }}
              />
              
              {/* Inner glow effect for active hexagons */}
              {isActive && intensity > 0.3 && (
                <polygon
                  points={hex.points}
                  fill={`rgba(59, 130, 246, ${intensity * 0.1})`}
                  stroke="none"
                  opacity={intensity * 0.5}
                  className="transition-all duration-200 ease-out"
                />
              )}
              
              {/* Center dot for highly active hexagons */}
              {isActive && intensity > 0.6 && (
                <circle
                  cx={hex.x}
                  cy={hex.y}
                  r={2}
                  fill="rgba(34, 197, 94, 0.8)"
                  filter="url(#hexGlow)"
                  opacity={intensity}
                  className="transition-all duration-200 ease-out"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Overlay for subtle background darkening */}
      <div 
        className="absolute inset-0 bg-black/5 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(59, 130, 246, 0.02) 0%, 
            rgba(0, 0, 0, 0.05) 50%, 
            rgba(0, 0, 0, 0.08) 100%)`
        }}
      />
      
      {/* Debug cursor position indicator */}
      <div 
        className="fixed w-6 h-6 rounded-full bg-cyan-500/30 border-2 border-cyan-400 pointer-events-none z-50"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
        }}
      />
    </div>
  );
}