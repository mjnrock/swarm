import WebSocket from "ws";
import WebSocketNode from "./../../network/WebSocketNode";
import HIDGamePadNode, { EnumEventType  } from "./../../input/HIDGamePadNode";

const hid = new HIDGamePadNode({ vid: 121, pid: 6 });
const wss = new WebSocketNode({
    wss: new WebSocket.Server({ port: 8080 }),
    receive: console.info,
});

hid.on(EnumEventType.ACTIVATE, e => wss.broadcast(EnumEventType.ACTIVATE, e));
hid.on(EnumEventType.DEACTIVATE, e => wss.broadcast(EnumEventType.DEACTIVATE, e));

console.log(`WebSocket Server is running on port:`, 8080);