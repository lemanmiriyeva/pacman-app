import React from 'react'
import { Link } from 'react-router-dom'
import './game.css'

function LandingPage() {
    return (
        <div className='landing-background'>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
            }} className='landing-page'>
                <div className='landing-header' style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "40px",
                    textAlign: "center"
                }}>
                    <div>
                        <h2 style={{ color: "#D22B2B" }}>1UP</h2>
                        <h2 style={{ marginTop: "0", color: "#fff" }}>00</h2>
                    </div>
                    <div>
                        <h2 style={{ color: "#D22B2B" }}>HIGH SCORE</h2>
                        <h2 style={{ marginTop: "0", color: "#fff" }}>100000</h2>
                    </div>
                    <div>
                        <h2 style={{ color: "#D22B2B" }}>1UP</h2>
                        <h2 style={{ marginTop: "0", color: "#fff" }}>00</h2>
                    </div>
                </div>
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