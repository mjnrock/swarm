import HID from "node-hid";
import { Bitwise } from "@lespantsfancy/hive/lib/ext/Helper";

// const HIDDevices = HID.devices();

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

    const active = [];
    for(let key in mask) {
        if(mask[ key ] === true) {
            active.push(key);
        }
    }

    if(active.length) {
        console.clear();
        console.log(active.join(" | "));
    } else {
        console.clear();
    }
});