import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegCirclePause } from "react-icons/fa6";
import Modal from 'react-modal';

Modal.setAppElement('#root'); // This is needed for accessibility; set it to your app's root element.

function GameFooter({ score, renderLives, saveGame, quitGame,onResume,onReset,togglePause }) {
    const [showModal, setShowModal] = useState(false);

    const handleSaveAndQuit = () => {
        saveGame();
        quitGame();
        setShowModal(false);
    };

    const handlePauseToggle = () => {
        setShowModal(prev => !prev); // Open or close modal on toggle
        togglePause();
    };

    return (
        <div className='game-footer'>
            <div className='info' style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="score">
                    <img src="/coin.png" alt="coin icon" />
                    {score}
                </div>
                <div className="lives">
                    <h3 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                        {renderLives()}
                    </h3>
                </div>
                <button className='pause-button' onClick={handlePauseToggle}>
                    <FaRegCirclePause />
                </button>
            </div>

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
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }
                }}
            >
                <h2>Paused</h2>
                <button onClick={() => {
                    onResume();
                    setShowModal(false); // Close modal on resume
                }} className='button-modal'>Resume</button>
                <button onClick={() => {
                    onReset();
                    setShowModal(false); // Close modal on reset
                }} className='button-modal'>Restart</button>
                <button onClick={handleSaveAndQuit} className='button-modal'>Save and Quit</button>
                <button onClick={handleSaveAndQuit} className='button-modal'>Return to Main Menu</button>
            </Modal>
        </div>
    );
}

export default GameFooter;
