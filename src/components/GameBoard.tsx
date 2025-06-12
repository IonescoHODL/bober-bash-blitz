
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

  // Suivi optimisé de la souris avec requestAnimationFrame
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

  // Spawn bobers randomly avec intervalle variable
  useEffect(() => {
    if (!isPlaying) return;

    const spawnBober = () => {
      const visibleBobers = bobers.filter(b => b.visible).length;
      if (visibleBobers >= 2) return; // Max 2 bobers at once

      const availableHoles = bobers
        .map((bober, index) => ({ bober, index }))
        .filter(({ bober }) => !bober.visible);

      if (availableHoles.length === 0) return;

      const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
      
      setBobers(prev => prev.map((bober, index) => 
        index === randomHole.index
          ? { ...bober, visible: true, hit: false }
          : bober
      ));

      // Hide bober after duration et déclencher onBoberExpired si pas touché
      setTimeout(() => {
        setBobers(prev => {
          const currentBober = prev[randomHole.index];
          if (currentBober.visible && !currentBober.hit) {
            onBoberExpired();
            return prev.map((bober, index) => 
              index === randomHole.index
                ? { ...bober, visible: false }
                : bober
            );
          }
          return prev;
        });
      }, boberDuration);
    };

    const interval = setInterval(spawnBober, spawnInterval);
    return () => clearInterval(interval);
  }, [isPlaying, bobers, boberDuration, spawnInterval, onBoberExpired]);

  const handleHoleClick = useCallback((holeId: number, event: React.MouseEvent) => {
    setHammerActive(true);

    const bober = bobers[holeId];
    if (bober.visible && !bober.hit) {
      setBobers(prev => prev.map((b, index) => 
        index === holeId ? { ...b, hit: true, visible: false } : b
      ));
      onBoberHit();
    } else {
      onBoberMiss();
    }

    setTimeout(() => setHammerActive(false), 150);
  }, [bobers, onBoberHit, onBoberMiss]);

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
