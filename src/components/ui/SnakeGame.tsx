"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMiniApp } from "@neynar/react";
import { useNeynarUser } from "../../hooks/useNeynarUser";

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  gameOver: boolean;
  score: number;
  highScore: number;
  isPaused: boolean;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_SPEED = 150;

export default function SnakeGame() {
  const { context } = useMiniApp();
  const { user: neynarUser } = useNeynarUser(context || undefined);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'RIGHT',
    gameOver: false,
    score: 0,
    highScore: 0,
    isPaused: false,
  });
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Array<{username: string, score: number, fid: number}>>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize game
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem('snake-high-score');
      if (savedHighScore) {
        setGameState(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
      }
    } catch (err) {
      console.error('Error loading high score:', err);
      setError('Failed to load high score');
    }
  }, []);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }, []);

  // Check collision
  const checkCollision = useCallback((head: Position, snake: Position[]): boolean => {
    // Wall collision - check if head is outside boundaries
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    
    // Self collision - check if head hits any part of the snake body
    return snake.some((segment, index) => {
      // Skip the head itself (index 0)
      if (index === 0) return false;
      return segment.x === head.x && segment.y === head.y;
    });
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    try {
      if (gameState.gameOver || gameState.isPaused) return;

      setGameState(prev => {
        try {
          const newSnake = [...prev.snake];
          const head = { ...newSnake[0] };

          // Move head based on direction
          switch (prev.direction) {
            case 'UP':
              head.y = head.y - 1;
              break;
            case 'DOWN':
              head.y = head.y + 1;
              break;
            case 'LEFT':
              head.x = head.x - 1;
              break;
            case 'RIGHT':
              head.x = head.x + 1;
              break;
          }

          // Check collision
          if (checkCollision(head, newSnake)) {
            return { ...prev, gameOver: true };
          }

          // Check if food is eaten
          const ateFood = head.x === prev.food.x && head.y === prev.food.y;
          
          if (ateFood) {
            // Generate new food
            let newFood: Position;
            do {
              newFood = generateFood();
            } while (newSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
            
            // Increase score
            const newScore = prev.score + 10;
            const newHighScore = Math.max(newScore, prev.highScore);
            
            // Save high score
            if (newHighScore > prev.highScore) {
              try {
                localStorage.setItem('snake-high-score', newHighScore.toString());
              } catch (err) {
                console.error('Error saving high score:', err);
              }
            }
            
            return {
              ...prev,
              snake: [head, ...newSnake],
              food: newFood,
              score: newScore,
              highScore: newHighScore,
            };
          } else {
            // Move snake without growing
            newSnake.unshift(head);
            newSnake.pop();
            return { ...prev, snake: newSnake };
          }
        } catch (err) {
          console.error('Error updating game state:', err);
          setError('Game state error. Please refresh the page.');
          return prev;
        }
      });
    } catch (err) {
      console.error('Error in moveSnake:', err);
      setError('Game movement error. Please refresh the page.');
    }
  }, [gameState.gameOver, gameState.isPaused, checkCollision, generateFood]);

  // Game loop
  useEffect(() => {
    try {
      if (!gameState.gameOver && !gameState.isPaused) {
        gameLoopRef.current = setInterval(() => {
          try {
            moveSnake();
          } catch (err) {
            console.error('Error in game loop:', err);
            setError('Game error. Please refresh the page.');
            if (gameLoopRef.current) {
              clearInterval(gameLoopRef.current);
            }
          }
        }, GAME_SPEED);
      }
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    } catch (err) {
      console.error('Error setting up game loop:', err);
      setError('Failed to start game. Please refresh the page.');
    }
  }, [gameState.gameOver, gameState.isPaused, moveSnake]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      try {
        // Prevent default behavior for arrow keys to stop page scrolling
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) {
          e.preventDefault();
        }
        
        if (gameState.gameOver) return;
        
        setGameState(prev => {
          let newDirection = prev.direction;
          
          switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
              if (prev.direction !== 'DOWN') newDirection = 'UP';
              break;
            case 'ArrowDown':
            case 's':
            case 'S':
              if (prev.direction !== 'UP') newDirection = 'DOWN';
              break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
              if (prev.direction !== 'RIGHT') newDirection = 'LEFT';
              break;
            case 'ArrowRight':
            case 'd':
            case 'D':
              if (prev.direction !== 'LEFT') newDirection = 'RIGHT';
              break;
            case ' ':
              return { ...prev, isPaused: !prev.isPaused };
          }
          
          return { ...prev, direction: newDirection };
        });
      } catch (err) {
        console.error('Error handling keyboard input:', err);
        setError('Game control error. Please refresh the page.');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, gameState.direction]);

  // Reset game
  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: generateFood(),
      direction: 'RIGHT',
      gameOver: false,
      score: 0,
      highScore: gameState.highScore,
      isPaused: false,
    });
  };

  // Submit score to Farcaster
  const submitScore = async () => {
    if (!neynarUser || !context) return;
    
    try {
      const response = await fetch('/api/game-scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fid: neynarUser.fid,
          username: neynarUser.username,
          score: gameState.score,
          gameMode: 'classic',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('Score submitted successfully:', data.message);
          // Refresh leaderboard
          fetchLeaderboard();
          // Show success message
          alert(`Score submitted successfully! Your score: ${gameState.score}`);
        }
      } else {
        console.error('Failed to submit score');
        alert('Failed to submit score. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Error submitting score. Please try again.');
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/game-scores');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLeaderboard(data.data.map((score: any) => ({
            username: score.username,
            score: score.score,
            fid: score.fid,
          })));
        }
      } else {
        // Fallback to mock data if API fails
        const mockLeaderboard = [
          { username: "vitalik.eth", score: 150, fid: 5650 },
          { username: "dwr.eth", score: 120, fid: 3 },
          { username: "alice.eth", score: 100, fid: 1234 },
          { username: "bob.eth", score: 80, fid: 5678 },
          { username: "charlie.eth", score: 60, fid: 9012 },
        ];
        setLeaderboard(mockLeaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to mock data
      const mockLeaderboard = [
        { username: "vitalik.eth", score: 150, fid: 5650 },
        { username: "dwr.eth", score: 120, fid: 3 },
        { username: "alice.eth", score: 100, fid: 1234 },
        { username: "bob.eth", score: 80, fid: 5678 },
        { username: "charlie.eth", score: 60, fid: 9012 },
      ];
      setLeaderboard(mockLeaderboard);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-md mx-auto">
      {/* Game Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-green-600 mb-2">🐍 Classic Snake</h2>
        <div className="flex justify-between items-center bg-gray-800 text-white p-3 rounded-lg">
          <div>
            <div className="text-sm text-gray-300">Score</div>
            <div className="text-xl font-bold text-green-400">{gameState.score}</div>
          </div>
          <div>
            <div className="text-sm text-gray-300">High Score</div>
            <div className="text-xl font-bold text-yellow-400">{gameState.highScore}</div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Game Board */}
      <div className="relative bg-gray-900 border-2 border-green-500 rounded-lg overflow-hidden">
        <div 
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          }}
        >
          {/* Snake */}
          {gameState.snake.map((segment, index) => (
            <div
              key={index}
              className={`${
                index === 0 ? 'bg-green-400' : 'bg-green-600'
              } rounded-sm`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                gridColumn: segment.x + 1,
                gridRow: segment.y + 1,
              }}
            />
          ))}
          
          {/* Food */}
          <div
            className="bg-red-500 rounded-full"
            style={{
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
              gridColumn: gameState.food.x + 1,
              gridRow: gameState.food.y + 1,
              margin: 2,
            }}
          />
        </div>

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
              <p className="text-lg mb-4">Final Score: {gameState.score}</p>
              <div className="space-x-4">
                <button
                  onClick={resetGame}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold"
                >
                  Play Again
                </button>
                {neynarUser && (
                  <button
                    onClick={submitScore}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold"
                  >
                    Submit Score
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {gameState.isPaused && !gameState.gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold">Paused</h3>
              <p className="text-sm text-gray-300">Press SPACE to resume</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Use arrow keys or WASD to move • SPACE to pause
        </p>
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            {gameState.isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mt-6">
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold"
        >
          {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
        </button>
        
        {showLeaderboard && (
          <div className="mt-4 bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-3 text-center">🏆 Top Players</h3>
            <div className="space-y-2">
              {leaderboard.map((player, index) => (
                <div key={player.fid} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 font-bold">#{index + 1}</span>
                    <span className="text-white">{player.username}</span>
                  </div>
                  <span className="text-green-400 font-bold">{player.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Farcaster Integration */}
      {neynarUser && (
        <div className="mt-4 p-4 bg-blue-900 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <span className="text-white font-bold">Connected as {neynarUser.username}</span>
          </div>
          <p className="text-blue-200 text-sm">
            Your scores will be saved and shared on Farcaster!
          </p>
        </div>
      )}
    </div>
  );
}
