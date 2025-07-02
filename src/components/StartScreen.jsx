import React from "react";
import "./StartScreen.css";

function StartScreen({ startGame }) {
    return (
        <div className="start">
            <h1>Scret Word</h1>
            <p>Clique no botão para começar a jogar</p>
            <button onClick={startGame}>Começar o jogo</button>
        </div>
    )
}

export default StartScreen;