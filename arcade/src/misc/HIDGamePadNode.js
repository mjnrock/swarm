import HID from "node-hid";
import Node from "./../Node";
import { Bitwise } from "@lespantsfancy/hive/lib/ext/Helper";

/**
 * Entries, if modified, should conform to: [ byte index, bit flag, ?isEquality ] to use on the HID buffer
 * Will return a binding template for DragonRise::(vid=121, pid=6) testing.
 * When consumed by the Node, this.state.current (this.current) will look similar to this example:
 * {
    btn_1: false,
    btn_2: false,
    btn_3: false,
    btn_4: false,
    btn_5: false,
    btn_6: false,
    btn_start: false,        
    dir_left: false,
    dir_right: 1600122159977,
    dir_up: false,
    dir_down: 1600122159953  
    }
 * 
 * The "false" represents no current activation, while the "<long>" is the Date.now() of the activation (thus can be used for duration checking (e.g. channeling, regen, charging, etc.))
 */
export const BindingTemplate = () => ({
    btn_1: [ 5, 2 << 3 ],
    btn_2: [ 5, 2 << 4 ],
    btn_3: [ 5, 2 << 5 ],

    btn_4: [ 6, 2 << 0 ],
    btn_5: [ 6, 2 << 1 ],
    btn_6: [ 6, 2 << 2 ],

    btn_start: [ 6, 2 << 4 ],

    dir_left: [ 0, 255, true ],
    dir_right: [ 0, 0, true ],
    dir_up: [ 1, 255, true ],
    dir_down: [ 1, 0, true ],
});

export default class HIDGamePadNode extends Node {
    constructor({ path, vid, pid, binding = BindingTemplate() } = {}, opts = {}) {
        super(opts);

        try {
            if(path) {
                this.changeDeviceByPath(path);
            } else {
                this.changeDeviceByVendor(vid, pid);
            }
        } catch(e) {
            this.error(e);
        }

        this.state.binding = binding;
        this.state.current = {};
        
        for(let key in this.binding) {
            this.state.current[ key ] = false;
        }

        this.addReducer((state, buffer) => {
            if(buffer instanceof Buffer) {                
                const arr = [ ...buffer ];
                const result = { ...state.current };

                for(let key in this.binding) {
                    const [ byte, flag, isEquality ] = this.binding[ key ];

                    if(isEquality === true) {
                        if(result[ key ] === false) {
                            if(arr[ byte ] === flag) {
                                result[ key ] = Date.now();
                            }
                        } else {
                            if(arr[ byte ] !== flag) {
                                result[ key ] = false;
                            }
                        }
                    } else {
                        if(result[ key ] === false) {
                            if(Bitwise.has(arr[ byte ], flag)) {
                                result[ key ] = Date.now();
                            }
                        } else {
                            if(!Bitwise.has(arr[ byte ], flag)) {
                                result[ key ] = false;
                            }
                        }
                    }
                }

                return {
                    ...state,

                    current: result,
                };
            }

            return state;
        });
    }

    get current() {
        return this.state.current;
    }

    get device() {
        return this.state.device;
    }
    set device(device) {
        this.state.device = device;

        return this;
    }
    get binding() {
        return this.state.binding;
    }

    changeDeviceByPath(path) {
        this.device = new HID.HID(path);

        this.device.setNonBlocking(true);
        this.device.on("data", buffer => this.onBuffer(buffer));

        return this;
    }
    changeDeviceByVendor(vid, pid) {
        this.device = new HID.HID(vid, pid);

        this.device.setNonBlocking(true);
        this.device.on("data", buffer => this.onBuffer(buffer));

        return this;
    }

    rebind(item, arr) {
        if(typeof item === "object") {
            this.state.binding = {
                ...this.binding,
                ...item,
            };
        } else {        
            if(item in this.binding) {
                this.binding[ item ] = arr;
            }
        }

        return this;
    }

    onBuffer(buffer) {
        this.next(buffer);
    }
}