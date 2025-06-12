
import React from 'react';

interface HoleProps {
  id: number;
  isVisible: boolean;
  isHit: boolean;
  onClick: (id: number, event: React.MouseEvent) => void;
}

const Hole: React.FC<HoleProps> = ({ id, isVisible, isHit, onClick }) => {
  const handleClick = (event: React.MouseEvent) => {
    onClick(id, event);
  };

  return (
    <div
      className="relative w-32 h-20 md:w-40 md:h-24 mx-auto cursor-pointer"
      onClick={handleClick}
    >
      {/* Trou ovale en perspective */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900 to-black rounded-full shadow-inner border-4 border-amber-800 transform perspective-75">
        <div className="absolute inset-2 bg-black/60 rounded-full" />
        <div className="absolute inset-4 bg-black/80 rounded-full" />
      </div>

      {/* Bober qui sort du trou */}
      {isVisible && (
        <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
          isHit ? 'animate-scale-out' : 'animate-scale-in'
        }`}>
          <img
            src="https://i.ibb.co/67QCFPS4/Bober-Taupe.png"
            alt="Bober"
            className="w-20 h-20 md:w-24 md:h-24 object-contain transform hover:scale-110 transition-transform duration-150"
            draggable={false}
            style={{
              filter: isHit ? 'brightness(1.5)' : 'none'
            }}
          />
        </div>
      )}

      {/* Effet de frappe - 4x plus grand et disparition rapide */}
      {isHit && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="text-8xl animate-explosion">💥</div>
        </div>
      )}
    </div>
  );
};

export default Hole;
