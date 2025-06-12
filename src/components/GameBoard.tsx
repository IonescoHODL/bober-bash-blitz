
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Hole from './Hole';
import Hammer from './Hammer';

interface GameBoardProps {
  isPlaying: boolean;
  boberDuration: number;
  spawnInterval: number;
  onBoberHit: () => void;
  onBoberMiss: () => void;
  onBoberExpired: () => void;
}

interface BoberState {
  id: number;
  visible: boolean;
  hit: boolean;
}

const HOLE_COUNT = 6;

const GameBoard: React.FC<GameBoardProps> = ({
  isPlaying,
  boberDuration,
  spawnInterval,
  onBoberHit,
  onBoberMiss,
  onBoberExpired,
}) => {
  const [bobers, setBobers] = useState<BoberState[]>(
    Array.from({ length: HOLE_COUNT }, (_, i) => ({
      id: i,
      visible: false,
      hit: false,
    }))
  );
  const [hammerPosition, setHammerPosition] = useState({ x: 0, y: 0 });
  const [hammerActive, setHammerActive] = useState(false);
  const rafRef = useRef<number>();

  // Optimized mouse tracking with requestAnimationFrame
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setHammerPosition({
          x: event.clientX,
          y: event.clientY,
        });
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Spawn bobers randomly with variable interval
  useEffect(() => {
    if (!isPlaying) return;

    const spawnBober = () => {
      setBobers(currentBobers => {
        const visibleBobers = currentBobers.filter(b => b.visible).length;
        if (visibleBobers >= 2) return currentBobers; // Max 2 bobers at once

        const availableHoles = currentBobers
          .map((bober, index) => ({ bober, index }))
          .filter(({ bober }) => !bober.visible);

        if (availableHoles.length === 0) return currentBobers;

        const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        
        const newBobers = currentBobers.map((bober, index) => 
          index === randomHole.index
            ? { ...bober, visible: true, hit: false }
            : bober
        );

        // Hide bober after duration and trigger onBoberExpired if not hit
        setTimeout(() => {
          setBobers(prevBobers => {
            const currentBober = prevBobers[randomHole.index];
            if (currentBober.visible && !currentBober.hit) {
              onBoberExpired();
              return prevBobers.map((bober, index) => 
                index === randomHole.index
                  ? { ...bober, visible: false }
                  : bober
              );
            }
            return prevBobers;
          });
        }, boberDuration);

        return newBobers;
      });
    };

    const interval = setInterval(spawnBober, spawnInterval);
    return () => clearInterval(interval);
  }, [isPlaying, boberDuration, spawnInterval, onBoberExpired]);

  const handleHoleClick = useCallback((holeId: number, event: React.MouseEvent) => {
    setHammerActive(true);

    setBobers(currentBobers => {
      const bober = currentBobers[holeId];
      if (bober.visible && !bober.hit) {
        onBoberHit();
        return currentBobers.map((b, index) => 
          index === holeId ? { ...b, hit: true, visible: false } : b
        );
      } else {
        onBoberMiss();
        return currentBobers;
      }
    });

    setTimeout(() => setHammerActive(false), 150);
  }, [onBoberHit, onBoberMiss]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-4 md:gap-8 p-4">
        {bobers.map((bober) => (
          <Hole
            key={bober.id}
            id={bober.id}
            isVisible={bober.visible}
            isHit={bober.hit}
            onClick={handleHoleClick}
          />
        ))}
      </div>
      
      <Hammer
        position={hammerPosition}
        isActive={hammerActive}
      />
    </div>
  );
};

export default GameBoard;
