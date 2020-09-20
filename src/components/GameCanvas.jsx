import React, { useEffect } from "react";

import Game from "./../lib/demo/snake/Game";

export default function GameCanvas(props) {
    const { src: propsSrc, onDraw, ...rest } = props;

    let canvasRef = React.createRef();

    useEffect(() => {
        const ref = canvasRef.current;

        if(Game.$.state.react.canvas !== ref) {
            Game.$.state.react.canvas = ref;
        }
    });

    return (
        <canvas ref={ canvasRef } { ...rest } />
    );
};