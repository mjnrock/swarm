import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export default class Channel extends EventEmitter {
    constructor(subscribors = []) {
        super();
        this.id = uuidv4();

        this.subscribors = new Map(subscribors);
    }

    invoke(thisArg, type, ...args) {
        for(let [ fn, obj ] of this.subscribors.entries()) {
            if(obj.type === "only" && obj.entries.includes(type)) {
                fn(thisArg, type, ...args);
            } else if(obj.type === "ignore" && !obj.entries.includes(type)) {
                fn(thisArg, type, ...args);
            }
        }
    }

    join(fn, { only = [], ignore = [] } = {}) {
        if(typeof fn === "function") {
            if(only.length) {
                this.subscribors.set(fn, { type: "only", entries: only });
            } else if(ignore.length) {
                this.subscribors.set(fn, { type: "ignore", entries: ignore });
            } else {                
                this.subscribors.set(fn, { type: "ignore", entries: [] });
            }
        }
    }
    leave(fn) {
        this.subscribors.delete(fn);
    }
};