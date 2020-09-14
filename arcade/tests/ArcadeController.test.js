import WebSocket from "ws";
import WebSocketNode from "../src/network/WebSocketNode";
import HIDGamePadNode from "./../src/misc/HIDGamePadNode";
import { EnumEventType } from "./../src/Node";

const hid = new HIDGamePadNode({ vid: 121, pid: 6 });
// hid.addListener(EnumEventType.ERROR, console.log);
hid.addListener(EnumEventType.NEXT, obj => {
    console.log(obj.current.current)
});

// c1.ws.send(JSON.stringify({
//     type: "GamePad.Input",
//     payload: n1.state
// }));

const PORT = 8080;
const wsn = new WebSocketNode({
    wss: new WebSocket.Server({ port: PORT }),
});
const c1 = new WebSocketNode({
    ws: new WebSocket(`ws://localhost:${ PORT }`),
});