import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './game.css'

function LandingPage() {
    const [lastScore, setLastScore] = useState(null);
  const [hasScore, setHasScore] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize the Telegram WebApp
    const tg = window.Telegram ? window.Telegram.WebApp : null;
    if (tg) {
        tg.expand();

    // Get user data from Telegram
    const userData = tg.initDataUnsafe?.user;
    if (userData) {
      setUser(userData);
    }
  }}, []);
  const [topScores, setTopScores] = useState([]);


  useEffect(() => {
      const fetchUserScore = async (userId) => {
          try {
              const response = await fetch(`https://pacman-backend.vercel.app/user_score/${userId}/`);
              const data = await response.json();
              
              if (data?.last_score !== undefined) {
                  setLastScore(data.last_score);
                  setHasScore(true);
              } else {
                  setHasScore(false);
              }
          } catch (error) {
              console.error("Failed to fetch user score:", error);
          }
      };

      // Assuming you have the user ID from the Telegram API:
      const userId = user?.id;
      if (userId) {
          fetchUserScore(userId);
      }
  }, [user]);

    useEffect(() => {
        const fetchTopScores = async () => {
            try {
                const response = await fetch('https://pacman-backend.vercel.app/leaderboard');
                const data = await response.json();
                
                const topThreeScores = data
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3);
                
                setTopScores(topThreeScores);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchTopScores();
    }, []);
 
    return (
        <div className='landing-background'>
          
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
            }} className='landing-page'>
                 {topScores.length > 0 && (
                <div className='landing-header' style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "40px",
                    textAlign: "center"
                }}>
                    
                    <div>
                        <h2 style={{ color: "#D22B2B" }}>1UP</h2>
                        <h2 style={{ marginTop: "0", color: "#fff" }}>{topScores[1]?.score || 'N/A'}</h2>
                    </div>
                    <div>
                        <h2 style={{ color: "#D22B2B" }}>HIGH SCORE</h2>
                        <h2 style={{ marginTop: "0", color: "#fff" }}>{topScores[0].score}</h2>
                    </div>
                    <div>
                        <h2 style={{ color: "#D22B2B" }}>2UP</h2>
                        <h2 style={{ marginTop: "0", color: "#fff" }}>{topScores[2]?.score || 'N/A'}</h2>
                    </div>
                    
                </div>
                )}
                 {hasScore && <p style={{color:"gold",fontSize:"14px",textAlign:"left",margin:"10px 0"}}>Your Last Score: {lastScore}</p>}

                <p style={{ lineHeight: "30px", textAlign: "center" }}>PumpMan: Chompong Through Fear,more Candy at a
                    Time!</p>
                <img className='logo' style={{ width: "20%", height: "20%" }} src="/logo1.png" alt="" />
                <div className='buttons' style={{ display: "flex", flexDirection: "column", width: "45%" }}>

                    <ul class="custom-list">
                        <li><Link style={{ color: "white", textDecoration: "none" }} to="/pacman">Play</Link></li>
                        <li><Link style={{ color: "white", textDecoration: "none" }} to="/story1">Story</Link></li>
                        <li><Link style={{ color: "white", textDecoration: "none" }} to="/leaderboard">Leaderboard</Link></li>

                    </ul>
                </div>
                <img className='moving-icon'  src="/pill.png" alt=""/>
            <img className='moving-icon5'  src="/icon.jpeg" alt=""/>
            <img className='moving-icon4'  src="/bird.jpg" alt=""/>
            <a href="https://x.com/pumpman_sol" target="_blank" rel="noopener noreferrer">
                <img className='moving-icon2'  src="/icon2.jpeg" alt=""/>
            </a>
            <a href="https://t.me/pumpman_sol" target="_blank" rel="noopener noreferrer">
                <img className='moving-icon3'  src="/icon3.jpeg" alt=""/>
            </a>
            </div>
        </div>
    )
}

export default LandingPage