/* eslint-disable */
import React, { Fragment } from "react";
import { useNodeContext } from "@lespantsfancy/hive/lib/react";

import { Context } from "../App";
import GameView from "../lib/view/GameView";
import GameViewComponent from "./GameView";

export default function ViewManager(props) {
    const { node: game, state } = useNodeContext(Context);

    let current = null;
    if(state.view.current instanceof GameView) {
        current = (
            <GameViewComponent game={ game } />
        );
    }

    return (
        <Fragment>
            { current }
        </Fragment>
    );
}