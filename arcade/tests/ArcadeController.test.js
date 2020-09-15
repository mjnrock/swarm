import WebSocket from "ws";
import WebSocketNode from "../src/network/WebSocketNode";
import HIDGamePadNode, { EnumEventType as HIDEnumEventType } from "./../src/misc/HIDGamePadNode";
import { EnumEventType } from "./../src/Node";


const PORT = 8080;
const wsn = new WebSocketNode({
    wss: new WebSocket.Server({ port: PORT }),
});
const c1 = new WebSocketNode({
    ws: new WebSocket(`ws://localhost:${ PORT }`),
});

const hid = new HIDGamePadNode({ vid: 121, pid: 6 });

const wssend = (type, payload) => JSON.stringify({
    type,
    payload,
});


hid.addListener(HIDEnumEventType.ACTIVATE, obj => {
    c1.ws.send(wssend(HIDEnumEventType.ACTIVATE, obj));
});
hid.addListener(HIDEnumEventType.DEACTIVATE, obj => {
    c1.ws.send(wssend(HIDEnumEventType.DEACTIVATE, obj));
});
hid.addListener(HIDEnumEventType.CHORD_ACTIVE, obj => {
    c1.ws.send(wssend(HIDEnumEventType.CHORD_ACTIVE, obj));
});
hid.addListener(HIDEnumEventType.CHORD_DEACTIVATE, obj => {
    c1.ws.send(wssend(HIDEnumEventType.CHORD_DEACTIVATE, obj));
});