"use client";

import SnakeGame from "../SnakeGame";

/**
 * HomeTab component displays the main landing content for the mini app.
 * 
 * This is the default tab that users see when they first open the mini app.
 * It provides the Snake game for the gaming experience.
 * 
 * @example
 * ```tsx
 * <HomeTab />
 * ```
 */
export function HomeTab() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center bg-gradient-to-r from-green-900 to-blue-900 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🐍 Snake Game</h1>
        <p className="text-lg text-green-200 mb-4">
          Classic retro snake game on Farcaster
        </p>
      </div>

      {/* Snake Game */}
      <SnakeGame />

      {/* Game Instructions */}
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4 text-center">🎮 How to Play</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold text-green-400 mb-2">Controls:</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• Arrow keys or WASD to move</li>
              <li>• SPACE to pause/resume</li>
              <li>• Eat red food to grow and score</li>
              <li>• Avoid hitting walls or yourself</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-400 mb-2">Features:</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• Classic retro snake gameplay</li>
              <li>• High score tracking</li>
              <li>• Farcaster integration</li>
              <li>• Leaderboard competition</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 