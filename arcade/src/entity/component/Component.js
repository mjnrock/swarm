import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export const EnumComponentType = {
    GRAPH: 2 << 0,
};

export const EnumEventType = {
    UPDATE: "UPDATE",
};

export default class Component extends EventEmitter {
    constructor(flag, state = {}, { id, hooks = {} } = {}) {
        super();

        this.id = id || uuidv4();
        this.flag = flag;
        this.hooks = hooks;
        this.state = state;

        return new Proxy(this, {
            get: (target, prop) => {
                // console.log(prop, prop in target, target[ prop ]);
                if(prop in target) {
                    return target[ prop ];
                }

                if(prop in this.state) {
                    return this.state[ prop ];
                }

                return target;
            },
            set: (target, prop, value) => {
                if(prop in this.state) {
                    if(prop in this.hooks && typeof this.hooks[ prop ] === "function") {
                        this.state[ prop ] = this.hooks[ prop ](value);
                    } else {
                        this.state[ prop ] = value;
                    }
                } else {
                    target[ prop ] = value;
                }

                return target;
            }
        })
    }

    /**
     * <target> convenience getter
    */
    get _() {
        return this;
    }

    merge(prop, input) {
        if(Array.isArray(this.state[ prop ])) {
            this.state[ prop ] = [
                ...this.state[ prop ],
                ...(input || [])
            ];
        } else if(typeof this.state[ prop ] === "object") {
            this.state[ prop ] = {
                ...this.state[ prop ],
                ...(input || {}),
            };
        } else {
            this.state[ prop ] = input;
        }
    }
};