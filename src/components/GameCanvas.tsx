import React, { useCallback, useEffect, useRef } from 'react';
import { Blob } from '../game/Blob';
import { Gem } from '../game/Gem';
import { Player } from '../game/Player';

interface GameCanvasProps {
  updateScore: (newScore: number) => void;
  setGameOver: (isGameOver: boolean) => void;
  score: number;
  isGameOver: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ updateScore, setGameOver, score, isGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Player | null>(null);
  const blobsRef = useRef<Blob[]>([]);
  const gemsRef = useRef<Gem[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const gameFrameRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Initialize game elements - Called on mount/remount
  const initializeGame = useCallback((canvas: HTMLCanvasElement) => {
    playerRef.current = new Player(canvas.width / 2, canvas.height); // Position player at bottom center
    blobsRef.current = [];
    gemsRef.current = [];
    gameFrameRef.current = 0;
    updateScore(0); // Reset score via prop function in App
    // No need to setGameOver(false) here, App controls that state transition
  }, [updateScore]); // Dependency is stable

  // Effect for canvas setup, resize handling, and initial game setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasDimensions = () => {
      canvas.width = 600; // Fixed width
      canvas.height = window.innerHeight * 0.9; // Dynamic height based on viewport
    };

    updateCanvasDimensions();
    initializeGame(canvas); // Setup game state on mount

    const handleResize = () => {
      updateCanvasDimensions();
      // Adjust player position on resize to stay bottom center
      if (playerRef.current) {
         playerRef.current.x = canvas.width / 2;
         playerRef.current.y = canvas.height;
      }
      // Note: Resizing doesn't restart the game here, just adjusts dimensions/player pos.
    };

    window.addEventListener('resize', handleResize);

    // Cleanup resize listener and any active animation frame if component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [initializeGame]); // Runs once on mount because initializeGame is stable

  // Main Game Loop Effect - Runs when isGameOver or score changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const currentLocalScore = score;

    // If game is over, or canvas/player isn't ready, ensure loop is stopped and exit effect
    if (isGameOver || !canvas || !ctx || !playerRef.current) {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null; // Clear ref ID
      }
      return; // Exit effect
    }

    // --- Game is active, start the animation loop ---
    const gameLoop = () => {
      // Check game over status *inside* the loop as well, as setGameOver can be called async
      if (isGameOver || !playerRef.current || !canvas || !ctx) {
        if (animationFrameIdRef.current !== null) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        return; // Stop loop execution
      }

      gameFrameRef.current += 1;
      const frame = gameFrameRef.current;
      const currentPlayer = playerRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & Draw Player
      currentPlayer.update(mousePosition.current);
      currentPlayer.draw(ctx);

      // Handle Blobs (Spawn, Update, Draw, Collide, Filter)
      if (frame % 100 === 0) { // Spawn rate
        blobsRef.current.push(new Blob(canvas.width));
      }
      blobsRef.current = blobsRef.current.filter(blob => {
        blob.update(currentPlayer);
        blob.draw(ctx);

        // Corrected collision condition using full radii sum
        if (blob.distance! <= currentPlayer.radius + blob.radius / 2 && !blob.counted) {
          updateScore(score + 1);
          blob.counted = true;
          currentPlayer.radius += blob.radius;
          // TODO: Play sound effect here if implemented
          return false; // Remove blob on collision
        }
        // Keep blob if it's still potentially visible (above bottom edge)
        return blob.y < canvas.height + blob.radius;
      });

      // Handle Gems (Spawn, Update, Draw, Collide, Filter)
      if (frame % 400 === 0) { // Spawn rate
        gemsRef.current.push(new Gem(canvas.width));
      }
      gemsRef.current = gemsRef.current.filter(gem => {
        gem.update(currentPlayer);
        gem.draw(ctx);

        // Check for collision with gem - triggers game over
        if (gem.distance! <= currentPlayer.radius + gem.radius && !gem.counted) {
          gem.counted = true;
          setGameOver(true); // End the game when player hits a gem
          return false;
        }
        // Keep gem if still on screen
        return gem.y < canvas.height + gem.radius * 2;
      });

      // Update score state if changed
      if (currentLocalScore !== score) {
        updateScore(currentLocalScore);
      }

      // Continue loop
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the loop
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [isGameOver, score, updateScore, setGameOver]);

  // Effect for mouse movement
  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();

    const handleMouseMove = (event: MouseEvent) => {
      if (rect) {
        mousePosition.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      }
    };

    canvas?.addEventListener('mousemove', handleMouseMove);
    return () => canvas?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <canvas ref={canvasRef} id="canvas" width={600} height={window.innerHeight * 0.9} />;
};

export default GameCanvas;
