import React, { useState, useEffect } from 'react';
import Pacman from './Pacman';
import Ghost from './Ghost';
import { initializeGame, movePacman, collectDot, checkGameOver, isInRestrictedArea } from '../utils/gameLogic';
import { BOARD_SIZE, MAZE } from '../utils/constants';
import { MdArrowBack } from "react-icons/md";
import { MdArrowDownward } from "react-icons/md";
import { MdArrowUpward } from "react-icons/md";
import { MdArrowForward } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";
import HeartIcon from './HeartIcon';
import { FaPlay } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import './game.css'
import GameFooter from './GameFooter';
import GameOver from './GameOver';
import GameWin from './GameWin';

const GameBoard = () => {
  const [gameState, setGameState] = useState(initializeGame());
  const [gameStarted, setGameStarted] = useState(false);
  const [direction, setDirection] = useState('RIGHT');
  const [gameWon, setGameWon] = useState(false);
  const [isInvincible, setIsInvincible] = useState(false);
  const [isDying, setIsDying] = useState(false);
  const [paused, setPaused] = useState(false);

  const [ghostsExitBox, setGhostsExitBox] = useState(false); 



  const [user, setUser] = useState(null);
  useEffect(() => {
      // Initialize the Telegram WebApp
      const tg = window.Telegram.WebApp;
      tg.ready();
  
      // Get user data from Telegram
      const userData = tg.initDataUnsafe?.user;
      if (userData) {
        setUser(userData);
      }
    }, []);

  const postUserData = async (id,username,score) => {
    

    try {
        const response = await fetch('https://pacman-backend.vercel.app/add_user/', {  // Replace with your API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id:id,
                username: username,
                score:score,
                
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('User data posted successfully:', data);
    } catch (error) {
        console.error('Error posting user data:', error);
    }
};



  const pauseGame = () => {
    setPaused(true);
  };

  const resumeGame = () => {
    setPaused(false);
  };

  const togglePause = () => {
    setPaused(prevPaused => !prevPaused);
  };

  const getValidMoves = (ghost) => {
    const moves = [];
    const potentialMoves = [
      { x: ghost.x, y: ghost.y - 1 }, 
      { x: ghost.x, y: ghost.y + 1 },
      { x: ghost.x - 1, y: ghost.y },
      { x: ghost.x + 1, y: ghost.y }, 
    ];

    for (const move of potentialMoves) {
      if (
        move.x >= 0 &&
        move.x < BOARD_SIZE &&
        move.y >= 0 &&
        move.y < BOARD_SIZE &&
        MAZE[move.y][move.x] !== 1 && 
        !isInRestrictedArea(move.x, move.y) 
      ) {
        moves.push(move);
      }
    }

    return moves;
  };

  const moveGhosts = (ghosts) => {
    return ghosts.map((ghost) => {
      const validMoves = getValidMoves(ghost);
      if (validMoves.length === 0) return ghost; 

      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      return { ...ghost, x: randomMove.x, y: randomMove.y };
    });
  };


useEffect(() => {
    let ghostInterval;

    if (gameStarted && !gameState.gameOver && !gameWon && !isDying && !paused) {
      if (!ghostsExitBox) {
        setGameState((prevState) => ({
          ...prevState,
          ghosts: prevState.ghosts.map((ghost) => {
            if (MAZE[ghost.y][ghost.x] === 2) {
              const validMoves = getValidMoves(ghost);
              const moveOut = validMoves.find(move => MAZE[move.y][move.x] === 0);
              return moveOut ? { ...ghost, x: moveOut.x, y: moveOut.y } : ghost;
            }
            return ghost;
          }),
        }));
        setGhostsExitBox(true);
      } else {
        ghostInterval = setInterval(() => {
          setGameState((prevState) => ({
            ...prevState,
            ghosts: moveGhosts(prevState.ghosts),
          }));
        }, 500);
      }
    }

    return () => clearInterval(ghostInterval);
  }, [gameStarted, gameState.gameOver, gameWon, isDying, paused, ghostsExitBox]);


  const moveGhostsAutomatically = () => {
    setGameState(prevState => ({
      ...prevState,
      ghosts: moveGhosts(prevState.ghosts)
    }));
  };




  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameState.gameOver || gameWon || isDying) return;

      switch (event.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
        case ' ':
          if (!gameStarted) {
            setGameStarted(true);
          }
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameState, gameWon, isDying]);


  useEffect(() => {
    let pacmanInterval;
    let ghostInterval;
    if (gameStarted && !gameState.gameOver && !gameWon && !isDying && !paused) {
      pacmanInterval = setInterval(() => {
        movePacmanAutomatically();
      }, 150);

      ghostInterval = setInterval(() => {
        moveGhostsAutomatically();
      }, 300);
    }
    return () => {
      clearInterval(pacmanInterval);
      clearInterval(ghostInterval);
    };
  }, [gameStarted, direction, gameState, gameWon, isDying, paused]);

  const movePacmanAutomatically = () => {
    if (gameState.gameOver || isInvincible || paused) return;

    let newPosition = { ...gameState.pacmanPosition };

    switch (direction) {
      case 'UP':
        newPosition.y = Math.max(0, newPosition.y - 1);
        break;
      case 'DOWN':
        newPosition.y = Math.min(BOARD_SIZE - 1, newPosition.y + 1); 
        break;
      case 'LEFT':
        newPosition.x = Math.max(0, newPosition.x - 1); 
        break;
      case 'RIGHT':
        newPosition.x = Math.min(BOARD_SIZE - 1, newPosition.x + 1);
        break;
      default:
        return;
    }

    if (MAZE[newPosition.y][newPosition.x] === 1 || MAZE[newPosition.y][newPosition.x] === 2) {
      return;
    }

    const ghostCollision = gameState.ghosts.some(ghost => ghost.x === newPosition.x && ghost.y === newPosition.y);
    if (ghostCollision) {
      setIsDying(true);
      setIsInvincible(true);
      setDirection('RIGHT');

      const newLives = gameState.lives - 1;

      setGameState(prevState => ({
        ...prevState,
        lives: newLives,
      }));

      if (newLives === 0) {
        setGameState(prevState => ({
            ...prevState,
            gameOver: true,
        }));
        const user_id =user?.id; // Get the user ID from the Telegram user object
        const score = gameState.score; // Get the current score
        const randomUsername =user?.username; // Generate a random username
        postUserData(user_id,randomUsername,score); // Call your function here
    }
     else {
        setTimeout(() => {
          setGameState(prevState => ({
            ...prevState,
            pacmanPosition: prevState.initialPacmanPosition,
          }));
          setIsInvincible(false);
          setIsDying(false);
        }, 3000);
      }

      return; 
    }

    const newDots = collectDot(newPosition, gameState.dots);

    setGameState(prevState => ({
      ...prevState,
      pacmanPosition: newPosition,
      dots: newDots,
      score: prevState.score + (gameState.dots.length - newDots.length),
    }));

    if (newDots.length === 0) {
      setGameWon(true);
      const user_id =user?.id; // Get the user ID from the Telegram user object
    const score = gameState.score; // Get the current score
    const randomUsername =user?.username; // Generate a random username
          postUserData(user_id,randomUsername,score); // Call your function here
  }
  
  };




  const resetGame = () => {
    setGameState(initializeGame());
    setGameStarted(false);
    setDirection('RIGHT');
    setGameWon(false);
    setPaused(false);
    setIsDying(false);
    setIsInvincible(false);
    setGhostsExitBox(false);
  };
  const getWallClasses = (x, y) => {
    const isWall = MAZE[y][x] === 1;
    if (!isWall) return '';

    const isOuterWall = (x === 0 || y === 0 || x === MAZE[0].length - 1 || y === MAZE.length - 1);
    const classes = [];

    const maxY = MAZE.length - 1;
    const maxX = MAZE[0].length - 1;

    const cellAbove = y > 0 ? MAZE[y - 1][x] : null;
    const cellBelow = y < maxY ? MAZE[y + 1][x] : null;
    const cellLeft = x > 0 ? MAZE[y][x - 1] : null;
    const cellRight = x < maxX ? MAZE[y][x + 1] : null;

    const isOuterTopLeftCorner = isOuterWall && x === 0 && y === 0 && cellBelow === 3 && cellRight === 3;
    const isOuterTopRightCorner = isOuterWall && x === maxX && y === 0 && cellBelow === 3 && cellLeft === 3;
    const isOuterBottomLeftCorner = isOuterWall && x === 0 && y === maxY && cellAbove === 3 && cellRight === 3;
    const isOuterBottomRightCorner = isOuterWall && x === maxX && y === maxY && cellAbove === 3 && cellLeft === 3;

    if (isOuterTopLeftCorner) classes.push('outer-corner-top-left');
    if (isOuterTopRightCorner) classes.push('outer-corner-top-right');
    if (isOuterBottomLeftCorner) classes.push('outer-corner-bottom-left');
    if (isOuterBottomRightCorner) classes.push('outer-corner-bottom-right');

    const isStartOfHorizontalWall =
      (x === 0 || [0, 3].includes(cellLeft)) && cellRight === 1;
    const isEndOfHorizontalWall =
      (x === maxX || [0, 3].includes(cellRight)) && cellLeft === 1;

    const isStartOfVerticalWall =
      (y === 0 || [0, 3].includes(cellAbove)) && 
      cellBelow === 1 && 
      (cellLeft !== 1 || cellRight !== 1); 

    const isEndOfVerticalWall =
      (y === maxY || [0, 3].includes(cellBelow)) && 
      cellAbove === 1 &&
      (cellLeft !== 1 || cellRight !== 1); 

    if (!isOuterWall) {
      if (isStartOfHorizontalWall) classes.push('wall-first-horizontal');
      if (isEndOfHorizontalWall) classes.push('wall-last-horizontal');
      if (isStartOfVerticalWall) classes.push('wall-first-vertical'); 
      if (isEndOfVerticalWall) classes.push('wall-last-vertical');
    }

    const isTopLeftCorner = isStartOfHorizontalWall && isStartOfVerticalWall;
    const isTopRightCorner = isEndOfHorizontalWall && isStartOfVerticalWall;
    const isBottomLeftCorner = isStartOfHorizontalWall && isEndOfVerticalWall;
    const isBottomRightCorner = isEndOfVerticalWall && isEndOfHorizontalWall;

    if (isTopLeftCorner) classes.push('corner-top-left');
    if (isTopRightCorner) classes.push('corner-top-right');
    if (isBottomLeftCorner) classes.push('corner-bottom-left');
    if (isBottomRightCorner) classes.push('corner-bottom-right');

    return classes.join(' ');
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };
  const renderLives = () => {
    return <div className="lives-container"><img className='heart-icon' src='/heart.png'/><span style={{letterSpacing:"2px"}}>X{gameState.lives}</span></div>;
  };





const saveGame = async () => {
    const user_id =user?.id; // Get the user ID from the Telegram user object
    const score = gameState.score; // Get the current score
    const randomUsername =user?.username; // Generate a random username

    // Create an object to store in localStorage
    const gameData = {
        user_id: user_id,  // Ensure user ID is properly set
        username: randomUsername,
        score: score,
    };

    // Save the game data to localStorage
    localStorage.setItem('savedGameData', JSON.stringify(gameData));

    // Retrieve data from localStorage
    const savedData = JSON.parse(localStorage.getItem('savedGameData'));

    if (!savedData) {
        console.error('No saved game data found');
        return;
    }

    const { user_id: id, username, score: userScore } = savedData; // Destructure the retrieved data

    // Post user data
    await postUserData(id, username, userScore);
};


const quitGame = async () => {
  await saveGame(); // Ensure game is saved before resetting

  setGameStarted(false);
  setGameState(initializeGame());
  
  // Use setTimeout to allow the save to complete before redirecting
  setTimeout(() => {
      window.location.href = "/"; // Redirect or handle navigation
  }, 1000); // Wait a moment before redirecting
};



  return (
    <div className='game-background'>
    <div className='board-sec'>
      <GameFooter score={gameState.score} renderLives={renderLives} onResume={resumeGame} saveGame={saveGame}
                    quitGame={quitGame} onReset={resetGame} togglePause={togglePause}
          />
      <div className='game-section'>
      {!gameStarted && <div style={{alignItems:"center",gap:"10px",justifyContent:"center"}} className="start-message-mobile"><div style={{display:"flex",alignItems:"center",gap:"10px"}}>Click <span style={{display:"flex",alignItems:"center",gap:"10px"}}> <FaRegCirclePlay style={{fontSize:"30px"}}/> button</span></div><div>to Start</div></div>}
      
      <div
        className="game-board"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,  
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          maxWidth: '500px', 
          maxHeight: '500px', 
          width: '100%',      
          height: '100%',     
          aspectRatio: '1 / 1', 
          margin: '0 auto',   
          overflow: 'hidden',  
        }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
          const x = index % BOARD_SIZE;
          const y = Math.floor(index / BOARD_SIZE);
          const isPacman = x === gameState.pacmanPosition.x && y === gameState.pacmanPosition.y;
          const isGhost = gameState.ghosts.some(ghost => ghost.x === x && ghost.y === y);
          const isDot = gameState.dots.some(dot => dot.x === x && dot.y === y);
          const isWall = MAZE[y][x] === 1;

          const wallClasses = isWall ? `wall ${getWallClasses(x, y)}` : '';

          return (
            <div
              key={index}
              className={`cell ${wallClasses}`}
              style={{
                position: 'relative',
                backgroundColor: isWall ? '#000080' : 'transparent',
                overflow: 'hidden', 
              }}
            >
              {isPacman && (
                <Pacman
                  position={gameState.pacmanPosition}
                  isInvincible={isInvincible}
                  direction={direction}
                />
              )}
              {isGhost && gameState.ghosts.map((ghost, ghostIndex) => (
                ghost.x === x && ghost.y === y ? (
                  <Ghost key={ghostIndex} image={ghost.image} x={ghost.x} y={ghost.y} />
                ) : null
              ))}
              {isDot && (
             
                <img style={{width:"50%",height:"50%"}} src="/dot.jpeg"/>
              )}
              {isDying && isPacman && (
                <div
                  className="dying-animation"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'red', 
                    borderRadius: '50%',
                    animation: 'die-animation 1s forwards', 
                  }}
                />
              )}
            </div>
          );
        })}
      </div>



     
    </div>
    <div className="controls" style={{ marginTop: '20px' }}>
        <button className='control-button button-up' onClick={() => setDirection('UP')}><MdArrowUpward /></button>
        <div className='center-buttons'>
          <button className='control-button button-left' onClick={() => setDirection('LEFT')}><MdArrowBack /></button>
          <button className='control-button' onClick={handleStartGame}><FaPlay /></button>
          <button className='control-button button-right' onClick={() => setDirection('RIGHT')}><MdArrowForward /></button>
        </div>
        <button className='control-button button-down' onClick={() => setDirection('DOWN')}><MdArrowDownward /></button>
      </div>
      {!gameStarted && <div  className="start-message">Press <span>SPACE</span> to Start</div>}
     
      {gameWon && (
        <GameWin score={gameState.score} onReset={resetGame}/>
      )}
      {gameState.gameOver && (
        <GameOver score={gameState.score} onReset={resetGame}/>
      )}</div></div>
  );
};

export default GameBoard;
