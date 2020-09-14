import WebSocket from "ws";
import WebSocketNode from "../src/network/WebSocketNode";
import Node from "./../src/Node";
import HID from "node-hid";
import { Bitwise } from "@lespantsfancy/hive/lib/ext/Helper";

const n1 = new Node({
    state: {
        btn_1: false,
        btn_2: false,
        btn_3: false,

        btn_4: false,
        btn_5: false,
        btn_6: false,

        btn_start: false,

        dir_left: false,
        dir_right: false,
        dir_up: false,
        dir_down: false,
    }
});

const PORT = 8080;
const wsn = new WebSocketNode({
    wss: new WebSocket.Server({ port: PORT }),
});
const c1 = new WebSocketNode({
    ws: new WebSocket(`ws://localhost:${ PORT }`),
});

const DragonRise = new HID.HID(121, 6);
DragonRise.setNonBlocking(true);
DragonRise.on("data", buffer => {
    const [ lr, ud,,,, row1, row2 ] = [ ...buffer ];
    const mask = {
        btn_1: Bitwise.has(row1, 2 << 3),
        btn_2: Bitwise.has(row1, 2 << 4),
        btn_3: Bitwise.has(row1, 2 << 5),

        btn_4: Bitwise.has(row2, 2 << 0),
        btn_5: Bitwise.has(row2, 2 << 1),
        btn_6: Bitwise.has(row2, 2 << 2),

        btn_start: Bitwise.has(row2, 2 << 4),

        dir_left: lr === 255,
        dir_right: lr ===0,
        dir_up: ud === 255,
        dir_down: ud === 0,
    };

    if(JSON.stringify(n1.state) !== JSON.stringify(mask)) {
        n1.state = mask;
        c1.ws.send(JSON.stringify({
            type: "GamePad.Input",
            payload: n1.state
        }));
    }
});