import WebSocket from "ws";
import WebSocketNode from "../src/network/WebSocketNode";
import HIDGamePadNode from "./../src/misc/HIDGamePadNode";
import { EnumEventType } from "./../src/Node";


const PORT = 8080;
const wsn = new WebSocketNode({
    wss: new WebSocket.Server({ port: PORT }),
});
const c1 = new WebSocketNode({
    ws: new WebSocket(`ws://localhost:${ PORT }`),
});

const hid = new HIDGamePadNode({ vid: 121, pid: 6 });
hid.addListener(EnumEventType.NEXT, obj => {
    c1.ws.send(JSON.stringify({
        type: "GamePad.Input",
        payload: obj.current.current
    }));
});