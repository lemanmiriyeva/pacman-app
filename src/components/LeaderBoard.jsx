// src/Leaderboard.jsx
import React from 'react';
import './LeaderBoard.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom';

const Leaderboard = () => {
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
      const fetchLeaderboard = async () => {
        try {
            const response = await fetch('https://pacman-backend.vercel.app/leaderboard'); // Adjust URL as needed
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Leaderboard data:', data);
            return data; // Return the fetched leaderboard data
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };  
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        const loadLeaderboard = async () => {
            const data = await fetchLeaderboard();
            setLeaderboardData(data);
        };

        loadLeaderboard();
    }, []); 

    return (
        <div className="leaderboard">
            <header>
                <img src="/logo1.jpeg" alt="Pizza Hut Arcade" className="logo" />
            </header>
            <div className="scores">
                <h2>LEADERBOARD</h2>
                <div className="trophy-icon">🏆</div>
                <ul>
                    
                       {leaderboardData.map((entry, index) => (
                    <div className='leaderboard-item' key={index}>
                    <li>
                        <span className="name">@{entry.username}</span>
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
