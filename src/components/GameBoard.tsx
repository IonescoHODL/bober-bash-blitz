import React, { useState, useEffect, useCallback } from 'react';
import Hole from './Hole';
import Hammer from './Hammer';

interface GameBoardProps {
  isPlaying: boolean;
  boberDuration: number;
  onBoberHit: () => void;
  onBoberMiss: () => void;
}

interface BoberState {
  id: number;
  visible: boolean;
  hit: boolean;
}

const HOLE_COUNT = 6;
const BOBER_SPAWN_INTERVAL = 800;

const GameBoard: React.FC<GameBoardProps> = ({
  isPlaying,
  boberDuration,
  onBoberHit,
  onBoberMiss,
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

  // Suivre la souris en permanence
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setHammerPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Spawn bobers randomly
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

      // Hide bober after duration
      setTimeout(() => {
        setBobers(prev => prev.map((bober, index) => 
          index === randomHole.index && !bober.hit
            ? { ...bober, visible: false }
            : bober
        ));
      }, boberDuration);
    };

    const interval = setInterval(spawnBober, BOBER_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [isPlaying, bobers, boberDuration]);

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

    setTimeout(() => setHammerActive(false), 200);
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
