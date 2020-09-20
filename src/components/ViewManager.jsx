/* eslint-disable */
import React, { Fragment, useEffect, useState } from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";

import { Button, Icon } from "semantic-ui-react";

import Game from "../lib/Game";
import { Context } from "../App";
import GameView from "../lib/view/GameView";
import TitleView from "../lib/view/TitleView";
import GameViewComponent from "./GameView";
import TitleViewComponent from "./TitleView";

export function Wrapper(props) {
    const { state } = useNodeContext(Context);
    
    return (        
        <Fragment>
            <Button icon onClick={ e => {
                console.info(state.view.current.camera.canvas.toDataURL("image/png"));
            }}>
                <Icon name="camera retro" />
                <Icon corner name="add" />
            </Button>
            
            { props.children }
        </Fragment>
    );
}

export default function ViewManager(props) {
    const { node: game, state } = useNodeContext(Context);

    let current = null;
    if(state.view.current instanceof GameView) {
        current = (
            <GameViewComponent game={ game } />
        );
    }

    return (
        <Wrapper>
            { current }
        </Wrapper>
    );
}