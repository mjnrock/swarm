import WebSocket from "ws";
import WebSocketNode from "./../../network/WebSocketNode";

const wss = new WebSocketNode({
    wss: new WebSocket.Server({ port: 8080 }),
    receive: console.info,
});

console.log(`WebSocket Server is running on port:`, 8080);