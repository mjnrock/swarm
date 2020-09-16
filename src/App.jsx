import React from "react";
import WebSocketNode from "./_stub/WebSocketNode";

// eslint-disable-next-line
const c1 = new WebSocketNode({
    ws: new WebSocket(`ws://localhost:8080`),
    receive: console.info,
});

function App() {
    return (
        <div>Test</div>
    );
}

export default App;