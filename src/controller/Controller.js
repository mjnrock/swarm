import Node from "@lespantsfancy/hive/lib/Node";
import KeyNode, { EnumMessageType as EnumKeyMessageType } from "@lespantsfancy/hive/lib/client/KeyNode";
import MouseNode, { EnumMessageType as EnumMouseMessageType } from "@lespantsfancy/hive/lib/client/MouseNode";

// Convenience exports for binding assistance
export const EnumKeyMessage = { ...EnumKeyMessageType };
export const EnumMouseMessage = { ...EnumMouseMessageType };
export const CommonBindings = {
    Mouse: {
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2,
    },
    Key: {
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        TAB: 9,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
    },
};

export default class Controller extends Node {
    constructor({ key = {}, mouse = {}, bindings } = {}) {
        super({
            key: new KeyNode({
                element: window,
                ...key
            }),
            mouse: new MouseNode({
                element: window,                
                ...mouse
            }),
            bindings: bindings || {
                key: [],
                mouse: []
            },
        });
        
        this.key.addEffect((state, msg) => this.onKeyBinding(msg));
        this.mouse.addEffect((state, msg) => this.onMouseBinding(msg));
    }

    get key() {
        return this.state.key;
    }
    get mouse() {
        return this.state.mouse;
    }
    get bindings() {
        return this.state.bindings;
    }

    bindKey({ code, fn, type = EnumKeyMessageType.KEY_UP } = {}) {
        if(arguments.length >= 2) {
            code = arguments[ 0 ];
            fn = arguments[ 1 ];
        }
        if(arguments.length === 3) {
            type = arguments[ 2 ];
        }

        const bindings = {
            ...this.state.bindings,
            key: [
                ...this.state.bindings.key,
                code !== void 0 ? [ type, code, fn ] : [ type, fn ],
            ]
        };

        console.log(bindings, code, fn, type)

        this.mergeState({
            bindings,
        });

        return this;
    }
    unbindKey({ code, fn, type = EnumKeyMessageType.KEY_UP } = {}) {
        if(arguments.length >= 2) {
            code = arguments[ 0 ];
            fn = arguments[ 1 ];
        }
        if(arguments.length === 3) {
            type = arguments[ 2 ];
        }

        const bindings = {
            ...this.state.bindings,
            key: this.bindings.key.filter(([ c, f, et ]) => code !== c && fn !== f && type !== et),
        };
        
        this.mergeState({
            bindings,
        });

        return this;
    }

    onKeyBinding(msg) {
        for(let vals of this.bindings.key) {
            if(vals.length === 3) {
                const [ type, code, fn ] = vals;

                if(msg.type === type && msg.payload.code === code) {
                    fn.call(this, msg.payload, msg);
                }
            } else if(vals.length === 2) {
                const [ type, fn ] = vals;
                
                if(msg.type === type) {
                    fn.call(this, msg.payload, msg);
                }
            }
        }
    }

    bindMouse({ button, fn, type = EnumMouseMessageType.MOUSE_UP } = {}) {
        if(arguments.length >= 2) {
            button = arguments[ 0 ];
            fn = arguments[ 1 ];
        }
        if(arguments.length === 3) {
            type = arguments[ 2 ];
        }

        const bindings = {
            ...this.state.bindings,
            mouse: [
                ...this.state.bindings.mouse,
                [ type, button, fn ],
            ]
        };

        this.mergeState({
            bindings,
        });

        return this;
    }
    unbindMouse({ button, fn, type = EnumMouseMessageType.MOUSE_UP } = {}) {
        if(arguments.length >= 2) {
            button = arguments[ 0 ];
            fn = arguments[ 1 ];
        }
        if(arguments.length === 3) {
            type = arguments[ 2 ];
        }

        const bindings = {
            ...this.state.bindings,
            mouse: this.bindings.mouse.filter(([ b, f, et ]) => button !== b && fn !== f && type !== et),
        };
        
        this.mergeState({
            bindings,
        });

        return this;
    }

    onMouseBinding(msg) {
        for(let [ type, button, fn ] of this.bindings.mouse) {
            if(msg.type === type && msg.payload.button === button) {
                fn.call(this, msg.payload, msg);
            }
        }
    }
};