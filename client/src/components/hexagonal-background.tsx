import { useEffect, useRef, useState, useMemo } from "react";

export default function HexagonalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [waveCenter, setWaveCenter] = useState({ x: 0, y: 0 });
  const [waveTime, setWaveTime] = useState(0);
  const [isMouseActive, setIsMouseActive] = useState(false);

  useEffect(() => {
    // Better mobile detection - only consider it mobile if there's NO mouse events
    const checkMobile = () => {
      // Only check screen size, not touch capability (many laptops have touch screens)
      const smallScreen = window.innerWidth <= 640; // Reduced threshold to 640px
      setIsMobile(smallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      // Mouse movement detected - definitely not mobile-only device
      setIsMobile(false);
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
      setIsMouseActive(true);
    };
    
    const handleTouchStart = () => {
      // Touch event detected - likely mobile
      setIsMobile(true);
      setIsMouseActive(false);
    };

    // Listen to window mouse events instead of container
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle mouse idle timeout for desktop
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!isMobile && isMouseActive) {
      timeout = setTimeout(() => {
        setIsMouseActive(false);
      }, 3000); // Switch to wave after 3 seconds of no mouse movement
    }
    
    return () => clearTimeout(timeout);
  }, [isMouseActive, isMobile]);

  // Wave animation - only runs on mobile OR when mouse is idle on desktop
  useEffect(() => {
    let animationFrame: number;
    
    const shouldAnimate = isMobile || !isMouseActive;
    
    const animate = () => {
      if (shouldAnimate) {
        setWaveTime(prev => prev + 0.015);
        
        // Change wave direction every 5 seconds
        const cycle = Math.floor(waveTime / 5);
        const directions = [
          { x: 0, y: 0 }, // top-left
          { x: window.innerWidth, y: 0 }, // top-right
          { x: window.innerWidth, y: window.innerHeight }, // bottom-right
          { x: 0, y: window.innerHeight }, // bottom-left
          { x: window.innerWidth / 2, y: 0 }, // top-center
          { x: window.innerWidth / 2, y: window.innerHeight }, // bottom-center
        ];
        
        const currentDirection = directions[cycle % directions.length];
        const progress = (waveTime % 5) / 5;
        
        // Create wave effect moving across screen
        setWaveCenter({
          x: currentDirection.x + (window.innerWidth / 2 - currentDirection.x) * Math.sin(progress * Math.PI),
          y: currentDirection.y + (window.innerHeight / 2 - currentDirection.y) * Math.sin(progress * Math.PI)
        });
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isMobile, isMouseActive, waveTime]);

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

  const getDistanceFromInteractionPoint = (hexX: number, hexY: number) => {
    // Use wave animation on mobile or when mouse is idle on desktop
    const useWave = isMobile || !isMouseActive;
    
    if (useWave) {
      // Use wave center for auto-animation
      const dx = waveCenter.x - hexX;
      const dy = waveCenter.y - hexY;
      return Math.sqrt(dx * dx + dy * dy);
    } else {
      // Use mouse position for cursor interaction
      const dx = mousePosition.x - hexX;
      const dy = mousePosition.y - hexY;
      return Math.sqrt(dx * dx + dy * dy);
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
          const distance = getDistanceFromInteractionPoint(hex.x, hex.y);
          const useWave = isMobile || !isMouseActive;
          const maxDistance = useWave ? 200 : 120; // Larger radius for wave effect
          const isActive = distance < maxDistance;
          const intensity = isActive ? Math.max(0, 1 - distance / maxDistance) : 0;
          
          return (
            <g key={hex.id}>
              {/* Base hexagon - subtle and professional */}
              <polygon
                points={hex.points}
                fill={isActive ? "rgba(0, 255, 150, 0.03)" : "rgba(255, 255, 255, 0.008)"}
                stroke={isActive ? "rgba(0, 255, 150, 0.4)" : "rgba(255, 255, 255, 0.06)"}
                strokeWidth={isActive ? 1 : 0.3}
                opacity={isActive ? 0.8 : 0.3}
                filter={isActive ? "url(#hexGlowActive)" : "none"}
                className="transition-all duration-500 ease-out"
                style={{
                  transform: isActive ? `scale(${1 + intensity * 0.05})` : 'scale(1)',
                  transformOrigin: `${hex.x}px ${hex.y}px`
                }}
              />
              
              {/* Skill icon - monochromatic, only visible on hover */}
              <foreignObject
                x={hex.x - 10}
                y={hex.y - 10}
                width="20"
                height="20"
                className="pointer-events-none"
                style={{
                  transform: isActive ? `scale(${1 + intensity * 0.15})` : 'scale(0.8)',
                  transformOrigin: 'center',
                  opacity: isActive ? intensity : 0
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <i 
                    className={`${hex.skill.icon} text-sm transition-all duration-500`}
                    style={{
                      color: '#ffffff',
                      filter: isActive ? `drop-shadow(0 0 ${intensity * 12}px rgba(0, 255, 150, 0.8)) drop-shadow(0 0 ${intensity * 6}px rgba(0, 255, 150, 0.6))` : 'none',
                      textShadow: isActive ? `0 0 ${intensity * 8}px rgba(0, 255, 150, 0.7)` : 'none'
                    }}
                  />
                </div>
              </foreignObject>
              
              {/* Subtle skill name tooltip on high intensity hover */}
              {isActive && intensity > 0.7 && (
                <foreignObject
                  x={hex.x - 25}
                  y={hex.y + 20}
                  width="50"
                  height="16"
                  className="pointer-events-none"
                  style={{ opacity: (intensity - 0.7) * 3 }}
                >
                  <div className="w-full flex justify-center">
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm"
                      style={{
                        color: 'rgba(0, 255, 150, 0.9)',
                        textShadow: '0 0 4px rgba(0, 255, 150, 0.5)',
                        border: '1px solid rgba(0, 255, 150, 0.2)'
                      }}
                    >
                      {hex.skill.name}
                    </span>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      {/* Subtle professional overlay */}
      <div 
        className="absolute inset-0 bg-black/2 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${
            (isMobile || !isMouseActive) ? waveCenter.x : mousePosition.x
          }px ${
            (isMobile || !isMouseActive) ? waveCenter.y : mousePosition.y
          }px, 
            rgba(0, 255, 150, 0.008) 0%, 
            rgba(0, 0, 0, 0.02) 40%, 
            rgba(0, 0, 0, 0.05) 100%)`
        }}
      />

    </div>
  );
}