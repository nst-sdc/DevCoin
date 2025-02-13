import React, { useEffect, useState, useRef } from 'react';

interface BackgroundLayoutProps {
  children: React.ReactNode;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  symbol: string;
  size: number;
  opacity: number;
}

export default function BackgroundLayout({ children }: BackgroundLayoutProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const initialParticles = Array.from({ length: 30 }, (_, i) => {
      const gridSize = Math.sqrt(30);
      const gridX = (i % gridSize) / gridSize;
      const gridY = Math.floor(i / gridSize) / gridSize;
      const randomOffset = 20;
      const x = (gridX * 100) + (Math.random() * randomOffset - randomOffset/2);
      const y = (gridY * 100) + (Math.random() * randomOffset - randomOffset/2);

      return {
        id: i,
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        symbol: ['</>', '{...}', '( )', '[]'][Math.floor(Math.random() * 4)],
        size: Math.random() * 0.5 + 0.8,
        opacity: Math.random() * 0.5 + 0.3
      };
    });
    setParticles(initialParticles);

    function animate(currentTime: number) {
      const deltaTime = (currentTime - lastTimeRef.current) / 16; // normalize to ~60fps
      lastTimeRef.current = currentTime;

      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + particle.speedX * deltaTime;
          let newY = particle.y + particle.speedY * deltaTime;
          let newSpeedX = particle.speedX;
          let newSpeedY = particle.speedY;

          // Bounce handling with proper speed updates
          if (newX <= 0 || newX >= 100) {
            newSpeedX = -particle.speedX;
            newX = newX <= 0 ? 0 : 100;
          }
          if (newY <= 0 || newY >= 100) {
            newSpeedY = -particle.speedY;
            newY = newY <= 0 ? 0 : 100;
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Debounced mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    // Use a debounced version of the mouse move handler
    const debouncedHandleMouseMove = debounce(handleMouseMove, 16);
    window.addEventListener('mousemove', debouncedHandleMouseMove);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', debouncedHandleMouseMove);
    };
  }, []);

  // Debounce utility function
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(145deg, 
              #02191C 0%,
              #032329 25%,
              #02191C 50%,
              #032329 75%,
              #02191C 100%
            )
          `
        }}
      />

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 50% 0%, 
              rgba(99, 102, 241, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(circle at 80% 50%, 
              rgba(99, 102, 241, 0.1) 0%,
              transparent 50%
            )
          `
        }}
      />

      {/* Particles Container */}
      <div className="absolute inset-0">
        <div 
          className="relative h-full w-full"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                transform: `translateZ(${Math.abs(mousePosition.x + mousePosition.y) * 50}px) scale(${particle.size})`,
                color: `rgba(99, 102, 241, ${particle.opacity})`,
                textShadow: '0 0 15px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)',
                willChange: 'transform, left, top'
              }}
            >
              {particle.symbol}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
