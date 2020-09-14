import WebSocket from "ws";
import WebSocketNode from "../src/network/WebSocketNode";

const wsn = new WebSocketNode({
    wss: new WebSocket.Server({ port: 8080 }),
});
const c1 = new WebSocketNode({
    ws: new WebSocket(`ws://localhost:8080`),
});

setTimeout(() => c1.ws.close(), 2000);