
import React from 'react';
import { GameState } from './WhackABoberGame';

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onBackToMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameState,
  onRestart,
  onBackToMenu,
}) => {
  const getScoreRating = (score: number) => {
    if (score >= 50) return { emoji: '🏆', text: 'Legendary Bober Hunter!' };
    if (score >= 40) return { emoji: '🥇', text: 'Master Hunter!' };
    if (score >= 30) return { emoji: '🥈', text: 'Expert Hunter!' };
    if (score >= 20) return { emoji: '🥉', text: 'Good Hunter!' };
    if (score >= 10) return { emoji: '👍', text: 'Nice Try!' };
    return { emoji: '🦫', text: 'Keep Practicing!' };
  };

  const rating = getScoreRating(gameState.score);

  return (
    <div className="text-center animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-md mx-auto">
        <div className="text-6xl mb-4">{rating.emoji}</div>
        <h2 className="text-3xl font-bold text-green-800 mb-2">Game Over!</h2>
        <p className="text-xl text-green-700 mb-6">{rating.text}</p>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-green-600">Final Score:</span>
            <span className="text-2xl font-bold text-green-800">{gameState.score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-600">Best Combo:</span>
            <span className="text-xl font-bold text-orange-600">{gameState.bestCombo}</span>
          </div>
          {gameState.score === 42 && (
            <div className="text-center p-4 bg-yellow-100 rounded-lg border-2 border-yellow-300">
              <div className="text-2xl">🎉</div>
              <div className="text-sm font-medium text-yellow-800">
                The Answer to Everything!
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          >
            🔄 Play Again
          </button>
          <button
            onClick={onBackToMenu}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
