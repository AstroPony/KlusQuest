"use client";
import { useState, useEffect } from "react";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  choreTitle: string;
  xpGained: number;
  coinsGained: number;
  levelUp?: boolean;
  newLevel?: number;
};

export default function Celebration({ 
  isVisible, 
  onClose, 
  choreTitle, 
  xpGained, 
  coinsGained,
  levelUp = false,
  newLevel
}: Props) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setTimeout(onClose, 1000);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl p-8 text-center text-white shadow-2xl animate-bounce">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Main celebration content */}
        <div className="relative z-10">
          <div className="text-6xl mb-4 animate-pulse">
            {levelUp ? "🎉🎊🎉" : "🎉"}
          </div>
          
          <h2 className="text-2xl font-bold mb-4">
            {levelUp ? "Level Up!" : "Gefeliciteerd!"}
          </h2>
          
          <p className="text-lg mb-6">
            Je hebt "{choreTitle}" voltooid!
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center gap-2 text-lg">
              <span>⭐</span>
              <span className="font-semibold">+{xpGained} XP</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-lg">
              <span>💰</span>
              <span className="font-semibold">+{coinsGained} munten</span>
            </div>

            {levelUp && newLevel && (
              <div className="flex items-center justify-center gap-2 text-xl font-bold text-yellow-300">
                <span>🚀</span>
                <span>Level {newLevel} bereikt!</span>
                <span>🚀</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="btn-primary bg-white text-green-600 hover:bg-gray-100"
          >
            Geweldig!
          </button>
        </div>
      </div>
    </div>
  );
} 