/* eslint-disable */
import React from "react";
import { Segment, Header } from "semantic-ui-react";

import ViewManager from "./../components/ViewManager";

export default function Home(props) {
    const subheader = [
        "Experienced Players Only",
        "A Game of Sneks",
        "Fun for the Whole Family",
        "Play with Grandma!",
        "Find Your Hole!",
        "There Be Sneks!",
    ];

    return (
        <Segment>
            <Header as="h1" textAlign="center" style={{ fontFamily: "Freckle Face", fontSize: "5em" }}>Snek!</Header>
            <Header as="h2" textAlign="center" style={{ fontFamily: "Freckle Face", fontWeight: 400 }}>{ subheader[ ~~(Math.random() * subheader.length) ] }</Header>

            <ViewManager />

            <div style={{ fontFamily: "PressStart2PRegular", fontSize: "1.2em" }}>Player 1: 0</div>
            <div style={{ fontFamily: "PressStart2PRegular", fontSize: "1.2em" }}>Player 2: 0</div>
            <div style={{ fontFamily: "PressStart2PRegular", fontSize: "1.2em" }}>Player 3: 0</div>
            <div style={{ fontFamily: "PressStart2PRegular", fontSize: "1.2em" }}>Player 4: 0</div>
        </Segment>
    )
}