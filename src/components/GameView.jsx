/* eslint-disable */
import React from "react";
import Canvas from "./GameCanvas";

export default function GameView({ game, canvasProps = {}, style = {}, ...rest } = {}) {
    return (
        <div id="game-view" { ...rest } style={{ ...style }}>
            <Canvas src={ game.state.view.current.camera.canvas } { ...canvasProps } />
        </div>
    );
}