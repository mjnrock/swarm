import React from "react";
import WebSocketNode from "./_stub/WebSocketNode";

const c1 = new WebSocketNode({
    ws: new WebSocket(`ws://localhost:8080`),
    receive: console.log,
});

setTimeout(() => {
    c1.send("test", {
        cats: 1,
    });
}, 500);

function App() {
    return (
        <div>Test</div>
    );
}

export default App;