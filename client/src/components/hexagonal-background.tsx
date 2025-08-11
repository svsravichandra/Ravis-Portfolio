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

  // Skills data with copyright-safe representations
  const skills = [
    { name: 'HTML', abbrev: 'H5', color: '#E34F26', shape: 'square' },
    { name: 'CSS', abbrev: 'C3', color: '#1572B6', shape: 'triangle' },
    { name: 'JavaScript', abbrev: 'JS', color: '#F7DF1E', shape: 'circle' },
    { name: 'React', abbrev: 'R', color: '#61DAFB', shape: 'hexagon' },
    { name: 'Node.js', abbrev: 'N', color: '#339933', shape: 'diamond' },
    { name: 'Python', abbrev: 'PY', color: '#3776AB', shape: 'octagon' },
    { name: 'Git', abbrev: 'Git', color: '#F05032', shape: 'square' },
    { name: 'Docker', abbrev: 'D', color: '#2496ED', shape: 'circle' },
    { name: 'AWS', abbrev: 'AWS', color: '#FF9900', shape: 'triangle' },
    { name: 'TypeScript', abbrev: 'TS', color: '#3178C6', shape: 'diamond' },
    { name: 'Vue.js', abbrev: 'V', color: '#4FC08D', shape: 'hexagon' },
    { name: 'Angular', abbrev: 'A', color: '#DD0031', shape: 'octagon' },
    { name: 'Sass', abbrev: 'S', color: '#CC6699', shape: 'square' },
    { name: 'Tailwind', abbrev: 'TW', color: '#06B6D4', shape: 'circle' },
    { name: 'Next.js', abbrev: 'NX', color: '#000000', shape: 'triangle' },
    { name: 'GraphQL', abbrev: 'GQ', color: '#E10098', shape: 'diamond' },
    { name: 'MongoDB', abbrev: 'M', color: '#47A248', shape: 'hexagon' },
    { name: 'PostgreSQL', abbrev: 'PG', color: '#336791', shape: 'octagon' },
    { name: 'Redis', abbrev: 'R', color: '#DC382D', shape: 'square' },
    { name: 'API', abbrev: 'API', color: '#FF6B6B', shape: 'circle' },
    { name: 'Mobile', abbrev: 'M', color: '#4ECDC4', shape: 'triangle' },
    { name: 'Cloud', abbrev: 'C', color: '#45B7D1', shape: 'diamond' },
    { name: 'AI/ML', abbrev: 'AI', color: '#9B59B6', shape: 'hexagon' },
    { name: 'Analytics', abbrev: 'A', color: '#E67E22', shape: 'octagon' }
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

  // Render geometric shapes for skills
  const renderSkillShape = (skill: any, size: number = 20) => {
    const shapeProps = {
      fill: skill.color,
      strokeWidth: 1,
      stroke: 'rgba(255, 255, 255, 0.3)'
    };

    switch (skill.shape) {
      case 'circle':
        return <circle cx={size/2} cy={size/2} r={size/3} {...shapeProps} />;
      case 'square':
        return <rect x={size/6} y={size/6} width={size*2/3} height={size*2/3} {...shapeProps} />;
      case 'triangle':
        return <polygon points={`${size/2},${size/6} ${size*5/6},${size*5/6} ${size/6},${size*5/6}`} {...shapeProps} />;
      case 'diamond':
        return <polygon points={`${size/2},${size/6} ${size*5/6},${size/2} ${size/2},${size*5/6} ${size/6},${size/2}`} {...shapeProps} />;
      case 'hexagon':
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = size/2 + (size/3) * Math.cos(angle);
          const y = size/2 + (size/3) * Math.sin(angle);
          hexPoints.push(`${x},${y}`);
        }
        return <polygon points={hexPoints.join(' ')} {...shapeProps} />;
      case 'octagon':
        const octPoints = [];
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const x = size/2 + (size/3) * Math.cos(angle);
          const y = size/2 + (size/3) * Math.sin(angle);
          octPoints.push(`${x},${y}`);
        }
        return <polygon points={octPoints.join(' ')} {...shapeProps} />;
      default:
        return <circle cx={size/2} cy={size/2} r={size/3} {...shapeProps} />;
    }
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
              
              {/* Skill shape and text using SVG */}
              <g 
                className="pointer-events-none transition-all duration-300"
                style={{
                  transform: isActive ? `scale(${1 + intensity * 0.2})` : 'scale(1)',
                  transformOrigin: `${hex.x}px ${hex.y}px`,
                }}
              >
                {/* Background shape */}
                <g 
                  transform={`translate(${hex.x - 12}, ${hex.y - 12})`}
                  opacity={isActive ? 0.7 + intensity * 0.3 : 0.4}
                  filter={isActive ? "url(#hexGlow)" : "none"}
                >
                  {renderSkillShape(hex.skill, 24)}
                </g>
                
                {/* Text abbreviation */}
                <text
                  x={hex.x}
                  y={hex.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-bold transition-all duration-300"
                  style={{
                    fontSize: hex.skill.abbrev.length > 2 ? '8px' : '10px',
                    fill: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                    filter: isActive ? `drop-shadow(0 0 ${intensity * 4}px ${hex.skill.color})` : 'none',
                    opacity: isActive ? 0.9 + intensity * 0.1 : 0.6
                  }}
                >
                  {hex.skill.abbrev}
                </text>
              </g>
              
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