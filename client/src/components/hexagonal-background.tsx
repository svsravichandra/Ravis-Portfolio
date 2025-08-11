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

  // Skills data with icons
  const skills = [
    { name: 'HTML5', icon: 'fab fa-html5', color: '#E34F26' },
    { name: 'CSS3', icon: 'fab fa-css3-alt', color: '#1572B6' },
    { name: 'JavaScript', icon: 'fab fa-js-square', color: '#F7DF1E' },
    { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: '#339933' },
    { name: 'Python', icon: 'fab fa-python', color: '#3776AB' },
    { name: 'Git', icon: 'fab fa-git-alt', color: '#F05032' },
    { name: 'Docker', icon: 'fab fa-docker', color: '#2496ED' },
    { name: 'AWS', icon: 'fab fa-aws', color: '#FF9900' },
    { name: 'TypeScript', icon: 'fas fa-code', color: '#3178C6' },
    { name: 'Vue.js', icon: 'fab fa-vuejs', color: '#4FC08D' },
    { name: 'Angular', icon: 'fab fa-angular', color: '#DD0031' },
    { name: 'Sass', icon: 'fab fa-sass', color: '#CC6699' },
    { name: 'Bootstrap', icon: 'fab fa-bootstrap', color: '#7952B3' },
    { name: 'WordPress', icon: 'fab fa-wordpress', color: '#21759B' },
    { name: 'GitHub', icon: 'fab fa-github', color: '#181717' },
    { name: 'NPM', icon: 'fab fa-npm', color: '#CB3837' },
    { name: 'Linux', icon: 'fab fa-linux', color: '#FCC624' },
    { name: 'Database', icon: 'fas fa-database', color: '#336791' },
    { name: 'API', icon: 'fas fa-plug', color: '#FF6B6B' },
    { name: 'Mobile', icon: 'fas fa-mobile-alt', color: '#4ECDC4' },
    { name: 'Cloud', icon: 'fas fa-cloud', color: '#45B7D1' },
    { name: 'AI/ML', icon: 'fas fa-brain', color: '#9B59B6' },
    { name: 'Analytics', icon: 'fas fa-chart-line', color: '#E67E22' }
  ];

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
        
        // Assign a skill to each hexagon (cycling through the list)
        const skillIndex = (row * cols + col) % skills.length;
        const skill = skills[skillIndex];
        
        hexagons.push({
          id: `hex-${row}-${col}`,
          x,
          y,
          points: getHexagonPoints(x, y, hexSize),
          skill
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
                fill={isActive ? `${hex.skill.color}20` : "rgba(255, 255, 255, 0.02)"}
                stroke={isActive ? "url(#neonGradientActive)" : "url(#neonGradient)"}
                strokeWidth={isActive ? 1.5 : 0.5}
                opacity={isActive ? 0.6 + intensity * 0.4 : 0.25}
                filter={isActive ? "url(#hexGlowActive)" : "url(#hexGlow)"}
                className="transition-all duration-300 ease-out"
                style={{
                  transform: isActive ? `scale(${1 + intensity * 0.08})` : 'scale(1)',
                  transformOrigin: `${hex.x}px ${hex.y}px`
                }}
              />
              
              {/* Skill icon using foreignObject */}
              <foreignObject
                x={hex.x - 12}
                y={hex.y - 12}
                width="24"
                height="24"
                className="pointer-events-none"
                style={{
                  transform: isActive ? `scale(${1 + intensity * 0.2})` : 'scale(1)',
                  transformOrigin: 'center',
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <i 
                    className={`${hex.skill.icon} text-lg transition-all duration-300`}
                    style={{
                      color: isActive ? hex.skill.color : `${hex.skill.color}80`,
                      filter: isActive ? `drop-shadow(0 0 ${intensity * 8}px ${hex.skill.color})` : 'none',
                      opacity: isActive ? 0.8 + intensity * 0.2 : 0.4
                    }}
                  />
                </div>
              </foreignObject>
              
              {/* Enhanced glow ring for active hexagons */}
              {isActive && intensity > 0.4 && (
                <circle
                  cx={hex.x}
                  cy={hex.y}
                  r={30}
                  fill="none"
                  stroke={hex.skill.color}
                  strokeWidth={1}
                  opacity={intensity * 0.3}
                  filter="url(#hexGlow)"
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
      

    </div>
  );
}