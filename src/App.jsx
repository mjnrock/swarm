import React from "react";
import Node from "./_stub/Node";
import WebSocketNode from "./_stub/WebSocketNode";
import Station from "./_stub/broadcast/Station";
import { EnumEventType } from "./_stub/input/HIDGamePadNode";

const station = new Station([
    "server",
]);

const wsn = new WebSocketNode({
    ws: new WebSocket(`ws://localhost:8080`),
    receive: station.broadcast.bind(station),
});

station.join("server", wsn.next);

wsn.addReducer(Node.TypedMessage([
    EnumEventType.ACTIVATE,
    EnumEventType.DEACTIVATE,
], (state, msg) => {
    const { key, value } = msg.payload;

    if(value === false) {
        return {
            ...state,
    
            [ key ]: -Date.now(),   // If negative, last time a DEACTIVATE happened
        };
    }

    return {
        ...state,

        [ key ]: value,   // If positive, last time an ACTIVATE happened
    };
}));
wsn.addEffect((current, previous) => console.log(current));

function App() {
    return (
        <div>Test</div>
    );
}

export default App;