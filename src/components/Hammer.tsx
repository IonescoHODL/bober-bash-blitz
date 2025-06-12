
import React from 'react';

interface HammerProps {
  position: { x: number; y: number };
  isActive: boolean;
}

const Hammer: React.FC<HammerProps> = ({ position, isActive }) => {
  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-100"
      style={{
        left: position.x - 96, // Ajusté pour le marteau 4x plus grand
        top: position.y - 192, // Ajusté pour le marteau 4x plus grand
        transform: `rotate(${isActive ? -80 : 0}deg)`,
      }}
    >
      <img
        src="https://i.ibb.co/hx9JVjr8/4-C2-A5681-D8-F5-464-A-96-AE-927-A66-D7-F9-F8.png"
        alt="Hammer"
        className={`w-48 h-48 object-contain transition-transform duration-200 ${
          isActive ? 'scale-110' : 'scale-100'
        }`}
        draggable={false}
      />
    </div>
  );
};

export default Hammer;
