
import React from 'react';

interface HammerProps {
  position: { x: number; y: number };
  isActive: boolean;
}

const Hammer: React.FC<HammerProps> = ({ position, isActive }) => {
  if (!isActive) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-200"
      style={{
        left: position.x - 24,
        top: position.y - 48,
        transform: `rotate(${isActive ? -80 : 0}deg)`,
      }}
    >
      <img
        src="https://i.ibb.co/hx9JVjr8/4-C2-A5681-D8-F5-464-A-96-AE-927-A66-D7-F9-F8.png"
        alt="Hammer"
        className={`w-12 h-12 object-contain transition-transform duration-200 ${
          isActive ? 'scale-110' : 'scale-100'
        }`}
        draggable={false}
      />
    </div>
  );
};

export default Hammer;
