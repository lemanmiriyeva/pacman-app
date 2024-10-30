// src/Leaderboard.jsx
import React from 'react';
import './LeaderBoard.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom';

const Leaderboard = () => {
    const scores = [
        { name: "AAA", score: "1,234,567" },
        { name: "ISA", score: "934,567" },
        { name: "AND", score: "834,567" },
        { name: "EMM", score: "734,567" },
        { name: "RVG", score: "34,567" },
        { name: "TIM", score: "4,567" }
    ];

    return (
        <div className="leaderboard">
            <header>
                <img src="/logo1.jpeg" alt="Pizza Hut Arcade" className="logo" />
            </header>
            <div className="scores">
                <h2>LEADERBOARD</h2>
                <div className="trophy-icon">🏆</div>
                <ul>
                    {scores.map((entry, index) => (
                        <div className='leaderboard-item' key={index}>
                        <li>
                            <span className="name">{entry.name}</span>
                            <span className="dots">...</span>
                            <span className="score">{entry.score}</span>
                            
                        </li>
                        </div>
                    ))}
                </ul>
            </div>
            <Link to={"/pacman"} className="play-again">PLAY AGAIN</Link>
            <footer>
                <p><img style={{width:"24px",height:"24px"}} src="/game.jpeg" alt="" /> SHARE YOUR SCORE <img style={{width:"24px",height:"24px",transform:"scaleX(-1)"}} src="/game.jpeg" alt="" /></p>
            </footer>
        </div>
    );
};

export default Leaderboard;
