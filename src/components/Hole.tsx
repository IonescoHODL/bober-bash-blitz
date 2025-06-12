
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
      className="relative w-24 h-24 md:w-32 md:h-32 mx-auto cursor-pointer"
      onClick={handleClick}
    >
      {/* Hole */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900 to-amber-950 rounded-full shadow-inner border-4 border-amber-800">
        <div className="absolute inset-2 bg-black/30 rounded-full" />
      </div>

      {/* Bober */}
      {isVisible && (
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
          isHit ? 'animate-scale-out' : 'animate-scale-in'
        }`}>
          <img
            src="https://i.ibb.co/67QCFPS4/Bober-Taupe.png"
            alt="Bober"
            className="w-16 h-16 md:w-20 md:h-20 object-contain transform hover:scale-110 transition-transform duration-150"
            draggable={false}
          />
        </div>
      )}

      {/* Hit effect */}
      {isHit && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl animate-fade-out">💥</div>
        </div>
      )}
    </div>
  );
};

export default Hole;
