import { useState } from "react";
import GameCanvas from "./components/GameCanvas"; // Import GameCanvas
import styled from "styled-components"; // Import styled-components

// Styled components for layout and UI elements
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; // Ensure it takes full viewport height
  padding: 1rem; // Add some padding
`;

const GameWrapper = styled.div`
  position: relative; // Needed for absolute positioning of score/messages
  width: 610px; // Match canvas width + border/padding if any
  height: 90vh; // Match canvas height
  font-family: "AnalogMorpich", sans-serif; // Example font, adjust as needed
  color: #ff00a5; // Example color
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.075);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 40px;
  border: 4px solid #ff00a5;
  display: flex; // Center canvas inside
  justify-content: center;
  align-items: center;
  margin-top: 1rem; // Space below title
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  z-index: 10; // Ensure score is above canvas
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); // Semi-transparent overlay
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 20; // Ensure overlay is above score and canvas
  border-radius: 36px; // Match wrapper's border-radius minus border width
`;

const StartButton = styled.button`
  margin-top: 1rem;
  padding: 0.8em 1.5em;
  font-size: 1.2em;
  // Add other button styles as needed
`;

function App() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(true); // Start in game over state (or start screen)
  const [gameStarted, setGameStarted] = useState(false); // Track if game has ever started

  const handleUpdateScore = (newScore: number) => {
    setScore(newScore);
  };

  const handleSetGameOver = (gameOverState: boolean) => {
    setIsGameOver(gameOverState);
  };

  const startGame = () => {
    setGameStarted(true);
    setIsGameOver(false); // This will trigger the game loop in GameCanvas via useEffect
    // Score is reset within initializeGame called by GameCanvas's useEffect
  };

  return (
    <AppContainer>
      <h1>lavva</h1>
      <GameWrapper>
        {/* Display Score always when game has started */}
        {gameStarted && !isGameOver && (
          <ScoreDisplay>Score: {score}</ScoreDisplay>
        )}

        {/* Conditional Rendering for Game State */}
        {isGameOver ? (
          <Overlay>
            {gameStarted ? (
              // Game Over Screen
              <>
                <h2>Game Over!</h2>
                <p>Final Score: {score}</p>
                <StartButton onClick={startGame}>Play Again</StartButton>
              </>
            ) : (
              // Initial Start Screen
              <>
                <h2>Welcome to Lavva!</h2>
                <p>Click Start to Play</p>
                <StartButton onClick={startGame}>Start Game</StartButton>
              </>
            )}
          </Overlay>
        ) : (
          // Render GameCanvas only when the game is active
          <GameCanvas
            updateScore={handleUpdateScore}
            setGameOver={handleSetGameOver}
            score={score}
            isGameOver={isGameOver} // Pass isGameOver state
          />
        )}
      </GameWrapper>
    </AppContainer>
  );
}

export default App;
