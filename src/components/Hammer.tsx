
import React from 'react';

interface HammerProps {
  position: { x: number; y: number };
  isActive: boolean;
}

const Hammer: React.FC<HammerProps> = ({ position, isActive }) => {
  return (
    <div
      className="fixed pointer-events-none z-50 will-change-transform"
      style={{
        left: position.x - 24, // Centré sur le pointeur (largeur 48 / 2)
        top: position.y - 24, // Le haut du marteau correspond au pointeur
        transform: `rotate(${isActive ? -80 : 0}deg)`,
        transformOrigin: '24px 180px', // Point de rotation au bas du manche
        transition: isActive ? 'transform 0.1s ease-out' : 'none',
      }}
    >
      <img
        src="https://i.ibb.co/hx9JVjr8/4-C2-A5681-D8-F5-464-A-96-AE-927-A66-D7-F9-F8.png"
        alt="Hammer"
        className={`w-48 h-48 object-contain ${
          isActive ? 'scale-110' : 'scale-100'
        }`}
        style={{
          transition: isActive ? 'transform 0.1s ease-out' : 'none'
        }}
        draggable={false}
      />
    </div>
  );
};

export default Hammer;
