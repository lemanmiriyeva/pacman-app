import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegCirclePause } from "react-icons/fa6";
import Modal from 'react-modal';

function GameWin({score,onReset}) {
    
    const [showModal, setShowModal] = useState(true);
  return (
    <div>
        <Modal
                isOpen={showModal}
                contentLabel="Pause Menu"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"center"
                    }
                }}
            >
                <h1 style={{color:"green",textTransform:"uppercase",lineHeight:"1.5",textAlign:"center",letterSpacing:"2px"}}>You Win!</h1>
                <p style={{color:"#fff",textTransform:"uppercase",lineHeight:"1.5",textAlign:"center",letterSpacing:"2px"}}>Your score is {score}</p>
            
                <button onClick={() => {
                    onReset();
                    setShowModal(false); // Close modal on reset
                }} className="play-again">PLAY AGAIN</button>   
            </Modal>
    </div>
  )
}

export default GameWin