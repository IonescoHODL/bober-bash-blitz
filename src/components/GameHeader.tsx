
import React from 'react';
import { GameState } from './WhackABoberGame';

interface GameHeaderProps {
  gameState: GameState;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gameState }) => {
  const getComboMultiplier = () => Math.floor(gameState.combo / 3) + 1;

  if (!gameState.isPlaying) return null;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
      <div className="flex items-center space-x-6 mb-4 md:mb-0">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-green-800">
            {gameState.score}
          </div>
          <div className="text-sm text-green-600">Score</div>
        </div>
        
        {gameState.combo >= 3 && (
          <div className="text-center animate-pulse">
            <div className="text-xl md:text-2xl font-bold text-orange-600">
              x{getComboMultiplier()}
            </div>
            <div className="text-sm text-orange-500">Combo</div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="text-sm text-green-600">Combo</div>
          <div className="text-lg font-bold text-green-800">
            {gameState.combo}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-green-600">Best</div>
          <div className="text-lg font-bold text-green-800">
            {gameState.bestCombo}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-red-600">Misses</div>
          <div className={`text-lg font-bold ${
            gameState.missedInARow >= 2 ? 'text-red-600 animate-pulse' : 'text-red-500'
          }`}>
            {gameState.missedInARow}/3
          </div>
        </div>

        <div className="text-center">
          <div className={`text-3xl md:text-4xl font-bold ${
            gameState.timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'
          }`}>
            {gameState.timeLeft}
          </div>
          <div className="text-sm text-blue-500">Time</div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
