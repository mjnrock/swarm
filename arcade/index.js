import HID from "node-hid";
import { Bitwise } from "@lespantsfancy/hive/lib/ext/Helper";

const HIDDevices = HID.devices();
const DragonRise = new HID.HID(121, 6);


DragonRise.setNonBlocking(true);
DragonRise.on("data", buffer => {
    const [ lr, ud,,,, row1, row2 ] = [ ...buffer ];
    const DIRECTIONS = {
        UP: 255,
        DOWN: 0,
        LEFT: 255,
        RIGHT: 0,
    };

    const Mask = {
        b1: Bitwise.has(row1, 2 << 3),
        b2: Bitwise.has(row1, 2 << 4),
        b3: Bitwise.has(row1, 2 << 5),

        b4: Bitwise.has(row2, 2 << 0),
        b5: Bitwise.has(row2, 2 << 1),
        b6: Bitwise.has(row2, 2 << 2),

        start: Bitwise.has(row2, 2 << 4),

        left: lr === DIRECTIONS.LEFT,
        right: lr === DIRECTIONS.RIGHT,
        up: ud === DIRECTIONS.UP,
        down: ud === DIRECTIONS.DOWN,
        
        direction: [],
    };

    if(Mask.left) {
        Mask.direction.push("left");
    }
    if(Mask.right) {
        Mask.direction.push("right");
    }
    if(Mask.up) {
        Mask.direction.push("up");
    }
    if(Mask.down) {
        Mask.direction.push("down");
    }


    console.log(JSON.stringify(Mask));

    // console.log(JSON.stringify([ ...buffer ]));
});