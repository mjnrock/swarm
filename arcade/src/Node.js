import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { deepEqual } from "fast-equals";

export const EnumEventType = {
    NEXT: "Node.Next",
    ERROR: "Node.Error",
};

export default class Node extends EventEmitter {
    constructor({ state = {}, config = {}, id } = {}) {
        super();
        this.id = id || uuidv4();

        this.state = state;
        this.config = {
            suppress: false,    // Configuration flag to en/disable event dispatching

            ...config,          // Any additional meta data that is relevant to the runtime node (accessible via "this.config" in reducer/effect)
        };

        this._reducers = new Set();
        this._effects = new Set();
    }


    addReducer(...fns) {
        for(let fn of fns) {
            if(typeof fn === "function" || fn instanceof Node) {
                this._reducers.add(fn);
            }
        }
    }
    removeReducer(...fns) {
        for(let fn of fns) {
            this._reducers.delete(fn);
        }
    }

    addEffect(...fns) {
        for(let fn of fns) {
            if(typeof fn === "function" || fn instanceof Node) {
                this._effects.add(fn);
            }
        }
    }
    removeEffect(...fns) {
        for(let fn of fns) {
            this._effects.delete(fn);
        }
    }
    

    // "Safe" state traverser
    $(path) {
        let tiers;
        if(typeof path === "string" || path instanceof String) {
            tiers = path.split(".");
        } else if(Array.isArray(path)) {
            tiers = path;
        }

        if(!Array.isArray(tiers)) {
            return;
        }

        let result = this.state;
        for(let tier of tiers) {
            if(tier in result) {
                result = result[ tier ];
            } else {
                // Short circuit void
                return;
            }
        }

        return result;
    }

    /**
     * Reducers should "return @state;" to prevent a NEXT event, or "return { ...@state };" to invoke it, instead.
     * @param  {...any} args 
     */
    next(...args) {
        const oldState = { ...this.state };
        let newState = this.state;

        for(let fn of this._reducers.values()) {
            if(fn instanceof Node) {
                newState = fn.next.call(fn, newState, ...args);   // Allow for a Node itself to be a reducer (via its .next)
            } else {
                newState = fn.call(this, newState, ...args);
            }
        }

        if(this.state === newState) {
            return;
        } else if(!deepEqual(this.state, newState)) {    //FIXME This could be a faster comparison, instead
            this.state = newState;

            if(this.config.suppress !== true) {
                //NOTE  As this is just an information event, spread syntax is used; therefore, utilize accordingly (e.g. no classes will remain)
                this.emit(EnumEventType.NEXT, {
                    current: { ...newState },
                    previous: oldState,
                });
            }
        }

        for(let fn of this._effects.values()) {
            if(fn instanceof Node) {
                fn.next(...args);   // Allow for a Node itself to be invoked as a direct consequence of another Node's invocation
            } else {
                fn.call(this, this.state, ...args);
            }
        }

        return this.state;
    }


    suppress() {
        this.config.suppress = true;

        return this;
    }
    unsuppress() {
        this.config.suppress = false;

        return this;
    }


    error(e) {
        this.emit(EnumEventType.ERROR, e);
    }
};