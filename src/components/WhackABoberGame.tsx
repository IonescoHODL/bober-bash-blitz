
import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import GameHeader from './GameHeader';
import GameOverScreen from './GameOverScreen';
import { useToast } from '@/hooks/use-toast';

export interface GameState {
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  gameOver: boolean;
  combo: number;
  bestCombo: number;
}

const GAME_DURATION = 60; // seconds
const INITIAL_BOBER_DURATION = 1200; // ms
const MIN_BOBER_DURATION = 600; // ms
const BOBER_SPAWN_INTERVAL = 800; // ms

const WhackABoberGame: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    timeLeft: GAME_DURATION,
    isPlaying: false,
    gameOver: false,
    combo: 0,
    bestCombo: 0,
  });

  const [boberDuration, setBoberDuration] = useState(INITIAL_BOBER_DURATION);

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            return { ...prev, timeLeft: 0, isPlaying: false, gameOver: true };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft]);

  // Progressive difficulty
  useEffect(() => {
    if (gameState.isPlaying) {
      const progress = 1 - (gameState.timeLeft / GAME_DURATION);
      const newDuration = INITIAL_BOBER_DURATION - (progress * (INITIAL_BOBER_DURATION - MIN_BOBER_DURATION));
      setBoberDuration(Math.max(MIN_BOBER_DURATION, newDuration));
    }
  }, [gameState.timeLeft, gameState.isPlaying]);

  const startGame = useCallback(() => {
    setGameState({
      score: 0,
      timeLeft: GAME_DURATION,
      isPlaying: true,
      gameOver: false,
      combo: 0,
      bestCombo: 0,
    });
    setBoberDuration(INITIAL_BOBER_DURATION);
  }, []);

  const onBoberHit = useCallback(() => {
    setGameState(prev => {
      const newCombo = prev.combo + 1;
      const multiplier = Math.floor(newCombo / 3) + 1; // x2 for 3+ combo, x3 for 6+ combo, etc.
      const points = multiplier;
      const newScore = prev.score + points;
      const newBestCombo = Math.max(prev.bestCombo, newCombo);

      // Easter egg for score 42
      if (newScore === 42) {
        toast({
          title: "🎉 The Answer to Everything!",
          description: "You've reached the ultimate score of 42!",
          duration: 3000,
        });
      }

      // Combo notifications
      if (newCombo === 3) {
        toast({
          title: "🔥 Combo x2!",
          description: "You're on fire!",
          duration: 2000,
        });
      } else if (newCombo === 6) {
        toast({
          title: "⚡ Combo x3!",
          description: "Incredible streak!",
          duration: 2000,
        });
      }

      return {
        ...prev,
        score: newScore,
        combo: newCombo,
        bestCombo: newBestCombo,
      };
    });
  }, [toast]);

  const onBoberMiss = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      combo: 0,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameOver: false,
      isPlaying: false,
    }));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-100 to-emerald-200 game-area">
      <div className="w-full max-w-4xl mx-auto">
        <GameHeader gameState={gameState} />
        
        {!gameState.isPlaying && !gameState.gameOver && (
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-4 animate-fade-in">
              🦫 Whack-a-Bober
            </h1>
            <p className="text-lg text-green-700 mb-6">
              Hit the Bobers as they pop up! Get combos for bonus points!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              🎮 Start Game
            </button>
          </div>
        )}

        {gameState.isPlaying && (
          <GameBoard
            isPlaying={gameState.isPlaying}
            boberDuration={boberDuration}
            onBoberHit={onBoberHit}
            onBoberMiss={onBoberMiss}
          />
        )}

        {gameState.gameOver && (
          <GameOverScreen
            gameState={gameState}
            onRestart={startGame}
            onBackToMenu={resetGame}
          />
        )}
      </div>
    </div>
  );
};

export default WhackABoberGame;
