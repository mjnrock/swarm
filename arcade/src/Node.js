import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export const EventType = {
    UPDATE: "Node.Next",
};

export default class Node extends EventEmitter {
    constructor({ state = {}, config = {}, id } = {}) {
        super();
        this.id = id || uuidv4();

        this.state = state;
        this.config = {
            suppress: false,    // Configuration flag to en/disable event dispatching

            ...config,
        };

        this._reducers = new Set();
        this._effects = new Set();
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

    next(...args) {
        for(let fn of this._reducers.values()) {
            if(fn instanceof Node) {
                this.state = fn.next.call(fn, this.state, ...args) || this.state;   // Allow for a Node itself to be a reducer (via its .next)
            } else {
                this.state = fn.call(this, this.state, ...args) || this.state;
            }
        }

        for(let fn of this._effects.values()) {
            fn.call(this, this.state, ...args);
        }

        if(this.config.suppress !== true) {
            this.emit(EventType.UPDATE, this.state);
        }

        return this.state;
    }

    addReducer(...fns) {
        for(let fn of fns) {
            if(typeof fn === "function" || fn instanceof Node) {
                this._reducers.add(fn);
            }
        }

        return this;
    }
    removeReducer(...fns) {
        for(let fn of fns) {
            this._reducers.delete(fn);
        }

        return this;
    }

    addEffect(...fns) {
        for(let fn of fns) {
            if(typeof fn === "function") {
                this._effects.add(fn);
            }
        }

        return this;
    }
    removeEffect(...fns) {
        for(let fn of fns) {
            this._effects.delete(fn);
        }

        return this;
    }
};